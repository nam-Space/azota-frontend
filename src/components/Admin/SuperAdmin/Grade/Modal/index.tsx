import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useEffect } from "react";
import { callCreateGrade, callUpdateGrade } from "@/config/api";
import { IGrade } from "@/types/backend";
import { FormattedMessage, useIntl } from "react-intl";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IGrade | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalAdminForGrade = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    const intl = useIntl()
    const [form] = Form.useForm();

    useEffect(() => {
        return () => form.resetFields()
    }, [dataInit]);

    const submitGrade = async (valuesForm: any) => {
        const { name } = valuesForm;

        if (dataInit?.id) {
            const res = await callUpdateGrade({
                name
            }, dataInit.id);

            if (res.data) {
                message.success("Cập nhật grade thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            const res = await callCreateGrade(name);
            if (res.data) {
                message.success("Thêm mới grade thành công");
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
                title={<>{dataInit?.id ? <FormattedMessage id='admin.admin-grade.table.row.edit.modal.title' /> : <FormattedMessage id='admin.admin-grade.table.row.add.modal.title' />}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? <FormattedMessage id='admin.admin-grade.table.row.edit.modal.submit' /> : <FormattedMessage id='admin.admin-grade.table.row.add.modal.submit' />}</>,
                    cancelText: <FormattedMessage id='admin.admin-grade.table.row.add.modal.cancel' />
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitGrade}
                initialValues={dataInit?.id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <ProFormText
                            label={<FormattedMessage id='admin.admin-grade.table.row.add.modal.name.title' />}
                            name="name"
                            rules={[
                                { required: true, message: <FormattedMessage id='admin.admin-grade.table.row.add.modal.name.required' /> },
                            ]}
                            placeholder={intl.messages['admin.admin-grade.table.row.add.modal.name.placeholder'] as string}
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalAdminForGrade;
