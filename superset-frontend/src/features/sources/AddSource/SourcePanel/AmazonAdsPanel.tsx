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
import { useState } from 'react';
import { t, styled } from '@superset-ui/core';
import { Col, Row } from 'src/components';
import { Form, FormLabel } from 'src/components/Form';
import { Input } from 'src/components/Input';
import { Input as AntdInput, Tooltip } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const StyledDiv = styled.div`
  padding-top: ${({ theme }) => theme.gridUnit * 2}px;
  label {
    color: ${({ theme }) => theme.colors.grayscale.base};
    text-transform: uppercase;
    margin-bottom: ${({ theme }) => theme.gridUnit * 2}px;
  }
`;

const StyledRow = styled(Row)`
  padding-bottom: ${({ theme }) => theme.gridUnit * 2}px;
`;

const StyledInputPassword = styled(AntdInput.Password)`
  margin: ${({ theme }) => `${theme.gridUnit}px 0 ${theme.gridUnit * 2}px`};
`;

/**
 * Props interface for AmazonAdsPanel
 */
export interface IAmazonAdsPanelProps {
  /**
   * Name of the source
   */
  sourceName?: string | null;
  /**
   * Boolean indicating if the component is in a loading state
   */
  loading: boolean;
}

const AmazonAdsPanel = ({ sourceName, loading }: IAmazonAdsPanelProps) => {
  const onChange = () => {};

  return (
    <Form>
      <StyledRow gutter={16}>
        <Col xs={24}>
          <StyledDiv>
            <FormLabel htmlFor="source_name" required>
              {t('Source name')}
            </FormLabel>
            <Input
              name="source_name"
              type="text"
              placeholder={t('e.g. Amamzon Ads')}
              value=""
              onChange={onChange}
              data-test="amazon-ads-panel-source-name-input"
            />
          </StyledDiv>
        </Col>
      </StyledRow>
      <StyledRow gutter={16}>
        <Col xs={24}>
          <StyledDiv>
            <FormLabel htmlFor="client_id" required>
              {t('Client ID')}
            </FormLabel>
            <Input
              name="client_id"
              type="text"
              placeholder={t('e.g. ASD2FRT5GH8BJ')}
              value=""
              onChange={onChange}
              data-test="amazon-ads-panel-client-id-input"
            />
          </StyledDiv>
        </Col>
      </StyledRow>
      <StyledRow gutter={16}>
        <Col xs={24}>
          <StyledDiv>
            <FormLabel htmlFor="client_secret" required>
              {t('Client Secret')}
            </FormLabel>
            <StyledInputPassword
              name="client_secret"
              placeholder={t('e.g. ********')}
              value=""
              onChange={onChange}
              data-test="amazon-ads-panel-client-secret-input"
              iconRender={visible =>
                visible ? (
                  <Tooltip title="Hide secret.">
                    <EyeInvisibleOutlined />
                  </Tooltip>
                ) : (
                  <Tooltip title="Show secret.">
                    <EyeOutlined />
                  </Tooltip>
                )
              }
              role="textbox"
            />
          </StyledDiv>
        </Col>
      </StyledRow>
      <StyledRow gutter={16}>
        <Col xs={24}>
          <StyledDiv>
            <FormLabel htmlFor="refresh_token" required>
              {t('Refresh Token')}
            </FormLabel>
            <StyledInputPassword
              name="refresh_token"
              placeholder={t('e.g. ********')}
              value=""
              onChange={onChange}
              data-test="amazon-ads-panel-refresh-token-input"
              iconRender={visible =>
                visible ? (
                  <Tooltip title="Hide token.">
                    <EyeInvisibleOutlined />
                  </Tooltip>
                ) : (
                  <Tooltip title="Show token.">
                    <EyeOutlined />
                  </Tooltip>
                )
              }
              role="textbox"
            />
          </StyledDiv>
        </Col>
      </StyledRow>
    </Form>
  );
};
export default AmazonAdsPanel;
