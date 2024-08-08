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

import { t, styled } from '@superset-ui/core';
import { EmptyStateBig } from 'src/components/EmptyState';

const StyledContainer = styled.div`
  padding: ${({ theme }) => theme.gridUnit * 8}px
    ${({ theme }) => theme.gridUnit * 6}px;

  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const StyledEmptyStateBig = styled(EmptyStateBig)`
  max-width: 50%;

  p {
    width: ${({ theme }) => theme.gridUnit * 115}px;
  }
`;

export const SELECT_MESSAGE = t(
  'Select a data source in the left panel and fill in the required fields.',
);

const renderEmptyDescription = () => <>{SELECT_MESSAGE}</>;

export const SELECT_SOURCE_TITLE = t('Select data source');

export const PlaceHolder = () => {
  const currentImage: string | undefined = 'no-columns.svg';

  return (
    <StyledContainer>
      <StyledEmptyStateBig
        image={currentImage}
        title={SELECT_SOURCE_TITLE}
        description={renderEmptyDescription()}
      />
    </StyledContainer>
  );
};

export default PlaceHolder;
