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
 * Props interface for ShopifyPanel
 */
export interface IShopifyPanelProps {
  /**
   * Name of the source
   */
  sourceName?: string | null;
  /**
   * Boolean indicating if the component is in a loading state
   */
  loading: boolean;
}

const ShopifyPanel = ({ sourceName, loading }: IShopifyPanelProps) => {
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
              placeholder={t('e.g. Shopify')}
              value=""
              onChange={onChange}
              data-test="source-panel-source-name-input"
            />
          </StyledDiv>
        </Col>
      </StyledRow>
      <StyledRow gutter={16}>
        <Col xs={24}>
          <StyledDiv>
            <FormLabel htmlFor="shopify_store" required>
              {t('Shopify Store')}
            </FormLabel>
            <Input
              name="shopify_store"
              type="text"
              placeholder={t('e.g. Analytics')}
              value=""
              onChange={onChange}
              data-test="source-panel-shopify-store-input"
            />
          </StyledDiv>
        </Col>
      </StyledRow>
      <StyledRow gutter={16}>
        <Col xs={24}>
          <StyledDiv>
            <FormLabel htmlFor="api_password" required>
              {t('API Password')}
            </FormLabel>
            <StyledInputPassword
              name="api_password"
              placeholder={t('e.g. ********')}
              value=""
              onChange={onChange}
              data-test="source-panel-api-password-input"
              iconRender={visible =>
                visible ? (
                  <Tooltip title="Hide password.">
                    <EyeInvisibleOutlined />
                  </Tooltip>
                ) : (
                  <Tooltip title="Show password.">
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
export default ShopifyPanel;
