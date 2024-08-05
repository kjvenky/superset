# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
from __future__ import annotations

import logging
from typing import Any, TYPE_CHECKING
from urllib import parse

import sqlalchemy as sqla
from flask_appbuilder import Model
from flask_appbuilder.models.decorators import renders
from markupsafe import escape, Markup
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
)
from sqlalchemy.engine.base import Connection
from sqlalchemy.orm import relationship
from sqlalchemy.orm.mapper import Mapper

from superset import db, is_feature_enabled, security_manager
from superset.legacy import update_time_range
from superset.models.helpers import AuditMixinNullable, ExtraJSONMixin, ImportExportMixin
from superset.tasks.thumbnails import cache_chart_thumbnail
from superset.tasks.utils import get_current_user
from superset.thumbnails.digest import get_chart_digest
from superset.utils import core as utils, json
from superset.viz import BaseViz, viz_types

metadata = Model.metadata  # pylint: disable=no-member
source_user = Table(
    "source_user",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("ab_user.id", ondelete="CASCADE")),
    Column("source_id", Integer, ForeignKey("sources.id", ondelete="CASCADE")),
) 
logger = logging.getLogger(__name__)


class Source(  # pylint: disable=too-many-public-methods
    Model, AuditMixinNullable, ExtraJSONMixin, ImportExportMixin
):
    """ORM model for Sources"""

    __tablename__ = "sources"
    id = Column(Integer, primary_key=True)
    source_name = Column(String(250))
    source_type = Column(String(200))
    description = Column(Text)
    cache_timeout = Column(Integer)
    perm = Column(String(1000))
    schema_perm = Column(String(1000))
    catalog_perm = Column(String(1000), nullable=True, default=None)
    # the last time a user has saved the chart, changed_on is referencing
    # when the database row was last written
    last_saved_at = Column(DateTime, nullable=True)
    last_saved_by_fk = Column(Integer, ForeignKey("ab_user.id"), nullable=True)
    is_managed_externally = Column(Boolean, nullable=False, default=False)
    external_url = Column(Text, nullable=True)
    last_saved_by = relationship(
        security_manager.user_model, foreign_keys=[last_saved_by_fk]
    )
    owners = relationship(
        security_manager.user_model,
        secondary=source_user,
        passive_deletes=True,
    )
    tags = relationship(
        "Tag",
        secondary="tagged_object",
        overlaps="objects,tag,tags",
        primaryjoin="and_(Slice.id == TaggedObject.object_id, "
        "TaggedObject.object_type == 'chart')",
        secondaryjoin="TaggedObject.tag_id == Tag.id",
        viewonly=True,  # cascading deletion already handled by superset.tags.models.ObjectUpdater.after_delete
    )

    token = ""

    export_fields = [
        "source_name",
        "description",
        "params",
        "query_context",
        "cache_timeout",
    ]
    export_parent = "table"
    extra_import_fields = ["is_managed_externally", "external_url"]

    def __repr__(self) -> str:
        return self.source_name or str(self.id)

    def clone(self) -> Source:
        return Source(
            source_name=self.source_name,
            datasource_id=self.datasource_id,
            datasource_type=self.datasource_type,
            datasource_name=self.datasource_name,
            viz_type=self.viz_type,
            params=self.params,
            description=self.description,
            cache_timeout=self.cache_timeout,
        )



    # pylint: enable=using-constant-test
    @property
    def description_markeddown(self) -> str:
        return utils.markdown(self.description)

    @property
    def data(self) -> dict[str, Any]:
        """Data used to render slice in templates"""
        data: dict[str, Any] = {}
        self.token = ""
        try:
            self.token = utils.get_form_data_token(data)
        except Exception as ex:  # pylint: disable=broad-except
            logger.exception(ex)
            data["error"] = str(ex)
        return {
            "cache_timeout": self.cache_timeout,
            "changed_on": self.changed_on.isoformat(),
            "changed_on_humanized": self.changed_on_humanized,
            "description": self.description,
            "description_markeddown": self.description_markeddown,
            "edit_url": self.edit_url,
            "form_data": self.form_data,
            "query_context": self.query_context,
            "modified": self.modified(),
            "owners": [owner.id for owner in self.owners],
            "source_id": self.id,
            "source_name": self.source_name,
            "is_managed_externally": self.is_managed_externally,
        }

    @property
    def digest(self) -> str:
        return get_chart_digest(self)

    @property
    def json_data(self) -> str:
        return json.dumps(self.data)

    @property
    def form_data(self) -> dict[str, Any]:
        form_data: dict[str, Any] = {}
        try:
            form_data = json.loads(self.params)
        except Exception as ex:  # pylint: disable=broad-except
            logger.error("Malformed json in slice's params", exc_info=True)
            logger.exception(ex)
        form_data.update(
            {
                "source_name": self.id,
                "datasource": f"{self.datasource_id}__{self.datasource_type}",
            }
        )

        if self.cache_timeout:
            form_data["cache_timeout"] = self.cache_timeout
        update_time_range(form_data)
        return form_data

    def get_explore_url(
        self,
        base_url: str = "/explore",
        overrides: dict[str, Any] | None = None,
    ) -> str:
        return self.build_explore_url(self.id, base_url, overrides)

    @staticmethod
    def build_explore_url(
        id_: int, base_url: str = "/explore", overrides: dict[str, Any] | None = None
    ) -> str:
        overrides = overrides or {}
        form_data = {"source_name": id_}
        form_data.update(overrides)
        params = parse.quote(json.dumps(form_data))
        return f"{base_url}/?source_id={id_}&form_data={params}"


    @property
    def explore_json_url(self) -> str:
        """Defines the url to access the slice"""
        return self.get_explore_url("/superset/explore_json")

    @property
    def icons(self) -> str:
        return f"""
        <a
                href="{self.datasource_edit_url}"
                data-toggle="tooltip"
                title="{self.datasource}">
            <i class="fa fa-database"></i>
        </a>
        """

    @property
    def url(self) -> str:
        return f"/explore/?source_id={self.id}"

    @classmethod
    def get(cls, id_: int) -> Source:
        qry = db.session.query(Source).filter_by(id=id_)
        return qry.one_or_none()


def set_related_perm(_mapper: Mapper, _connection: Connection, target: Source) -> None:
    src_class = target.cls_model
    if id_ := target.datasource_id:
        ds = db.session.query(src_class).filter_by(id=int(id_)).first()
        if ds:
            target.perm = ds.perm
            target.schema_perm = ds.schema_perm


def event_after_chart_changed(
    _mapper: Mapper, _connection: Connection, target: Source
) -> None:
    cache_chart_thumbnail.delay(
        current_user=get_current_user(),
        chart_id=target.id,
        force=True,
    )


sqla.event.listen(Source, "before_insert", set_related_perm)
sqla.event.listen(Source, "before_update", set_related_perm)