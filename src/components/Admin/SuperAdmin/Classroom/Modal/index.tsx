import { ModalForm, ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from "react";
import { callCreateClassroom, callFetchGroup, callFetchSchoolYear, callUpdateClassroom } from "@/config/api";
import { IClassroom, IGroup } from "@/types/backend";
import { DebounceSelect } from "../../../../Share/DebounceSelect";
import { FormattedMessage, useIntl } from "react-intl";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IClassroom | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface IGroupSelect {
    label?: string;
    value?: number;
    key?: number;
}

interface ISchoolYearSelect {
    label?: string;
    value?: number;
    key?: number;
}

const ModalAdminForClassroom = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    const intl = useIntl()

    const [group, setGroup] = useState<IGroupSelect>({
        label: "",
        value: 0,
        key: 0,
    });

    const [schoolYear, setSchoolYear] = useState<ISchoolYearSelect>({
        label: "",
        value: 0,
        key: 0,
    });

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id) {
            if (dataInit.group) {
                setGroup(
                    {
                        label: dataInit.group?.name,
                        value: dataInit.group?.id,
                        key: dataInit.group?.id,
                    }
                )
            }
            if (dataInit.schoolYear) {
                setSchoolYear(
                    {
                        label: dataInit.schoolYear?.name,
                        value: dataInit.schoolYear?.id,
                        key: dataInit.schoolYear?.id,
                    }
                )
            }
        }

        return () => form.resetFields()
    }, [dataInit]);

    const submitClassroom = async (valuesForm: any) => {
        const { name } = valuesForm;

        if (dataInit?.id) {
            const res = await callUpdateClassroom({
                name,
                groupId: group.value,
                schoolYearId: schoolYear.value
            }, dataInit.id);

            if (res.data) {
                message.success("Cập nhật classroom thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            const res = await callCreateClassroom({
                name,
                groupId: group.value,
                schoolYearId: schoolYear.value
            });
            if (res.data) {
                message.success("Thêm mới classroom thành công");
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

    async function fetchGroupList(): Promise<IGroupSelect[]> {
        const res = await callFetchGroup(`page=1&limit=500`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name,
                    value: item.id
                }
            })
            return temp;
        } else return [];
    }

    async function fetchSchoolYearList(): Promise<ISchoolYearSelect[]> {
        const res = await callFetchSchoolYear(`page=1&limit=500`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name,
                    value: item.id
                }
            })
            return temp;
        } else return [];
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?.id ? <FormattedMessage id='admin.admin-classroom.table.row.edit.modal.title' /> : <FormattedMessage id='admin.admin-classroom.table.row.add.modal.title' />}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? <FormattedMessage id='admin.admin-classroom.table.row.edit.modal.submit' /> : <FormattedMessage id='admin.admin-classroom.table.row.add.modal.submit' />}</>,
                    cancelText: <FormattedMessage id='admin.admin-classroom.table.row.add.modal.cancel' />
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitClassroom}
                initialValues={dataInit?.id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <ProFormText
                            label={<FormattedMessage id='admin.admin-classroom.table.row.add.modal.name.title' />}
                            name="name"
                            rules={[
                                { required: true, message: <FormattedMessage id='admin.admin-classroom.table.row.add.modal.name.required' /> },
                            ]}
                            placeholder={intl.messages['admin.admin-classroom.table.row.add.modal.name.placeholder'] as string}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="group"
                            label={<FormattedMessage id='admin.admin-classroom.table.row.add.modal.group.title' />}
                            rules={[{ required: true, message: <FormattedMessage id='admin.admin-classroom.table.row.add.modal.group.required' /> }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={group}
                                value={group}
                                placeholder={intl.messages['admin.admin-classroom.table.row.add.modal.group.placeholder'] as string}
                                fetchOptions={fetchGroupList}
                                onChange={(newValue: any) => {
                                    setGroup({
                                        key: newValue?.key,
                                        label: newValue?.label,
                                        value: newValue?.value
                                    });
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="schoolYear"
                            label={<FormattedMessage id='admin.admin-classroom.table.row.add.modal.school-year.title' />}
                            rules={[{ required: true, message: <FormattedMessage id='admin.admin-classroom.table.row.add.modal.school-year.required' /> }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={schoolYear}
                                value={schoolYear}
                                placeholder={intl.messages['admin.admin-classroom.table.row.add.modal.school-year.placeholder'] as string}
                                fetchOptions={fetchSchoolYearList}
                                onChange={(newValue: any) => {
                                    setSchoolYear({
                                        key: newValue?.key,
                                        label: newValue?.label,
                                        value: newValue?.value
                                    });
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalAdminForClassroom;
