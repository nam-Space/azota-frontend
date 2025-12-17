import React, { useEffect, useState } from 'react'
import styles from './setting.module.scss'
import { Col, ConfigProvider, Divider, Form, Row, message, notification } from 'antd'
import { ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { CheckSquareOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import enUS from 'antd/lib/locale/en_US';
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchGrade } from '@/redux/slice/gradeSlide'
import { fetchSubject } from '@/redux/slice/subjectSlide'
import { callFetchExerciseById, callUpdateExercise } from '@/config/api'
import { useRouter } from 'next/router'
import { TEST } from '@/constants/task'
import { IExercise } from '@/types/backend'
import { changeDatetimeToPostman } from '@/utils/formatDate'
import { FormattedMessage, useIntl } from 'react-intl'


const SettingTestUpdate = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const intl = useIntl()
    const [form] = Form.useForm()

    const theme = useAppSelector(state => state.theme.name)
    const grades = useAppSelector(state => state.grade.result)
    const subjects = useAppSelector(state => state.subject.result)
    const [test, setTest] = useState<IExercise>({
        id: 0,
        name: "",
        type: "",
        description: "",
        timeStart: new Date(),
        timeEnd: new Date(),
        duration: 0,
        isRandomQuestion: true,
        isRandomAnswer: true,
        gradeId: 0,
        subjectId: 0,
        classroomExercises: [],

        createdBy: 0,
        updatedBy: 0,
        deletedBy: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
    })

    useEffect(() => {
        if (router.query.testId) {
            dispatch(fetchGrade({ query: 'page=1&limit=500' }))
            dispatch(fetchSubject({ query: 'page=1&limit=500' }))

            const testId = router.query.testId
            const handleGetTest = async () => {
                const res = await callFetchExerciseById(+testId)
                if (res.data) {
                    setTest(res.data)
                }
            }

            handleGetTest()
        }

    }, [router])

    useEffect(() => {
        form.setFieldsValue({
            ...test,
        })
    }, [JSON.stringify(test)])

    const onFinish = async (values: any) => {
        const {
            name,
            timeStart,
            timeEnd,
            duration,
            isRandomQuestion,
            isRandomAnswer,
            gradeId,
            subjectId,
            description
        } = values

        const res = await callUpdateExercise({
            name,
            type: TEST,
            timeStart: changeDatetimeToPostman(timeStart),
            timeEnd: changeDatetimeToPostman(timeEnd),
            duration,
            isRandomQuestion,
            isRandomAnswer,
            gradeId,
            subjectId,
            description
        }, +(router.query.testId as string))

        if (res.data) {
            message.success("Cập nhật đề thi thành công");
        }
        else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: res.message
            })
        }
    }

    return (
        <div className={styles['setting-container']}>
            <h2 className={styles['heading-title']}><FormattedMessage id='testDetail-setting.title' /></h2>
            <ProForm
                form={form}
                onFinish={onFinish}
                style={{ padding: 20, borderTop: '1px solid #d9d9d9' }}
                submitter={
                    {
                        searchConfig: {
                            resetText: <span><FormattedMessage id='testDetail-setting.cancel' /></span>,
                            submitText: <span><FormattedMessage id='testDetail-setting.submit' /></span>
                        },
                        render: (_: any, dom: any) => <div style={{ display: 'flex', gap: 10 }}>{dom}</div>,
                        submitButtonProps: {
                            icon: <CheckSquareOutlined />,
                            style: {
                                background: theme
                            }
                        },
                    }
                }
            >
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <ProFormText
                            label={<FormattedMessage id='testDetail-setting.name.label' />}
                            name="name"
                            rules={[
                                { required: true, message: <FormattedMessage id='testDetail-setting.name.required' /> },
                            ]}
                            placeholder={intl.messages['testDetail-setting.name.placeholder'] as string}
                        />
                    </Col>
                </Row>
                <Row gutter={[20, 20]}>
                    <Col span={4}>
                        <ConfigProvider locale={enUS}>
                            <ProFormDatePicker
                                label={<FormattedMessage id='testDetail-setting.time-start.label' />}
                                name="timeStart"
                                normalize={(value) => value && dayjs(value, 'YYYY/MM/DD HH:mm:ss')}
                                fieldProps={{
                                    format: 'DD/MM/YYYY HH:mm:ss',
                                    showTime: true
                                }}
                                rules={[{ required: true, message: <FormattedMessage id='testDetail-setting.time-start.required' /> }]}
                                placeholder={intl.messages['testDetail-setting.time-start.placeholder'] as string}
                            />
                            {/* <DatePicker onChange={handleChangeDatePicker} /> */}
                        </ConfigProvider>
                    </Col>
                    <Col span={4}>
                        <ConfigProvider locale={enUS}>
                            <ProFormDatePicker

                                label={<FormattedMessage id='testDetail-setting.time-end.label' />}
                                name="timeEnd"
                                normalize={(value) => value && dayjs(value, 'YYYY/MM/DD HH:mm:ss')}
                                fieldProps={{
                                    format: 'DD/MM/YYYY HH:mm:ss',
                                    showTime: true
                                }}
                                // width="auto"
                                rules={[{ required: true, message: <FormattedMessage id='testDetail-setting.time-end.required' /> }]}
                                placeholder={intl.messages['testDetail-setting.time-end.placeholder'] as string}
                            />
                        </ConfigProvider>
                    </Col>
                    <Col span={8}>
                        <ProFormSelect
                            name="gradeId"
                            label={<FormattedMessage id='testDetail-setting.grade.label' />}
                            placeholder={intl.messages['testDetail-setting.grade.placeholder'] as string}
                            options={grades.map((grade) => {
                                return {
                                    label: grade.name,
                                    value: grade.id
                                }
                            })}
                            rules={[{ required: true, message: <FormattedMessage id='testDetail-setting.grade.required' /> }]}

                        />
                    </Col>
                    <Col span={8}>
                        <ProFormSelect
                            name="subjectId"
                            label={<FormattedMessage id='testDetail-setting.subject.label' />}
                            placeholder={intl.messages['testDetail-setting.subject.placeholder'] as string}
                            options={subjects.map((subject) => {
                                return {
                                    label: subject.name,
                                    value: subject.id
                                }
                            })}
                            rules={[{ required: true, message: <FormattedMessage id='testDetail-setting.subject.required' /> }]}

                        />
                    </Col>
                    <Col span={4}>
                        <ProFormSwitch
                            label={<FormattedMessage id='testDetail-setting.random-reserve-question.label' />}
                            name="isRandomQuestion"
                            checkedChildren={<FormattedMessage id='testDetail-setting.random-reserve-question.active' />}
                            unCheckedChildren={<FormattedMessage id='testDetail-setting.random-reserve-question.unactive' />}
                            initialValue={true}
                            fieldProps={{
                                defaultChecked: true,
                            }}
                        />
                    </Col>
                    <Col span={4}>
                        <ProFormSwitch
                            label={<FormattedMessage id='testDetail-setting.random-reserve-answer.label' />}
                            name="isRandomAnswer"
                            checkedChildren={<FormattedMessage id='testDetail-setting.random-reserve-answer.active' />}
                            unCheckedChildren={<FormattedMessage id='testDetail-setting.random-reserve-answer.unactive' />}
                            initialValue={true}
                            fieldProps={{
                                defaultChecked: true,
                            }}
                        />
                    </Col>
                    <Col span={8}>
                        <ProFormDigit
                            label={<FormattedMessage id='testDetail-setting.duration.title' />}
                            name="duration"
                            rules={[{ required: true, message: <FormattedMessage id='testDetail-setting.duration.input.required' /> }]}
                            placeholder={intl.messages['testDetail-setting.duration.input.placeholder'] as string}
                            fieldProps={{
                                addonAfter: <FormattedMessage id='testDetail-setting.duration.input.sub-title' />,
                                formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                parser: (value) => +(value || '').replace(/\$\s?|(,*)/g, '')
                            }}
                        />
                    </Col>
                    <Col span={24}>
                        <ProFormTextArea
                            name="description"
                            label={<FormattedMessage id='testDetail-setting.description.label' />}
                            placeholder={intl.messages['testDetail-setting.description.placeholder'] as string}
                        />
                    </Col>
                </Row>
                <Divider />
            </ProForm>
        </div>
    )
}

export default SettingTestUpdate