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
from typing import Any, Optional

import backoff
from flask import request, Response
from flask_appbuilder.api import expose, protect, request, rison, safe
from flask_appbuilder.models.sqla.interface import SQLAInterface
from flask_appbuilder.hooks import before_request

from superset import db, event_logger, is_feature_enabled
from superset.constants import MODEL_API_RW_METHOD_PERMISSION_MAP, RouteMethod
from superset.daos.source import SourceDAO
from superset.databases.filters import DatabaseFilter
from superset.exceptions import SupersetException
from superset.models.source import Source
from superset.sources.filters import SourceFilter
from superset.sources.schemas import (
    openapi_spec_methods_override,
    queries_get_updated_since_schema,
)
from superset.superset_typing import FlaskResponse
from superset.views.base_api import (
    BaseSupersetModelRestApi,
    RelatedFieldFilter,
    requires_json,
    statsd_metrics,
)
from superset.views.filters import BaseFilterRelatedUsers, FilterRelatedOwners

logger = logging.getLogger(__name__)


class SourceRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(Source)

    resource_name = "sources"

    @before_request
    def ensure_airbyte_sources_enabled(self) -> Optional[Response]:
        if not is_feature_enabled("ENABLE_AIRBYTE_SOURCES"):
            return self.response_404()
        return None

    class_permission_name = "Dataset"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    allow_browser_login = True
    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET | {
        RouteMethod.EXPORT,
        RouteMethod.IMPORT,
        RouteMethod.LIST
    }

    list_columns = [
        "id",
        "source_name"
    ]
    show_columns = [
        "id",
        "source_name"
    ]
    base_filters = [["id", SourceFilter, lambda: []]]
    base_order = ("changed_on", "desc")

    openapi_spec_tag = "Sources"
    openapi_spec_methods = openapi_spec_methods_override

    order_columns = [
        "source_name"
    ]
    base_related_field_filters = {
        "created_by": [["id", BaseFilterRelatedUsers, lambda: []]],
        "changed_by": [["id", BaseFilterRelatedUsers, lambda: []]],
        "user": [["id", BaseFilterRelatedUsers, lambda: []]],
        "database": [["id", DatabaseFilter, lambda: []]],
    }
    related_field_filters = {
        "created_by": RelatedFieldFilter("first_name", FilterRelatedOwners),
        "changed_by": RelatedFieldFilter("first_name", FilterRelatedOwners),
        "user": RelatedFieldFilter("first_name", FilterRelatedOwners),
    }

    search_columns = [
       "source_name"
    ]

    allowed_rel_fields = {"database", "user"}
    allowed_distinct_fields = {"status"}