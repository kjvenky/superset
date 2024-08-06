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
import { useReducer, Reducer, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSourcesList from 'src/features/sources/hooks/useSourcesList';
import Header from 'src/features/sources/AddSource/Header';
import EditPage from 'src/features/sources/AddSource/EditDataset';
import DatasetPanel from 'src/features/sources/AddSource/DatasetPanel';
import LeftPanel from 'src/features/sources/AddSource/LeftPanel';
import Footer from 'src/features/sources/AddSource/Footer';
import {
  DatasetActionType,
  DatasetObject,
  DSReducerActionType,
  SourceActionType,
  SourceObject,
} from 'src/features/sources/AddSource/types';
import DatasetLayout from 'src/features/datasets/DatasetLayout';

export function sourceReducer(
  state: SourceObject | null,
  action: SourceActionType,
): Partial<SourceObject> | null {
  const trimmedState = {
    ...(state || {}),
  };

  switch (action.type) {
    case SourceActionType.SelectSource:
      return {
        ...trimmedState,
        ...action.payload,
        name: null,
      };
    default:
      return null;
  }
}

const prevUrl =
  '/tablemodelview/list/?pageIndex=0&sortColumn=changed_on_delta_humanized&sortOrder=desc';

export default function AddSource() {
  const [source, setSource] = useReducer<
    Reducer<Partial<SourceObject> | null, SourceActionType>
  >(sourceReducer, null);
  const [hasColumns, setHasColumns] = useState(false);
  const [editPageIsVisible, setEditPageIsVisible] = useState(false);

  const { sources, sourceNames } = useSourcesList();

  const { sourceId: id } = useParams<{ sourceId: string }>();
  useEffect(() => {
    if (!Number.isNaN(parseInt(id, 10))) {
      setEditPageIsVisible(true);
    }
  }, [id]);

  const HeaderComponent = () => (
    <Header setSource={setSource} title={source?.name} />
  );

  const LeftPanelComponent = () => (
    <LeftPanel
      setSource={setSource}
      source={source}
      sourceNames={sourceNames}
    />
  );

  const EditSourceComponent = () => <EditPage id={id} />;

  const SourcePanelComponent = () => (
    <DatasetPanel
      name={source?.name}
      setHasColumns={setHasColumns}
      sources={sources}
    />
  );

  const FooterComponent = () => (
    <Footer
      url={prevUrl}
      sourceObject={source}
      hasColumns={hasColumns}
      sources={sourceNames}
    />
  );

  return (
    <DatasetLayout
      header={HeaderComponent()}
      leftPanel={editPageIsVisible ? null : LeftPanelComponent()}
      datasetPanel={
        editPageIsVisible ? EditSourceComponent() : SourcePanelComponent()
      }
      footer={FooterComponent()}
    />
  );
}
