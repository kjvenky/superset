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
import { useEffect, SetStateAction, Dispatch, useCallback, ReactNode } from 'react';
import { styled, t } from '@superset-ui/core';
import TableSelector, { TableOption } from 'src/components/TableSelector';
import { DatabaseObject } from 'src/components/DatabaseSelector';
import { emptyStateComponent } from 'src/components/EmptyState';
import { useToasts } from 'src/components/MessageToasts/withToasts';
import { LocalStorageKeys, getItem } from 'src/utils/localStorageHelpers';
import { Table } from 'src/hooks/apiResources';
import { SourceActionType, SourceObject } from '../types';
import { AsyncSelect, Select } from 'src/components';
import RefreshLabel from 'src/components/RefreshLabel';
import { FormLabel } from 'src/components/Form';
import {
  useCatalogs,
  CatalogOption,
  useSchemas,
  SchemaOption,
} from 'src/hooks/apiResources';

interface LeftPanelProps {
  setSource: Dispatch<SetStateAction<object>>;
  source?: Partial<SourceObject> | null;
  sourceNames?: (string | null | undefined)[] | undefined;
}

const LeftPanelStyle = styled.div`
  ${({ theme }) => `
    padding: ${theme.gridUnit * 4}px;
    height: 100%;
    background-color: ${theme.colors.grayscale.light5};
    position: relative;
    .emptystate {
      height: auto;
      margin-top: ${theme.gridUnit * 17.5}px;
    }
    .section-title {
      margin-top: ${theme.gridUnit * 5.5}px;
      margin-bottom: ${theme.gridUnit * 11}px;
      font-weight: ${theme.typography.weights.bold};
    }
    .table-title {
      margin-top: ${theme.gridUnit * 11}px;
      margin-bottom: ${theme.gridUnit * 6}px;
      font-weight: ${theme.typography.weights.bold};
    }
    .options-list {
      overflow: auto;
      position: absolute;
      bottom: 0;
      top: ${theme.gridUnit * 92.25}px;
      left: ${theme.gridUnit * 3.25}px;
      right: 0;

      .no-scrollbar {
        margin-right: ${theme.gridUnit * 4}px;
      }

      .options {
        cursor: pointer;
        padding: ${theme.gridUnit * 1.75}px;
        border-radius: ${theme.borderRadius}px;
        :hover {
          background-color: ${theme.colors.grayscale.light4}
        }
      }

      .options-highlighted {
        cursor: pointer;
        padding: ${theme.gridUnit * 1.75}px;
        border-radius: ${theme.borderRadius}px;
        background-color: ${theme.colors.primary.dark1};
        color: ${theme.colors.grayscale.light5};
      }

      .options, .options-highlighted {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    form > span[aria-label="refresh"] {
      position: absolute;
      top: ${theme.gridUnit * 69}px;
      left: ${theme.gridUnit * 42.75}px;
      font-size: ${theme.gridUnit * 4.25}px;
    }
    .table-form {
      margin-bottom: ${theme.gridUnit * 8}px;
    }
    .loading-container {
      position: absolute;
      top: ${theme.gridUnit * 89.75}px;
      left: 0;
      right: 0;
      text-align: center;
      img {
        width: ${theme.gridUnit * 20}px;
        margin-bottom: ${theme.gridUnit * 2.5}px;
      }
      p {
        color: ${theme.colors.grayscale.light1};
      }
    }
`}
`;

function renderSelectRow(select: ReactNode, refreshBtn: ReactNode) {
  return (
    <div className="section">
      <span className="select">{select}</span>
      {/* <span className="refresh">{refreshBtn}</span> */}
    </div>
  );
}

export default function LeftPanel({
  setSource,
  source,
  sourceNames,
}: LeftPanelProps) {

  useEffect(() => {
    const currentUserSelectedSource = getItem(
      LocalStorageKeys.Source,
      null,
    ) as SourceObject;
    if (currentUserSelectedSource) {
      setSource(currentUserSelectedSource);
    }
  }, [setSource]);

  const readOnly = false;
  
  // Static sources no need to refetch
  function renderSourceSelect() {
    const refreshIcon = !readOnly && (
      <RefreshLabel
        onClick={() => {}}
        tooltipContent={t('Force refresh source list')}
      />
    );

    return renderSelectRow(
      <Select
        ariaLabel={t('Select source or type to search sources')}
        // disabled={!source}
        header={<FormLabel>{t('Source')}</FormLabel>}
        labelInValue
        loading={false}
        name="select-source"
        notFoundContent={t('No compatible source found')}
        placeholder={t('Select source or type to search sources')}
        onChange={item => setSource(item as SchemaOption)}
        options={sourceNames?.map((name) => { return { "label": name, "value": name, "title": name } })}
        showSearch
        value={source}
      />,
      refreshIcon,
    );
  }

  console.log(sourceNames?.map((name) => { return { "label": name, "value": name, "title": name } }))

  return (
    <LeftPanelStyle>
      {renderSourceSelect()}
    </LeftPanelStyle>
  );
}
