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
from flask_babel import lazy_gettext as _
from markupsafe import Markup

from superset.views.sources.filters import SourceFilter


class SourceMixin:  # pylint: disable=too-few-public-methods
    list_title = _("Sources")
    show_title = _("Show Source")
    add_title = _("Add Source")
    edit_title = _("Edit Source")

    can_add = False
    search_columns = (
        "source_name",
        "description",
        "owners",
    )
    list_columns = ["source_link", "creator", "modified"]
    order_columns = [
        "source_name",
        "modified",
        "changed_on",
    ]
    edit_columns = [
        "source_name",
        "description",
        "owners",
        "cache_timeout",
    ]
    base_order = ("changed_on", "desc")
    description_columns = {
        "description": Markup(
            "The content here can be displayed as widget headers in the "
            "dashboard view. Supports "
            '<a href="https://daringfireball.net/projects/markdown/"">'
            "markdown</a>"
        ),
        "params": _(
            "These parameters are generated dynamically when clicking "
            "the save or overwrite button in the explore view. This JSON "
            "object is exposed here for reference and for power users who may "
            "want to alter specific parameters."
        ),
        "cache_timeout": _(
            "Duration (in seconds) of the caching timeout for this Source. "
            "Note this defaults to the datasource/table timeout if undefined."
        ),
    }
    base_filters = [["id", SourceFilter, lambda: []]]
    label_columns = {
    }