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

export enum SourceActionType {
  SelectSource,
  ChangeSource,
}

export interface SourceObject {
  description?: string | null;
  name?: string;
  key?: string;
}

export interface SourceReducerPayloadType {
  name: string;
  description?: string | null;
}

export type Schema = {
  schema?: string | null | undefined;
};

export type SourceReducerActionType =
  | {
      type: SourceActionType.SelectSource;
      payload: Partial<SourceObject>;
    }
  | {
      type: SourceActionType.SelectSource | SourceActionType.ChangeSource;
      payload: SourceReducerPayloadType;
    };

export type InputType = {
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type ShopifySourceObject = {
  source_name?: string;
  shopify_store?: string;
  api_password?: string;
};

export type AmazonSellerPartnerInputObject = {
  source_name?: string;
  lwa_client_id?: string;
  lwa_client_secret?: string;
  refresh_token?: string;
};
