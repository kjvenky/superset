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
import { useState, useEffect, useCallback, useMemo } from 'react';
// import { SupersetClient, logging, t } from '@superset-ui/core';
// import rison from 'rison';
// import { addDangerToast } from 'src/components/MessageToasts/actions';
// import { DatasetObject } from 'src/features/datasets/AddDataset/types';
// import { DatabaseObject } from 'src/components/DatabaseSelector';

/**
 * Retrieves all pages of dataset results
 */
const useSourcesList = () => {

  const sources = [{
    name: "Shopify"
  }, 
  {
    name: "Amazon Seller Partner"
  },
  {
    name: "Flipkart"
  }]

  const sourceNames = useMemo(
    () => sources?.map(source => source.name),
    [sources],
  );
  return { sources, sourceNames };
};

export default useSourcesList;
