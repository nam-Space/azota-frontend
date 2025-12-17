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
import { TreeSelect } from 'antd';
import { fetchGroup } from '@/redux/slice/groupSlide'
import { IClassroom, IGroup } from '@/types/backend'
import { callCreateBulkAnswer, callCreateBulkQuestion, callCreateClassroomExercise, callCreateExercise } from '@/config/api'
import { useRouter } from 'next/router'
import { TEST } from '@/constants/task'

const { SHOW_PARENT } = TreeSelect;

interface IQuestion {
    name: string;
}

interface IAnswer {
    index?: number;
    name: string;
    isCorrect: boolean;
}

interface IProps {
    arrValueQuestion: Array<IQuestion>;
    listArrValueAnswer: Array<Array<IAnswer>>;
}

const SettingTest = (props: IProps) => {
    const { arrValueQuestion, listArrValueAnswer } = props
    const router = useRouter()
    const dispatch = useAppDispatch()

    const theme = useAppSelector(state => state.theme.name)
    const [groupClassroomValues, setGroupClassroomValues] = useState<string[]>([]);

    const [form] = Form.useForm()

    const user = useAppSelector(state => state.account.user)
    const grades = useAppSelector(state => state.grade.result)
    const subjects = useAppSelector(state => state.subject.result)
    const groups = useAppSelector(state => state.group.result)

    useEffect(() => {
        dispatch(fetchGrade({ query: 'page=1&limit=500' }))
        dispatch(fetchSubject({ query: 'page=1&limit=500' }))
        dispatch(fetchGroup({ query: `page=1&limit=500&filter.createdBy=$eq:${user.id}&relations=classrooms` }))
    }, [JSON.stringify(user)])

    const onFinish = async (values: any) => {
        let check = true

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

        const resExercise = await callCreateExercise({
            name,
            type: TEST,
            timeStart: dayjs(timeStart, 'DD/MM/YYYY HH:mm:ss').toDate(),
            timeEnd: dayjs(timeEnd, 'DD/MM/YYYY HH:mm:ss').toDate(),
            duration,
            isRandomQuestion,
            isRandomAnswer,
            gradeId,
            subjectId,
            description
        })
        if (!resExercise.data) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: 'Không thể tạo đề thi cho lớp học',
                duration: 5
            })
            check = false
            return
        }

        const newExercise = resExercise.data

        const handleCreateBulkQuestionAndAnswer = async () => {
            const resArrQuestion = await callCreateBulkQuestion(arrValueQuestion.map(valueQuestion => {
                return {
                    name: valueQuestion.name,
                    exerciseId: newExercise.id
                }
            }))

            if (!resArrQuestion.data) {
                message.error('Không thể tạo đề thi cho lớp học');
                check = false
                return
            }

            const newArrQuestion = resArrQuestion.data
            // listArrValueAnswer
            for (let j = 0; j < newArrQuestion.length; j++) {
                const newQuestion = newArrQuestion[j]
                const resArrAnswer = await callCreateBulkAnswer(listArrValueAnswer[j].map(answer => {
                    return {
                        name: answer.name,
                        questionId: newQuestion.id,
                        isCorrect: answer.isCorrect
                    }
                }))

                if (!resArrAnswer.data) {
                    message.error('Không thể tạo đề thi cho lớp học');
                    return
                }
            }
        }

        handleCreateBulkQuestionAndAnswer()

        if (!check) {
            return;
        }

        for (let i = 0; i < groupClassroomValues.length; i++) {
            const groupClassroomValue = groupClassroomValues[i]

            const arrId = groupClassroomValue.split('-')
            if (arrId.length >= 2) {
                const groupId = arrId[0]
                const classroomId = arrId[1]

                const handleCreateClassroomExercise = async () => {
                    const resClassroomExercise = await callCreateClassroomExercise({
                        classroomId: +classroomId,
                        exerciseId: newExercise.id,
                    })
                    if (!resClassroomExercise.data) {
                        message.error('Không thể tạo đề thi cho lớp học');
                        check = false
                        return
                    }
                }

                handleCreateClassroomExercise()

                if (!check) {
                    return;
                }
            }
            else {
                const groupId = arrId[0]
                const group = groups.find(group => group.id === +groupId) as IGroup
                (group.classrooms as IClassroom[]).forEach(classroom => {
                    const classroomId = classroom.id + ''

                    const handleCreateClassroomExercise = async () => {
                        const resClassroomExercise = await callCreateClassroomExercise({
                            classroomId: +classroomId,
                            exerciseId: newExercise.id,
                        })
                        if (!resClassroomExercise.data) {
                            message.error('Không thể tạo đề thi cho lớp học');
                            check = false
                            return
                        }
                    }

                    handleCreateClassroomExercise()

                    if (!check) {
                        return;
                    }
                })
            }
        }


        if (check) {
            message.success('Tạo mới đề thi thành công!');
            router.push('/test')
        }
    }

    const onChange = (newValue: string[]) => {
        setGroupClassroomValues(newValue);
    };

    const [treeData, setTreeData] = useState([{
        title: 'Node1',
        value: '0-0',
        key: '0-0',
        children: [
            {
                title: 'Child Node1',
                value: '0-0-0',
                key: '0-0-0',
            },
        ],
    },
    {
        title: 'Node2',
        value: '0-1',
        key: '0-1',
        children: [
            {
                title: 'Child Node3',
                value: '0-1-0',
                key: '0-1-0',
            },
            {
                title: 'Child Node4',
                value: '0-1-1',
                key: '0-1-1',
            },
            {
                title: 'Child Node5',
                value: '0-1-2',
                key: '0-1-2',
            },
        ],
    }])

    useEffect(() => {
        setTreeData(groups.map(group => ({
            title: group.name as string,
            value: group.id + '',
            key: group.id + '',
            children: (group.classrooms as IClassroom[]).map(classroom => ({
                title: classroom ? classroom.name + '' : '',
                value: classroom ? `${group.id}-${classroom.id}` : '',
                key: classroom ? `${group.id}-${classroom.id}` : '',
            }))
        })))
    }, [JSON.stringify(groups)])

    const tProps = {
        treeData,
        value: groupClassroomValues,
        onChange,
        treeCheckable: true,
        showCheckedStrategy: SHOW_PARENT,
        placeholder: 'Vui lòng chọn lớp học',
        style: {
            width: '100%',
        },
    };

    return (
        <div className={styles['adding-container']}>
            <h2 className={styles['heading-title']}>Cấu hình chung</h2>
            <ProForm
                form={form}
                onFinish={onFinish}
                style={{ padding: 20, borderTop: '1px solid #d9d9d9' }}
                submitter={
                    {
                        searchConfig: {
                            resetText: "Hủy",
                            submitText: <>Lưu</>
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
                            label="Tên"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                            placeholder="Nhập tên"
                        />
                    </Col>
                </Row>
                <Row gutter={[20, 20]}>
                    <Col span={4}>
                        <ConfigProvider locale={enUS}>
                            <ProFormDatePicker
                                label="Ngày bắt đầu"
                                name="timeStart"
                                normalize={(value) => value && dayjs(value, 'YYYY/MM/DD HH:mm:ss')}
                                fieldProps={{
                                    format: 'DD/MM/YYYY HH:mm:ss',
                                    showTime: true
                                }}
                                rules={[{ required: true, message: 'Vui lòng chọn ngày cấp' }]}
                                placeholder="dd/mm/yyyy"
                            />
                            {/* <DatePicker onChange={handleChangeDatePicker} /> */}
                        </ConfigProvider>
                    </Col>
                    <Col span={4}>
                        <ConfigProvider locale={enUS}>
                            <ProFormDatePicker

                                label="Ngày kết thúc"
                                name="timeEnd"
                                normalize={(value) => value && dayjs(value, 'YYYY/MM/DD HH:mm:ss')}
                                fieldProps={{
                                    format: 'DD/MM/YYYY HH:mm:ss',
                                    showTime: true
                                }}
                                // width="auto"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày cấp' }]}
                                placeholder="dd/mm/yyyy"
                            />
                        </ConfigProvider>
                    </Col>
                    <Col span={8}>
                        <ProFormSelect
                            name="gradeId"
                            label="Khối học"
                            placeholder="Chọn khối học"
                            options={grades.map((grade) => {
                                return {
                                    label: grade.name,
                                    value: grade.id
                                }
                            })}
                            rules={[{ required: true, message: 'Vui lòng chọn khối học' }]}

                        />
                    </Col>
                    <Col span={8}>
                        <ProFormSelect
                            name="subjectId"
                            label="Môn học"
                            placeholder="Chọn môn học"
                            options={subjects.map((subject) => {
                                return {
                                    label: subject.name,
                                    value: subject.id
                                }
                            })}
                            rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}

                        />
                    </Col>
                    <Col span={4}>
                        <ProFormSwitch
                            label="Đảo câu hỏi"
                            name="isRandomQuestion"
                            checkedChildren="ACTIVE"
                            unCheckedChildren="INACTIVE"
                            initialValue={true}
                            fieldProps={{
                                defaultChecked: true,
                            }}
                        />
                    </Col>
                    <Col span={4}>
                        <ProFormSwitch
                            label="Đảo đáp án"
                            name="isRandomAnswer"
                            checkedChildren="ACTIVE"
                            unCheckedChildren="INACTIVE"
                            initialValue={true}
                            fieldProps={{
                                defaultChecked: true,
                            }}
                        />
                    </Col>
                    <Col span={8}>
                        <ProFormDigit
                            label="Thời gian làm bài"
                            name="duration"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập thời gian"
                            fieldProps={{
                                addonAfter: " phút",
                                formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                parser: (value) => +(value || '').replace(/\$\s?|(,*)/g, '')
                            }}
                        />
                    </Col>
                    <Col span={8}>
                        <p style={{ marginBottom: 8 }}>Chọn lớp học</p>
                        <TreeSelect {...tProps} />
                    </Col>
                    <Col span={24}>
                        <ProFormTextArea
                            name="description"
                            label="Mô tả"
                            placeholder="Vui lòng điền mô tả"
                        />
                    </Col>
                </Row>
                <Divider />
            </ProForm>
        </div>
    )
}

export default SettingTest