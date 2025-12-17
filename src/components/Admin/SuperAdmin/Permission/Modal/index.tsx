import { ModalForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useEffect } from "react";
import { callCreatePermission, callUpdatePermission } from "@/config/api";
import { IPermission } from "@/types/backend";
import { ALL_MODULES } from "@/constants/permission";
import { FormattedMessage, useIntl } from "react-intl";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IPermission | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalAdminForPermission = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    const intl = useIntl()

    const [form] = Form.useForm();

    useEffect(() => {
        return () => form.resetFields()
    }, [dataInit]);

    const submitPermission = async (valuesForm: any) => {
        const { name, endpoint, method, module } = valuesForm;

        if (dataInit?.id) {
            const res = await callUpdatePermission(dataInit.id, {
                name,
                endpoint,
                method,
                module
            });

            if (res.data) {
                message.success("Cập nhật permission thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            const res = await callCreatePermission({
                name,
                endpoint,
                method,
                module
            });
            if (res.data) {
                message.success("Thêm mới permission thành công");
                handleReset();
                reloadTable();
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
        setDataInit(null);
        setOpenModal(false);
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?.id ? <FormattedMessage id='admin.admin-permission.table.row.edit.modal.title' /> : <FormattedMessage id='admin.admin-permission.table.row.add.modal.title' />}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? <FormattedMessage id='admin.admin-permission.table.row.edit.modal.submit' /> : <FormattedMessage id='admin.admin-permission.table.row.add.modal.submit' />}</>,
                    cancelText: <FormattedMessage id='admin.admin-permission.table.row.add.modal.cancel' />
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitPermission}
                initialValues={dataInit?.id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label={<FormattedMessage id='admin.admin-permission.table.row.add.modal.name.title' />}
                            name="name"
                            rules={[
                                { required: true, message: <FormattedMessage id='admin.admin-permission.table.row.add.modal.name.required' /> },
                            ]}
                            placeholder={intl.messages['admin.admin-permission.table.row.add.modal.name.placeholder'] as string}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label={<FormattedMessage id='admin.admin-permission.table.row.add.modal.endpoint.title' />}
                            name="endpoint"
                            rules={[
                                { required: true, message: <FormattedMessage id='admin.admin-permission.table.row.add.modal.endpoint.required' /> },
                            ]}
                            placeholder={intl.messages['admin.admin-permission.table.row.add.modal.endpoint.placeholder'] as string}
                        />
                    </Col>

                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSelect
                            name="method"
                            label={<FormattedMessage id='admin.admin-permission.table.row.add.modal.method.title' />}
                            valueEnum={{
                                GET: 'GET',
                                POST: 'POST',
                                PUT: 'PUT',
                                PATCH: 'PATCH',
                                DELETE: 'DELETE',
                            }}
                            placeholder={intl.messages['admin.admin-permission.table.row.add.modal.method.placeholder'] as string}
                            rules={[{ required: true, message: <FormattedMessage id='admin.admin-permission.table.row.add.modal.method.required' /> }]}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSelect
                            name="module"
                            label={<FormattedMessage id='admin.admin-permission.table.row.add.modal.module.title' />}
                            valueEnum={ALL_MODULES}
                            placeholder={intl.messages['admin.admin-permission.table.row.add.modal.module.placeholder'] as string}
                            rules={[{ required: true, message: <FormattedMessage id='admin.admin-permission.table.row.add.modal.module.required' /> }]}
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalAdminForPermission;
