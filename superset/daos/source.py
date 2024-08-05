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
import logging
from datetime import datetime
from typing import Any, Union

from superset.daos.base import BaseDAO
from superset.extensions import db
from superset.models.source import Source
from superset.sources.filters import SourceFilter
from superset.utils.core import get_user_id

logger = logging.getLogger(__name__)


class SourceDAO(BaseDAO[Source]):
    base_filter = SourceFilter

    @staticmethod
    def update_saved_query_exec_info(query_id: int) -> None:
        """
        Propagates query execution info back to saved query if applicable

        :param query_id: The query id
        :return:
        """
        query = db.session.query(Source).get(query_id)

    @staticmethod
    def save_metadata(source: Source, payload: dict[str, Any]) -> None:
        # pull relevant data from payload and store in extra_json
        columns = payload.get("columns", {})
        for col in columns:
            if "name" in col:
                col["column_name"] = col.get("name")
        db.session.add(source)
        source.set_extra_json_key("columns", columns)

    @staticmethod
    def get_sources_changed_after(last_updated_ms: Union[float, int]) -> list[Source]:
        # UTC date time, same that is stored in the DB.
        last_updated_dt = datetime.utcfromtimestamp(last_updated_ms / 1000)

        return (
            db.session.query(Source)
            .filter(Source.user_id == get_user_id(), Source.changed_on >= last_updated_dt)
            .all()
        )