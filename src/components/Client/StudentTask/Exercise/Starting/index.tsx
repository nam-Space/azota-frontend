import React, { useEffect, useRef, useState } from 'react'
import styles from './starting.module.scss'
import { useAppSelector } from '@/redux/hooks'
import { Button, Form, message, notification } from 'antd'
import { CheckSquareOutlined, FormOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { IAnswer, IClassroomExercise, IExercise, IQuestion } from '@/types/backend'
import { callCreateBulkAnswerHistory, callCreateHistory, callFetchClassroomExerciseById, callFetchExerciseById } from '@/config/api'
import { ModalForm } from '@ant-design/pro-components'
import { isMobile } from 'react-device-detect'
import _ from 'lodash'
import CountdownTask from '../../CountdownTask'
import { randomly } from '@/utils/random'
import { FormattedMessage } from 'react-intl'

interface IAnswerProps {
    questionId: number;
    answerId?: number;
}

const StartingExercise = () => {
    const router = useRouter()

    const user = useAppSelector(state => state.account.user)
    const theme = useAppSelector(state => state.theme.name)

    const [exercise, setExercise] = useState<IExercise>({
        id: 0,
        name: '',
        type: '',
        description: '',
        timeStart: new Date(),
        timeEnd: new Date(),
        duration: 0,
        isRandomQuestion: true,
        isRandomAnswer: true,
        gradeId: 0,
        subjectId: 0,
        questions: [],
        classroomExercises: [],

        createdBy: 0,
        updatedBy: 0,
        deletedBy: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
    })
    const [classroomExercise, setClassroomExercise] = useState<IClassroomExercise>({
        id: 0,
        classroomId: 0,
        exerciseId: 0,
        histories: [],

        createdBy: 0,
        updatedBy: 0,
        deletedBy: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
    })
    const [isTimeOut, setIsTimeout] = useState(false)

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [animation, setAnimation] = useState<string>('open');

    const [arrAnswer, setArrAnswer] = useState<IAnswerProps[]>([])
    const timeToStart = useRef(new Date())

    useEffect(() => {
        if (router.query.exerciseId && router.query.classroomExerciseId) {
            const exerciseId = router.query.exerciseId
            const classroomExerciseId = router.query.classroomExerciseId

            const handleGetExercise = async () => {
                const res = await callFetchExerciseById(+exerciseId)
                if (res.data) {
                    let resExercise = res.data
                    if (resExercise.isRandomQuestion) {
                        randomly(resExercise.questions as IQuestion[])
                    }
                    if (resExercise.isRandomAnswer) {
                        for (let i = 0; i < (resExercise.questions?.length as number); i++) {
                            randomly(resExercise.questions?.[i].answers as IAnswer[])
                        }
                    }
                    setExercise(resExercise)
                }
            }

            const handleGetClassroomExercise = async () => {
                const res = await callFetchClassroomExerciseById(+classroomExerciseId)
                if (res.data) {
                    setClassroomExercise(res.data)
                }
            }

            handleGetExercise()
            handleGetClassroomExercise()
        }
    }, [router])

    useEffect(() => {
        setArrAnswer((exercise.questions as IQuestion[]).map(question => {
            return {
                questionId: question.id as number
            }
        }))
    }, [JSON.stringify(exercise)])

    const handleChooseAnswer = (questionId: number, answerId: number) => {
        const newArrAnswer = [...arrAnswer]
        const index = (arrAnswer as IAnswerProps[]).findIndex(item => item.questionId === questionId)
        newArrAnswer[index].answerId = answerId
        setArrAnswer(newArrAnswer)
    }

    const handleSubmitTask = async () => {
        const timeToEnd = (new Date())
        const duration = timeToEnd.getTime() - timeToStart.current.getTime()

        const correctAnswer = (exercise.questions as IQuestion[]).map(question => {
            return {
                questionId: question.id,
                answerId: (question.answers as IAnswer[]).find(answer => answer.isCorrect === true)?.id
            }
        })
        let score = 0
        let totalCorrect = 0
        const totalQuestion = (exercise.questions as IQuestion[]).length;
        arrAnswer.forEach((ans, indexAns) => {
            if (ans.questionId === correctAnswer[indexAns].questionId && ans.answerId === correctAnswer[indexAns].answerId) {
                score += (1 / totalQuestion) * 10
                totalCorrect++
            }
        })
        const resHistory = await callCreateHistory({
            userId: user.id,
            classroomExerciseId: classroomExercise.id,
            score,
            totalCorrect,
            duration
        })
        if (!resHistory.data) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: `Không thể nộp bài!`,
                duration: 5
            })
            return
        }
        const history = resHistory.data
        const resAnswerHistory = await callCreateBulkAnswerHistory(arrAnswer.map(answer => {
            return {
                historyId: history.id,
                questionId: answer.questionId,
                answerChoosenId: answer.answerId
            }
        }))

        if (!resAnswerHistory.data) {
            notification.error({
                message: "Có lỗi xảy ra",
                description: `Không thể nộp bài!`,
                duration: 5
            })
            return
        }

        message.success('Đã lưu kết quả bài làm thành công!');
        window.location.href = `/student/history/${history.id}`
    }

    useEffect(() => {
        if (isTimeOut) {
            handleSubmitTask()
        }
    }, [isTimeOut])

    return (
        <div >
            <div className={styles['container']}>
                <div className={styles['left-container']}>
                    {(exercise.questions as IQuestion[]).map((question, index) => {
                        return (
                            <div id={(index + 1) + ''} key={index + 1} className={styles['question-item']}>
                                <div style={{ padding: 20 }}>
                                    {index == 0 && <h3>{exercise.name}</h3>}

                                    <div style={{ marginTop: 10 }}>
                                        <p style={{ fontWeight: 600 }}>
                                            <FormattedMessage id="student-classroomDetail-exerciseDetail-startingDetail.left-container.question" /> {index + 1}:
                                        </p>
                                        <div dangerouslySetInnerHTML={{
                                            __html: question.name as string
                                        }}></div>
                                    </div>
                                    {(question.answers as IAnswer[]).map((answer, indexAnswer) => (
                                        <div key={indexAnswer + 1} style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                                            <span style={{ fontWeight: 600 }}>{String.fromCharCode(indexAnswer + 65)}.</span>
                                            <div dangerouslySetInnerHTML={{
                                                __html: answer.name as string
                                            }}></div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: theme, color: 'white', padding: 6 }}>
                                        <p style={{ fontWeight: 600 }}><FormattedMessage id="student-classroomDetail-exerciseDetail-startingDetail.left-container.your-answer" /></p>
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            {(question.answers as IAnswer[]).map((answer, indexAnswer) => (
                                                <div onClick={() => handleChooseAnswer(question.id as number, answer.id as number)} key={indexAnswer + 1} style={{ cursor: 'pointer', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: answer.id === arrAnswer[index]?.answerId ? '#F39C12' : 'white', color: answer.id === arrAnswer[index]?.answerId ? 'white' : 'black', fontWeight: 600 }}>
                                                    {String.fromCharCode(indexAnswer + 65)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className={styles['right-container']}>
                    <p style={{ fontWeight: 600, textAlign: 'left' }}><FormattedMessage id="student-classroomDetail-exerciseDetail-startingDetail.right-container.title" /></p>
                    <div className={styles['answer-wrapper']}>
                        {(exercise.questions as IQuestion[]).map((_, index) => (
                            <a href={`#${index + 1}`} key={index + 1} style={{ background: arrAnswer[index]?.answerId ? theme : 'transparent', color: arrAnswer[index]?.answerId ? 'white' : 'black' }} className={styles['answer-item']}>{`${index + 1}`.length < 2 ? `0${index + 1}` : index + 1}</a>
                        ))}
                    </div>
                    <div style={{ marginTop: 20, display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center' }}>
                        <FormattedMessage id="student-classroomDetail-exerciseDetail-startingDetail.right-container.time-remaining" />
                        <CountdownTask duration={exercise.duration} setIsTimeout={setIsTimeout} />
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} style={{ marginTop: 20, background: theme }} type='primary' icon={<FormOutlined />}>
                        <span>
                            <FormattedMessage id="student-classroomDetail-exerciseDetail-startingDetail.right-container.submit.title" />
                        </span>
                    </Button>
                </div>
            </div>
            <ModalForm
                title={<FormattedMessage id="student-classroomDetail-exerciseDetail-startingDetail.right-container.submit.modal.title" />}
                open={isModalOpen}
                modalProps={{
                    onCancel: () => { setIsModalOpen(false) },
                    afterClose: () => setIsModalOpen(false),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 700,
                    footer: null,
                    keyboard: false,
                    maskClosable: false,
                    className: `${animation}`,
                    rootClassName: `${animation}`
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={handleSubmitTask}
                initialValues={{}}
                submitter={{
                    render: (_: any, dom: any) => <div style={{ display: 'flex', gap: '10px' }}>{dom}</div>,
                    submitButtonProps: {
                        icon: <CheckSquareOutlined />
                    },
                    searchConfig: {
                        resetText: <span><FormattedMessage id="student-classroomDetail-exerciseDetail-startingDetail.right-container.submit.modal.cancel" /></span>,
                        submitText: <span><FormattedMessage id="student-classroomDetail-exerciseDetail-startingDetail.right-container.submit.modal.submit" /></span>,
                    }
                }}
            >
            </ModalForm >
        </div>
    )
}

export default StartingExercise