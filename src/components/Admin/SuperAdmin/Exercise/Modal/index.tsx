import { ModalForm, ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, ConfigProvider, Form, Row, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from "react";
import { callCreateExercise, callFetchGrade, callFetchSubject, callUpdateExercise } from "@/config/api";
import { IExercise } from "@/types/backend";
import { DebounceSelect } from "../../../../Share/DebounceSelect";
import { HOMEWORK, TEST } from "@/constants/task";
import enUS from 'antd/lib/locale/en_US';
import dayjs from "dayjs";
import { changeDatetimeToPostman } from "@/utils/formatDate";
import { FormattedMessage, useIntl } from "react-intl";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IExercise | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface ISubjectSelect {
    label?: string;
    value?: number;
    key?: number;
}

interface IGradeSelect {
    label?: string;
    value?: number;
    key?: number;
}

const ModalAdminForTask = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    const intl = useIntl()

    const [subject, setSubject] = useState<ISubjectSelect>({
        label: "",
        value: 0,
        key: 0,
    });

    const [grade, setGrade] = useState<IGradeSelect>({
        label: "",
        value: 0,
        key: 0,
    });

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id) {
            if (dataInit.subject) {
                setSubject(
                    {
                        label: dataInit.subject?.name,
                        value: dataInit.subject?.id,
                        key: dataInit.subject?.id,
                    }
                )
            }
            if (dataInit.grade) {
                setGrade(
                    {
                        label: dataInit.grade?.name,
                        value: dataInit.grade?.id,
                        key: dataInit.grade?.id,
                    }
                )
            }
        }

        return () => form.resetFields()
    }, [dataInit]);

    const submitTask = async (valuesForm: any) => {
        const { name, type, timeStart, timeEnd, duration, isRandomQuestion, isRandomAnswer, description } = valuesForm;

        if (dataInit?.id) {
            const res = await callUpdateExercise({
                name,
                type,
                timeStart: changeDatetimeToPostman(timeStart) as any,
                timeEnd: changeDatetimeToPostman(timeEnd) as any,
                duration,
                isRandomQuestion,
                isRandomAnswer,
                description,
                subjectId: subject.value,
                gradeId: grade.value
            }, dataInit.id);

            if (res.data) {
                message.success("Cập nhật task thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            const res = await callCreateExercise({
                name,
                type,
                timeStart: changeDatetimeToPostman(timeStart) as any,
                timeEnd: changeDatetimeToPostman(timeEnd) as any,
                duration,
                isRandomQuestion,
                isRandomAnswer,
                description,
                subjectId: subject.value,
                gradeId: grade.value
            });
            if (res.data) {
                message.success("Thêm mới task thành công");
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

    async function fetchSubjectList(): Promise<ISubjectSelect[]> {
        const res = await callFetchSubject(`page=1&limit=500`);
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

    async function fetchGradeList(): Promise<IGradeSelect[]> {
        const res = await callFetchGrade(`page=1&limit=500`);
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
                title={<>{dataInit?.id ? <FormattedMessage id='admin.admin-exercise.table.row.edit.modal.title' /> : <FormattedMessage id='admin.admin-exercise.table.row.add.modal.title' />}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? <FormattedMessage id='admin.admin-exercise.table.row.edit.modal.submit' /> : <FormattedMessage id='admin.admin-exercise.table.row.add.modal.submit' />}</>,
                    cancelText: <FormattedMessage id='admin.admin-exercise.table.row.add.modal.cancel' />
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitTask}
                initialValues={dataInit?.id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.name.title' />}
                            name="name"
                            rules={[
                                { required: true, message: <FormattedMessage id='admin.admin-exercise.table.row.add.modal.name.required' /> },
                            ]}
                            placeholder={intl.messages['admin.admin-exercise.table.row.add.modal.name.placeholder'] as string}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSelect
                            name="type"
                            label={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.type.title' />}
                            valueEnum={{
                                HOMEWORK: HOMEWORK,
                                TEST: TEST
                            }}
                            placeholder={intl.messages['admin.admin-exercise.table.row.add.modal.type.placeholder'] as string}
                            rules={[{ required: true, message: <FormattedMessage id='admin.admin-exercise.table.row.add.modal.type.required' /> }]}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ConfigProvider locale={enUS}>
                            <ProFormDatePicker
                                label={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.time-start.title' />}
                                name="timeStart"
                                normalize={(value) => value && dayjs(value, 'YYYY/MM/DD HH:mm:ss')}
                                fieldProps={{
                                    format: 'DD/MM/YYYY HH:mm:ss',
                                    showTime: true
                                }}
                                rules={[{ required: true, message: <FormattedMessage id='admin.admin-exercise.table.row.add.modal.time-start.required' /> }]}
                                placeholder={intl.messages['admin.admin-exercise.table.row.add.modal.time-start.placeholder'] as string}
                            />
                        </ConfigProvider>
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ConfigProvider locale={enUS}>
                            <ProFormDatePicker
                                label={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.time-end.title' />}
                                name="timeEnd"
                                normalize={(value) => value && dayjs(value, 'YYYY/MM/DD HH:mm:ss')}
                                fieldProps={{
                                    format: 'DD/MM/YYYY HH:mm:ss',
                                    showTime: true
                                }}
                                // width="auto"
                                rules={[{ required: true, message: <FormattedMessage id='admin.admin-exercise.table.row.add.modal.time-end.required' /> }]}
                                placeholder={intl.messages['admin.admin-exercise.table.row.add.modal.time-end.placeholder'] as string}
                            />
                        </ConfigProvider>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormDigit
                            label={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.duration.title' />}
                            name="duration"
                            rules={[{ required: true, message: <FormattedMessage id='admin.admin-exercise.table.row.add.modal.duration.required' /> }]}
                            placeholder={intl.messages['admin.admin-exercise.table.row.add.modal.duration.placeholder'] as string}
                            fieldProps={{
                                addonAfter: <FormattedMessage id='admin.admin-exercise.table.row.add.modal.duration.sub-title' />,
                                formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                parser: (value) => +(value || '').replace(/\$\s?|(,*)/g, '')
                            }}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormSwitch
                            label={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.random-reserve-question.label' />}
                            name="isRandomQuestion"
                            checkedChildren={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.random-reserve-question.active' />}
                            unCheckedChildren={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.random-reserve-question.unactive' />}
                            initialValue={true}
                            fieldProps={{
                                defaultChecked: true,
                            }}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormSwitch
                            label={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.random-reserve-answer.label' />}
                            name="isRandomAnswer"
                            checkedChildren={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.random-reserve-answer.active' />}
                            unCheckedChildren={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.random-reserve-answer.unactive' />}
                            initialValue={true}
                            fieldProps={{
                                defaultChecked: true,
                            }}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProForm.Item
                            name="subject"
                            label={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.subject.title' />}
                            rules={[{ required: true, message: <FormattedMessage id='admin.admin-exercise.table.row.add.modal.subject.required' /> }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={subject}
                                value={subject}
                                placeholder={intl.messages['admin.admin-exercise.table.row.add.modal.subject.placeholder'] as string}
                                fetchOptions={fetchSubjectList}
                                onChange={(newValue: any) => {
                                    setSubject({
                                        key: newValue?.key,
                                        label: newValue?.label,
                                        value: newValue?.value
                                    });
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProForm.Item
                            name="grade"
                            label={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.grade.title' />}
                            rules={[{ required: true, message: <FormattedMessage id='admin.admin-exercise.table.row.add.modal.grade.required' /> }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={grade}
                                value={grade}
                                placeholder={intl.messages['admin.admin-exercise.table.row.add.modal.grade.placeholder'] as string}
                                fetchOptions={fetchGradeList}
                                onChange={(newValue: any) => {
                                    setGrade({
                                        key: newValue?.key,
                                        label: newValue?.label,
                                        value: newValue?.value
                                    });
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>
                    </Col>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <ProFormTextArea
                            name="description"
                            label={<FormattedMessage id='admin.admin-exercise.table.row.add.modal.description.title' />}
                            placeholder={intl.messages['admin.admin-exercise.table.row.add.modal.description.placeholder'] as string}
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalAdminForTask;
