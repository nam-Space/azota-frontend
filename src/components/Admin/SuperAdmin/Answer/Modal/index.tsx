import { ModalForm, ProForm } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from "react";
import { callCreateAnswer, callFetchQuestion, callUpdateAnswer } from "@/config/api";
import { IAnswer } from "@/types/backend";
import { DebounceSelect } from "../../../../Share/DebounceSelect";
import dynamic from "next/dynamic";
import { FormattedMessage, useIntl } from "react-intl";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IAnswer | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface IQuestionSelect {
    label?: string;
    value?: number;
    key?: number;
}

const ModalAdminForAnswer = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    const intl = useIntl()

    const [name, setName] = useState('')

    const [question, setQuestion] = useState<IQuestionSelect>({
        label: "",
        value: 0,
        key: 0,
    });


    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id) {
            if (dataInit.name) {
                setName(dataInit.name)
            }
            if (dataInit.question) {
                setQuestion(
                    {
                        label: dataInit.question?.name,
                        value: dataInit.question?.id,
                        key: dataInit.question?.id,
                    }
                )
            }
        }

        return () => form.resetFields()
    }, [dataInit]);

    const submitAnswer = async (valuesForm: any) => {
        if (dataInit?.id) {
            const res = await callUpdateAnswer({
                name,
                questionId: question.value
            }, dataInit.id);

            if (res.data) {
                message.success("Cập nhật answer thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            const res = await callCreateAnswer({
                name,
                questionId: question.value
            });
            if (res.data) {
                message.success("Thêm mới answer thành công");
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

    async function fetchQuestionList(): Promise<IQuestionSelect[]> {
        const res = await callFetchQuestion(`page=1&limit=500`);
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
                title={<>{dataInit?.id ? <FormattedMessage id='admin.admin-answer.table.row.edit.modal.title' /> : <FormattedMessage id='admin.admin-answer.table.row.add.modal.title' />}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? <FormattedMessage id='admin.admin-answer.table.row.edit.modal.submit' /> : <FormattedMessage id='admin.admin-answer.table.row.add.modal.submit' />}</>,
                    cancelText: <FormattedMessage id='admin.admin-answer.table.row.add.modal.cancel' />
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitAnswer}
                initialValues={dataInit?.id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <label htmlFor="">
                            <span style={{ color: 'red' }}>*</span>{" "}
                            <FormattedMessage id='admin.admin-answer.table.row.add.modal.name.title' />
                        </label>
                        <ReactQuill
                            style={{ marginTop: 10 }}
                            theme="snow"
                            value={name}
                            onChange={setName}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="question"
                            label={<FormattedMessage id='admin.admin-answer.table.row.add.modal.question.title' />}
                            rules={[{ required: true, message: <FormattedMessage id='admin.admin-answer.table.row.add.modal.question.required' /> }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={question}
                                value={question}
                                placeholder={intl.messages['admin.admin-answer.table.row.add.modal.question.placeholder'] as string}
                                fetchOptions={fetchQuestionList}
                                onChange={(newValue: any) => {
                                    setQuestion({
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

export default ModalAdminForAnswer;
