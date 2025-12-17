import { ModalForm, ProCard, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from "react";
import { callCreateRole, callFetchPermission, callInsertAndDeleteRolePermission, callUpdateRole } from "@/config/api";
import { IPermission, IRole } from "@/types/backend";
import _ from "lodash";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchRolePermission } from "@/redux/slice/rolePermission";
import ModuleApi from "./ModuleApi";
import { FormattedMessage, useIntl } from "react-intl";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IRole | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalAdminForRole = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    const intl = useIntl()

    const permissions = useAppSelector(state => state.permission.result)

    const [form] = Form.useForm();

    const [listPermissions, setListPermissions] = useState<{
        module: string;
        permissions: IPermission[]
    }[] | null>(null);

    const groupByPermission = (data: any) => {
        return _(data)
            .groupBy(x => x.module)
            .map((value, key) => {
                return { module: key, permissions: value as IPermission[] };
            })
            .value();
    }

    const groupByPermissionUser = (data: any) => {
        return _(data)
            .groupBy(x => x.permission.module)
            .map((value, key) => {
                return { module: key, permissions: value.map(x => x.permission) as IPermission[] };
            })
            .value();
    }

    useEffect(() => {
        const getPermissionData = async () => {
            const res = await callFetchPermission(`page=1&limit=500`);
            if (res.data) {
                setListPermissions(groupByPermission(res.data.result))
            }
        }
        getPermissionData();

        return () => form.resetFields()
    }, []);

    useEffect(() => {
        if (listPermissions?.length && dataInit?.id) {
            form.setFieldsValue({
                name: dataInit.name,
            })
            const userPermissions = groupByPermissionUser(dataInit.rolePermissions);

            listPermissions.forEach(x => {
                let allCheck = true;
                x.permissions?.forEach(y => {
                    const temp = userPermissions.find(z => {
                        return z.module === x.module
                    });

                    if (temp) {
                        const isExist = temp.permissions.find(k => {
                            return k.id === y.id
                        });
                        if (isExist) {
                            form.setFieldValue(["permissions", y.id + ''], true);
                        } else allCheck = false;
                    } else {
                        allCheck = false;
                    }
                })
                form.setFieldValue(["permissions", x.module], allCheck)
            })
        }

    }, [listPermissions, dataInit])

    const submitRole = async (valuesForm: any) => {
        const { name, permissions } = valuesForm;

        const checkedPermissions = [];

        if (permissions) {
            for (const key in permissions) {
                if (+key && permissions[key]) {
                    checkedPermissions.push(+key)
                }
            }
        }



        if (dataInit?.id) {
            const res = await callUpdateRole(dataInit.id, {
                name
            })

            if (!res.data) {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }

            const resRolePermissions = await callInsertAndDeleteRolePermission(dataInit.id, checkedPermissions)

            if (!resRolePermissions.data) {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }

            message.success("Cập nhật role thành công");
            handleReset();
            reloadTable();
        } else {
            const res = await callCreateRole({
                name
            });

            if (!res.data) {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }

            const resRolePermissions = await callInsertAndDeleteRolePermission(res.data?.id as number, checkedPermissions)

            if (!resRolePermissions.data) {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }

            message.success("Thêm mới role thành công");
            handleReset();
            reloadTable();
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
                title={<>{dataInit?.id ? <FormattedMessage id='admin.admin-role.table.row.edit.modal.title' /> : <FormattedMessage id='admin.admin-role.table.row.add.modal.title' />}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? <FormattedMessage id='admin.admin-role.table.row.edit.modal.submit' /> : <FormattedMessage id='admin.admin-role.table.row.add.modal.submit' />}</>,
                    cancelText: <FormattedMessage id='admin.admin-role.table.row.add.modal.cancel' />
                }}
                scrollToFirstError={true}
                preserve={true}
                form={form}
                onFinish={submitRole}
            // initialValues={dataInit?.id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <ProFormText
                            label={<FormattedMessage id='admin.admin-role.table.row.add.modal.name.title' />}
                            name="name"
                            rules={[
                                { required: true, message: <FormattedMessage id='admin.admin-role.table.row.add.modal.name.required' /> },
                            ]}
                            placeholder={intl.messages['admin.admin-role.table.row.add.modal.name.placeholder'] as string}
                        />
                    </Col>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <ProCard
                            title={<FormattedMessage id='admin.admin-role.table.row.add.modal.permission.title' />}
                            subTitle={<FormattedMessage id='admin.admin-role.table.row.add.modal.permission.sub-title' />}
                            headStyle={{ color: '#d81921' }}
                            style={{ marginBottom: 20 }}
                            headerBordered
                            size="small"
                            bordered
                        >
                            <ModuleApi
                                form={form}
                                listPermissions={listPermissions}
                            />

                        </ProCard>

                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalAdminForRole;
