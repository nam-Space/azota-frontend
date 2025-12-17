import { callUpdateUserPassword } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import { Col, ConfigProvider, Form, Row, message, notification } from 'antd';
import React, { useEffect } from 'react'
import enUS from 'antd/lib/locale/en_US';
import styles from './change-password.module.scss'
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { CheckSquareOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';

const ChangePassword = () => {
    const intl = useIntl()

    const dataInit = useAppSelector(state => state.account.user);
    const [form] = Form.useForm();


    useEffect(() => {
        return () => form.resetFields()
    }, [dataInit]);

    const submitUser = async (valuesForm: any) => {
        const { password, new_password, renew_password } = valuesForm;
        if (dataInit?.id) {
            const res = await callUpdateUserPassword(+dataInit.id, {
                password,
                new_password,
                renew_password
            });
            if (res.data) {
                message.success("Cập nhật mật khẩu thành công");
                handleReset();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
    }

    return (
        <div className={styles['wrapper']}>
            <ConfigProvider locale={enUS}>
                <ProForm
                    form={form}
                    onFinish={submitUser}
                    submitter={
                        {
                            searchConfig: {
                                resetText: <span><FormattedMessage id="profile-changePassword.right-container.cancel" /></span>,
                                submitText: <span><FormattedMessage id="profile-changePassword.right-container.submit" /></span>
                            },
                            onReset: () => handleReset(),
                            submitButtonProps: {
                                icon: <CheckSquareOutlined />
                            },
                        }
                    }
                >
                    <Row gutter={16}>
                        <Col lg={24} md={24} sm={24} xs={24}>
                            <ProFormText.Password
                                label={<FormattedMessage id="profile-changePassword.right-container.password.label" />}
                                name="password"
                                rules={[{ required: true, message: <FormattedMessage id="profile-changePassword.right-container.password.required" /> }]}
                                placeholder={intl.messages['profile-changePassword.right-container.password.placeholder'] as string}
                            />
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText.Password
                                label={<FormattedMessage id="profile-changePassword.right-container.new-password.label" />}
                                name="new_password"
                                rules={[{ required: true, message: <FormattedMessage id="profile-changePassword.right-container.new-password.required" /> }]}
                                placeholder={intl.messages['profile-changePassword.right-container.new-password.placeholder'] as string}
                            />
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText.Password
                                label={<FormattedMessage id="profile-changePassword.right-container.renew-password.label" />}
                                name="renew_password"
                                rules={[{ required: true, message: <FormattedMessage id="profile-changePassword.right-container.renew-password.required" /> }]}
                                placeholder={intl.messages['profile-changePassword.right-container.renew-password.placeholder'] as string}
                            />
                        </Col>
                    </Row>
                </ProForm>
            </ConfigProvider>
        </div>
    )
}

export default ChangePassword