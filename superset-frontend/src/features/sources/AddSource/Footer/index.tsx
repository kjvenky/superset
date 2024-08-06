/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { useHistory } from 'react-router-dom';
import Button from 'src/components/Button';
import { t } from '@superset-ui/core';
import { useSingleViewResource } from 'src/views/CRUD/hooks';
import { logEvent } from 'src/logger/actions';
import withToasts from 'src/components/MessageToasts/withToasts';
import {
  LOG_ACTIONS_DATASET_CREATION_EMPTY_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_DATABASE_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_SCHEMA_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_TABLE_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_SUCCESS,
} from 'src/logger/LogUtils';
import { SourceObject } from '../types';

interface FooterProps {
  url: string;
  addDangerToast: () => void;
  sourceObject?: Partial<SourceObject> | null;
  onDatasetAdd?: (dataset: SourceObject) => void;
  hasColumns?: boolean;
  datasets?: (string | null | undefined)[] | undefined;
}

const INPUT_FIELDS = ['db', 'schema', 'table_name'];
const LOG_ACTIONS = [
  LOG_ACTIONS_DATASET_CREATION_EMPTY_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_DATABASE_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_SCHEMA_CANCELLATION,
  LOG_ACTIONS_DATASET_CREATION_TABLE_CANCELLATION,
];

function Footer({
  sourceObject,
  addDangerToast,
  hasColumns = false,
  datasets,
}: FooterProps) {
  const history = useHistory();
  const { createResource } = useSingleViewResource<Partial<SourceObject>>(
    'dataset',
    t('dataset'),
    addDangerToast,
  );

  const createLogAction = (dataset: Partial<SourceObject>) => {
    let totalCount = 0;
    const value = Object.keys(dataset).reduce((total, key) => {
      if (INPUT_FIELDS.includes(key) && dataset[key]) {
        totalCount += 1;
      }
      return totalCount;
    }, 0);

    return LOG_ACTIONS[value];
  };

  const cancelButtonOnClick = () => {
    if (!sourceObject) {
      logEvent(LOG_ACTIONS_DATASET_CREATION_EMPTY_CANCELLATION, {});
    } else {
      const logAction = createLogAction(sourceObject);
      logEvent(logAction, sourceObject);
    }
    history.goBack();
  };

  const tooltipText = t('Select a source to add.');

  const onSave = () => {
    if (sourceObject) {
      const data = {
        database: sourceObject.db?.id,
        catalog: sourceObject.catalog,
        schema: sourceObject.schema,
        table_name: sourceObject.table_name,
      };
      createResource(data).then(response => {
        if (!response) {
          return;
        }
        if (typeof response === 'number') {
          logEvent(LOG_ACTIONS_DATASET_CREATION_SUCCESS, sourceObject);
          // When a dataset is created the response we get is its ID number
          history.push(`/chart/add/?dataset=${sourceObject.table_name}`);
        }
      });
    }
  };
  const TEST_SOURCE = t('Test source');
  const CREATE_SOURCE_TEXT = t('Save source');
  const disabledCheck =
    !sourceObject?.table_name ||
    !hasColumns ||
    datasets?.includes(sourceObject?.table_name);

  return (
    <>
      <Button onClick={cancelButtonOnClick}>{t('Cancel')}</Button>
      <Button
        buttonStyle="primary"
        disabled={disabledCheck}
        tooltip={!sourceObject?.table_name ? tooltipText : undefined}
        onClick={onSave}
      >
        {TEST_SOURCE}
      </Button>
      <Button
        buttonStyle="primary"
        disabled={disabledCheck}
        tooltip={!sourceObject?.table_name ? tooltipText : undefined}
        onClick={onSave}
      >
        {CREATE_SOURCE_TEXT}
      </Button>
    </>
  );
}

export default withToasts(Footer);
