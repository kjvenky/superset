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
import { Col, Row, Select } from 'src/components';
import { Form, FormLabel } from 'src/components/Form';
import { Input } from 'src/components/Input';
import { Input as AntdInput, Tooltip } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { InputType, AmazonSellerPartnerInputObject } from '../types';

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

type AwsSelectOptions = {
  label: string;
  value: string;
  key?: string;
};

const AWS_ENV_OPTIONS: AwsSelectOptions[] = [
  { label: 'PRODUCTION', value: 'Production' },
  { label: 'SANDBOX', value: 'Sandbox' },
];

const AWS_REGION_OPTIONS: AwsSelectOptions[] = [
  { label: 'AE', value: 'AE' },
  { label: 'AU', value: 'AU' },
  { label: 'BE', value: 'BE' },
  { label: 'BR', value: 'BR' },
  { label: 'CA', value: 'CA' },
  { label: 'DE', value: 'DE' },
  { label: 'EG', value: 'EG' },
  { label: 'ES', value: 'ES' },
  { label: 'FR', value: 'FR' },
  { label: 'GB', value: 'GB' },
  { label: 'IN', value: 'IN' },
  { label: 'IT', value: 'IT' },
  { label: 'JP', value: 'JP' },
  { label: 'MX', value: 'MX' },
  { label: 'NL', value: 'NL' },
  { label: 'PL', value: 'PL' },
  { label: 'SA', value: 'SA' },
  { label: 'SE', value: 'SE' },
  { label: 'SG', value: 'SG' },
  { label: 'TR', value: 'TR' },
  { label: 'UK', value: 'UK' },
  { label: 'US', value: 'US' },
];

const AWS_SELLER_PARTNER_ACCOUNT_TYPE_OPTIONS: AwsSelectOptions[] = [
  { label: 'Seller', value: 'Seller' },
  { label: 'Vendor', value: 'Vendor' },
];

const AmazonSellerPartnerPanel = ({
  sourceName,
  loading,
}: IAmazonAdsPanelProps) => {
  const [inputData, setInputData] = useState<AmazonSellerPartnerInputObject>({
    source_name: sourceName || 'Amazon Seller Partner',
    lwa_client_id: '',
    lwa_client_secret: '',
    refresh_token: '',
  });
  const [awsEnv, setAwsEnv] = useState<string>();
  const [awsRegion, setAwsRegion] = useState<string>();
  const [awsAccountType, setAwsAccountType] = useState<string>();

  const onInputChange: InputType['onChange'] = ({ target }) => {
    setInputData({
      ...inputData,
      [target.name]: target.value,
    });
  };

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
              placeholder={t('e.g. Amamzon Seller Partner')}
              value={inputData.source_name}
              onChange={onInputChange}
              data-test="amazon-seller-partner-panel-source-name-input"
            />
          </StyledDiv>
        </Col>
      </StyledRow>
      <StyledRow gutter={16}>
        <Col xs={24}>
          <StyledDiv>
            <Select
              ariaLabel={t(
                'Select AWS Environment or type to search AWS Environments',
              )}
              header={
                <FormLabel htmlFor="select_aws_environment" required>
                  {t('AWS Environment')}
                </FormLabel>
              }
              labelInValue
              loading={false}
              name="select-aws-environment"
              notFoundContent={t('No compatible AWS Environment found')}
              placeholder={t(
                'Select AWS Environment or type to search AWS Environments',
              )}
              onChange={(item: AwsSelectOptions) => setAwsEnv(item.label)}
              options={AWS_ENV_OPTIONS}
              showSearch
              // value={awsEnv}
            />
          </StyledDiv>
        </Col>
      </StyledRow>
      <StyledRow gutter={16}>
        <Col xs={24}>
          <StyledDiv>
            <Select
              ariaLabel={t('Select AWS Region or type to search AWS Regions')}
              header={
                <FormLabel htmlFor="select_aws_region" required>
                  {t('AWS Region')}
                </FormLabel>
              }
              labelInValue
              loading={false}
              name="select-aws-region"
              notFoundContent={t('No compatible AWS Region found')}
              placeholder={t('Select AWS Region or type to search AWS Regions')}
              onChange={(item: AwsSelectOptions) => setAwsRegion(item.label)}
              options={AWS_REGION_OPTIONS}
              showSearch
              // value={awsRegion}
            />
          </StyledDiv>
        </Col>
      </StyledRow>
      <StyledRow gutter={16}>
        <Col xs={24}>
          <StyledDiv>
            <Select
              ariaLabel={t(
                'Select AWS Seller Partner Account Type or type to search AWS Seller Partner Account Type',
              )}
              header={
                <FormLabel
                  htmlFor="select_aws_seller_partner_account_type"
                  required
                >
                  {t('AWS Partner Account Type')}
                </FormLabel>
              }
              labelInValue
              loading={false}
              name="select-aws-seller-partner-account-type"
              notFoundContent={t(
                'No compatible AWS Seller Partner Account Type found',
              )}
              placeholder={t(
                'Select AWS Seller Partner Account Type or type to search AWS Seller Partner Account Type',
              )}
              onChange={(item: AwsSelectOptions) =>
                setAwsAccountType(item.label)
              }
              options={AWS_SELLER_PARTNER_ACCOUNT_TYPE_OPTIONS}
              showSearch
              // value={awsAccountType}
            />
          </StyledDiv>
        </Col>
      </StyledRow>
      <StyledRow gutter={16}>
        <Col xs={24}>
          <StyledDiv>
            <FormLabel htmlFor="lwa_client_id" required>
              {t('LWA Client Id')}
            </FormLabel>
            <StyledInputPassword
              name="lwa_client_id"
              placeholder={t('e.g. *******************')}
              value={inputData.lwa_client_id}
              onChange={onInputChange}
              data-test="amazon-seller-partner-panel-lwa-client-id-input"
              iconRender={visible =>
                visible ? (
                  <Tooltip title="Hide id.">
                    <EyeInvisibleOutlined />
                  </Tooltip>
                ) : (
                  <Tooltip title="Show id.">
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
            <FormLabel htmlFor="lwa_client_secret" required>
              {t('LWA Client Secret')}
            </FormLabel>
            <StyledInputPassword
              name="lwa_client_secret"
              placeholder={t('e.g. *******************')}
              value={inputData.lwa_client_secret}
              onChange={onInputChange}
              data-test="amazon-seller-partner-panel-lwa-client-secret-input"
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
              placeholder={t('e.g. *******************')}
              value={inputData.refresh_token}
              onChange={onInputChange}
              data-test="amazon-seller-partner-panel-refresh-token-input"
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
export default AmazonSellerPartnerPanel;
