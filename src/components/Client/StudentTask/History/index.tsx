import React, { useEffect, useState } from 'react'
import styles from './history.module.scss'
import { CheckCircleFilled, CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import { callFetchHistoryById } from '@/config/api'
import { IAnswerHistory, IHistory, } from '@/types/backend'
import { FormattedMessage } from 'react-intl'

const StudentHistory = () => {
    const router = useRouter()
    const [history, setHistory] = useState<IHistory>({
        id: 0,
        userId: 0,
        score: 0,
        totalCorrect: 0,
        duration: 0,
        classroomExerciseId: 0,
        answerHistories: [],

        createdBy: 0,
        updatedBy: 0,
        deletedBy: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
    })

    useEffect(() => {
        if (router.query.historyId) {
            const historyId = router.query.historyId
            const handleGetHistory = async () => {
                const res = await callFetchHistoryById(+historyId)
                if (res.data) {
                    setHistory(res.data)
                }
            }

            handleGetHistory()
        }
    }, [router])

    return (
        <div>
            <div className={styles['wrapper']}>
                <div className={styles['left-container']}>
                    <h2 style={{ padding: 10, borderBottom: '1px solid #f1f1f1' }}><FormattedMessage id="student-historyDetail.left-container.score" /> {history.score}/10</h2>
                    <div style={{ padding: 10 }}>
                        <div style={{ borderRadius: 6, border: '1px solid #f1f1f1', overflow: 'hidden' }}>
                            <p style={{ padding: 10, background: '#E2E8F0' }}><FormattedMessage id="student-historyDetail.left-container.detail-info" /></p>
                            <div style={{ padding: 10 }}>
                                <p>
                                    <FormattedMessage id="student-historyDetail.left-container.format.title" /> {history.score}{" "}
                                    ({history.answerHistories?.length}/{history.classroomExercise?.exercise?.questions?.length} <FormattedMessage id="student-historyDetail.left-container.format.sub-title" />)
                                </p>
                                <div style={{ display: 'flex', gap: 6, marginTop: 6, color: '#6FCE0D' }}>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <CheckCircleOutlined />
                                        <p><FormattedMessage id="student-historyDetail.left-container.number-correct" /> </p>
                                    </div>
                                    <p style={{ fontWeight: 600 }}>{history.totalCorrect}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 6, marginTop: 6, color: 'red' }}>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <CloseCircleOutlined />
                                        <p><FormattedMessage id="student-historyDetail.left-container.number-wrong" /> </p>
                                    </div>
                                    <p style={{ fontWeight: 600 }}>{(history.classroomExercise?.exercise?.questions?.length as number - (history.totalCorrect || 0) || 0)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles['right-container']}>
                    {history.classroomExercise?.exercise?.questions?.map((question, indexQuestion) => (
                        <div key={indexQuestion + 1} className={styles['question-item']}>
                            <div style={{ padding: 20 }}>
                                {indexQuestion === 0 && <h3>{history.classroomExercise?.exercise?.name}</h3>}

                                <div style={{ marginTop: 10 }}>
                                    <p style={{ fontWeight: 600 }}><FormattedMessage id="student-historyDetail.right-container.question" /> {indexQuestion + 1}:</p>
                                    <div dangerouslySetInnerHTML={{
                                        __html: question.name as string
                                    }}></div>
                                </div>
                                {question.answers?.map((answer, indexAnswer) => (
                                    <div key={indexAnswer + 1} style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                                        <span style={{ fontWeight: 600 }}>{String.fromCharCode(indexAnswer + 65)}.</span>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: answer.name as string
                                            }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', padding: 10, gap: 20 }}>
                                    <p
                                        style={{
                                            fontWeight: 700,
                                            color: (history.answerHistories as IAnswerHistory[]).find(answerHistory => answerHistory.questionId === question.id)?.answerChoosenId === question.answers?.find(answer => answer.isCorrect)?.id ? '#00AC33' : '#FF0000'
                                        }}>
                                        <FormattedMessage id="student-historyDetail.right-container.correct-answer" /> {String.fromCharCode((question.answers?.findIndex(answer => answer.isCorrect) as number) + 65)}
                                    </p>
                                    <div style={{ padding: 10, display: 'flex', gap: 26, border: '1px solid #f1f1f1', borderRadius: 4 }}>
                                        {question.answers?.map((answer, indexAnswer) => (
                                            <div key={indexAnswer + 1} style={{ fontWeight: 700, display: 'flex', gap: 2 }}>
                                                {(history.answerHistories as IAnswerHistory[]).find(answerHistory => answerHistory.questionId === question.id)?.answerChoosenId === answer.id ?
                                                    (answer.isCorrect ? <CheckCircleFilled style={{ color: '#00AC33', fontSize: 22 }} /> :
                                                        <CloseOutlined style={{ color: '#FF0000', fontSize: 22 }} />)
                                                    : <div style={{ width: 22, height: 22 }}></div>}
                                                {String.fromCharCode(indexAnswer + 65)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StudentHistory