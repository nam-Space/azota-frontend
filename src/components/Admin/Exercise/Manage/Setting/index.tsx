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
import { HOMEWORK } from '@/constants/task'
import { IExercise } from '@/types/backend'
import { changeDatetimeToPostman } from '@/utils/formatDate'
import { FormattedMessage, useIntl } from 'react-intl'


const SettingExerciseUpdate = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const intl = useIntl()
    const [form] = Form.useForm()

    const theme = useAppSelector(state => state.theme.name)
    const grades = useAppSelector(state => state.grade.result)
    const subjects = useAppSelector(state => state.subject.result)
    const [exercise, setExercise] = useState<IExercise>({
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
        if (router.query.exerciseId) {
            dispatch(fetchGrade({ query: 'page=1&limit=500' }))
            dispatch(fetchSubject({ query: 'page=1&limit=500' }))

            const exerciseId = router.query.exerciseId
            const handleGetExercise = async () => {
                const res = await callFetchExerciseById(+exerciseId)
                if (res.data) {
                    setExercise(res.data)
                }
            }

            handleGetExercise()
        }

    }, [router])

    useEffect(() => {
        form.setFieldsValue({
            ...exercise,
        })
    }, [JSON.stringify(exercise)])

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
            type: HOMEWORK,
            timeStart: changeDatetimeToPostman(timeStart),
            timeEnd: changeDatetimeToPostman(timeEnd),
            duration,
            isRandomQuestion,
            isRandomAnswer,
            gradeId,
            subjectId,
            description
        }, +(router.query.exerciseId as string))

        if (res.data) {
            message.success("Cập nhật bài tập thành công");
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
            <h2 className={styles['heading-title']}><FormattedMessage id="exerciseDetail-setting.title" /></h2>
            <ProForm
                form={form}
                onFinish={onFinish}
                style={{ padding: 20, borderTop: '1px solid #d9d9d9' }}
                submitter={
                    {
                        searchConfig: {
                            resetText: <span><FormattedMessage id="exerciseDetail-setting.cancel" /></span>,
                            submitText: <span><FormattedMessage id="exerciseDetail-setting.submit" /></span>
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
                            label={<FormattedMessage id="exerciseDetail-setting.name.label" />}
                            name="name"
                            rules={[
                                { required: true, message: <FormattedMessage id="exerciseDetail-setting.name.required" /> },
                            ]}
                            placeholder={intl.messages['exerciseDetail-setting.name.placeholder'] as string}
                        />
                    </Col>
                </Row>
                <Row gutter={[20, 20]}>
                    <Col span={4}>
                        <ConfigProvider locale={enUS}>
                            <ProFormDatePicker
                                label={<FormattedMessage id="exerciseDetail-setting.time-start.label" />}
                                name="timeStart"
                                normalize={(value) => value && dayjs(value, 'YYYY/MM/DD HH:mm:ss')}
                                fieldProps={{
                                    format: 'DD/MM/YYYY HH:mm:ss',
                                    showTime: true
                                }}
                                rules={[{ required: true, message: <FormattedMessage id="exerciseDetail-setting.time-start.required" /> }]}
                                placeholder={intl.messages["exerciseDetail-setting.time-start.placeholder"] as string}
                            />
                            {/* <DatePicker onChange={handleChangeDatePicker} /> */}
                        </ConfigProvider>
                    </Col>
                    <Col span={4}>
                        <ConfigProvider locale={enUS}>
                            <ProFormDatePicker

                                label={<FormattedMessage id="exerciseDetail-setting.time-end.label" />}
                                name="timeEnd"
                                normalize={(value) => value && dayjs(value, 'YYYY/MM/DD HH:mm:ss')}
                                fieldProps={{
                                    format: 'DD/MM/YYYY HH:mm:ss',
                                    showTime: true
                                }}
                                // width="auto"
                                rules={[{ required: true, message: <FormattedMessage id="exerciseDetail-setting.time-end.required" /> }]}
                                placeholder={intl.messages["exerciseDetail-setting.time-end.placeholder"] as string}
                            />
                        </ConfigProvider>
                    </Col>
                    <Col span={8}>
                        <ProFormSelect
                            name="gradeId"
                            label={<FormattedMessage id="exerciseDetail-setting.grade.label" />}
                            placeholder={intl.messages["exerciseDetail-setting.grade.placeholder"] as string}
                            options={grades.map((grade) => {
                                return {
                                    label: grade.name,
                                    value: grade.id
                                }
                            })}
                            rules={[{ required: true, message: <FormattedMessage id="exerciseDetail-setting.grade.required" /> }]}

                        />
                    </Col>
                    <Col span={8}>
                        <ProFormSelect
                            name="subjectId"
                            label={<FormattedMessage id="exerciseDetail-setting.subject.label" />}
                            placeholder={intl.messages["exerciseDetail-setting.subject.placeholder"] as string}
                            options={subjects.map((subject) => {
                                return {
                                    label: subject.name,
                                    value: subject.id
                                }
                            })}
                            rules={[{ required: true, message: <FormattedMessage id="exerciseDetail-setting.subject.required" /> }]}

                        />
                    </Col>
                    <Col span={4}>
                        <ProFormSwitch
                            label={<FormattedMessage id="exerciseDetail-setting.random-reserve-question.label" />}
                            name="isRandomQuestion"
                            checkedChildren={<FormattedMessage id="exerciseDetail-setting.random-reserve-question.active" />}
                            unCheckedChildren={<FormattedMessage id="exerciseDetail-setting.random-reserve-question.unactive" />}
                            initialValue={true}
                            fieldProps={{
                                defaultChecked: true,
                            }}
                        />
                    </Col>
                    <Col span={4}>
                        <ProFormSwitch
                            label={<FormattedMessage id="exerciseDetail-setting.random-reserve-answer.label" />}
                            name="isRandomAnswer"
                            checkedChildren={<FormattedMessage id="exerciseDetail-setting.random-reserve-answer.active" />}
                            unCheckedChildren={<FormattedMessage id="exerciseDetail-setting.random-reserve-answer.unactive" />}
                            initialValue={true}
                            fieldProps={{
                                defaultChecked: true,
                            }}
                        />
                    </Col>
                    <Col span={8}>
                        <ProFormDigit
                            label={<FormattedMessage id="exerciseDetail-setting.duration.title" />}
                            name="duration"
                            rules={[{ required: true, message: <FormattedMessage id="exerciseDetail-setting.duration.input.required" /> }]}
                            placeholder={intl.messages["exerciseDetail-setting.duration.input.placeholder"] as string}
                            fieldProps={{
                                addonAfter: <FormattedMessage id="exerciseDetail-setting.duration.input.sub-title" />,
                                formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                parser: (value) => +(value || '').replace(/\$\s?|(,*)/g, '')
                            }}
                        />
                    </Col>
                    <Col span={24}>
                        <ProFormTextArea
                            name="description"
                            label={<FormattedMessage id="exerciseDetail-setting.description.label" />}
                            placeholder={intl.messages['exerciseDetail-setting.description.placeholder'] as string}
                        />
                    </Col>
                </Row>
                <Divider />
            </ProForm>
        </div>
    )
}

export default SettingExerciseUpdate