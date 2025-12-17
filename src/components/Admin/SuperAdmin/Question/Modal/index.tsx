import { ModalForm, ProForm, ProFormText, } from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from "react";
import { callCreateQuestion, callFetchExercise, callUpdateQuestion } from "@/config/api";
import { IQuestion } from "@/types/backend";
import { DebounceSelect } from "../../../../Share/DebounceSelect";
import dynamic from "next/dynamic";
import { FormattedMessage, useIntl } from "react-intl";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IQuestion | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface IExerciseSelect {
    label?: string;
    value?: number;
    key?: number;
}

const ModalAdminForQuestion = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    const intl = useIntl()

    const [name, setName] = useState('')

    const [exercise, setExercise] = useState<IExerciseSelect>({
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
            if (dataInit.exercise) {
                setExercise(
                    {
                        label: dataInit.exercise?.name,
                        value: dataInit.exercise?.id,
                        key: dataInit.exercise?.id,
                    }
                )
            }
        }

        return () => form.resetFields()
    }, [dataInit]);

    const submitQuestion = async (valuesForm: any) => {
        if (dataInit?.id) {
            const res = await callUpdateQuestion({
                name,
                exerciseId: exercise.value
            }, dataInit.id);

            if (res.data) {
                message.success("Cập nhật question thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            const res = await callCreateQuestion({
                name,
                exerciseId: exercise.value
            });
            if (res.data) {
                message.success("Thêm mới question thành công");
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

    async function fetchExerciseList(): Promise<IExerciseSelect[]> {
        const res = await callFetchExercise(`page=1&limit=500`);
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
                title={<>{dataInit?.id ? <FormattedMessage id='admin.admin-question.table.row.edit.modal.title' /> : <FormattedMessage id='admin.admin-question.table.row.add.modal.title' />}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? <FormattedMessage id='admin.admin-question.table.row.edit.modal.submit' /> : <FormattedMessage id='admin.admin-question.table.row.add.modal.submit' />}</>,
                    cancelText: <FormattedMessage id='admin.admin-question.table.row.add.modal.cancel' />
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitQuestion}
                initialValues={dataInit?.id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <label htmlFor="">
                            <span style={{ color: 'red' }}>*</span>{" "}
                            <FormattedMessage id='admin.admin-question.table.row.add.modal.name.title' />
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
                            name="exercise"
                            label={<FormattedMessage id='admin.admin-question.table.row.add.modal.exercise.title' />}
                            rules={[{ required: true, message: <FormattedMessage id='admin.admin-question.table.row.add.modal.exercise.required' /> }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={exercise}
                                value={exercise}
                                placeholder={intl.messages['admin.admin-question.table.row.add.modal.exercise.placeholder'] as string}
                                fetchOptions={fetchExerciseList}
                                onChange={(newValue: any) => {
                                    setExercise({
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

export default ModalAdminForQuestion;
