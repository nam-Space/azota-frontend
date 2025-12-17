import React, { useEffect, useState } from 'react'
import styles from './test.module.scss'
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, FileSyncOutlined, QuestionCircleOutlined, RightOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { Button, message } from 'antd'
import { IClassroomExercise, IHistory } from '@/types/backend'
import { useRouter } from 'next/router'
import { callFetchClassroomExerciseByClassroomIdAndExerciseId, callFetchClassroomExerciseById, callFetchHistoryByClassroomExerciseIdAndUserId } from '@/config/api'
import dayjs from 'dayjs'
import { useAppSelector } from '@/redux/hooks'
import Link from 'next/link'
import { formatMinute } from '@/utils/formatDate'
import Access from '@/components/Share/Access'
import { ALL_PERMISSIONS } from '@/constants/permission'
import { FormattedMessage } from 'react-intl'

const StudentTest = () => {
    const router = useRouter()

    const user = useAppSelector(state => state.account.user)
    const [openHistory, setOpenHistory] = useState(false)
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

    useEffect(() => {
        if (router.query.classroomId && router.query.testId) {
            const classroomId = router.query.classroomId
            const testId = router.query.testId
            const handleGetClassroomExercise = async () => {
                const res = await callFetchClassroomExerciseByClassroomIdAndExerciseId(+classroomId, +testId)
                if (res.data) {
                    setClassroomExercise(res.data)
                }
            }

            handleGetClassroomExercise()
        }
    }, [router])

    const handleStartTest = async () => {
        const timeEnd = new Date(classroomExercise.exercise?.timeEnd as any).getTime()
        if (new Date().getTime() > timeEnd) {
            message.error("Đã quá thời gian cho phép, bạn không thể làm được bài!");
            return
        }
        const res = await callFetchHistoryByClassroomExerciseIdAndUserId(classroomExercise.id as number, user.id)
        if (res.data) {
            message.error("Không thể bắt đầu! Bạn đã làm bài thi trước đó rồi!");
            return
        }
        router.push(`/student/classroom/${classroomExercise.classroomId}/test/${classroomExercise.exerciseId}/starting/${classroomExercise.id}`)
    }

    return (
        <div className={styles['container']}>
            <div className={styles['wrapper']}>
                <h2>{classroomExercise.exercise?.name}</h2>
                <div className={styles['task-info']}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <ClockCircleOutlined />
                            <p>
                                <FormattedMessage id="student-classroomDetail-testDetail.duration.title" />
                            </p>
                        </div>
                        <p style={{ fontWeight: 600 }}>{classroomExercise.exercise?.duration} <FormattedMessage id="student-classroomDetail-testDetail.duration.sub-title" /></p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <CalendarOutlined />
                            <p>
                                <FormattedMessage id="student-classroomDetail-testDetail.time-start" />
                            </p>
                        </div>
                        <p style={{ fontWeight: 600 }}>{dayjs(classroomExercise.exercise?.timeStart).format('DD-MM-YYYY HH:mm:ss')}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <CloseCircleOutlined />
                            <p>
                                <FormattedMessage id="student-classroomDetail-testDetail.time-end" />
                            </p>
                        </div>
                        <p style={{ fontWeight: 600 }}>{dayjs(classroomExercise.exercise?.timeEnd).format('DD-MM-YYYY HH:mm:ss')}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <QuestionCircleOutlined />
                            <p>
                                <FormattedMessage id="student-classroomDetail-testDetail.total-question" />
                            </p>
                        </div>
                        <p style={{ fontWeight: 600 }}>{classroomExercise.exercise?.questions?.length}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <FileSyncOutlined />
                            <p>
                                <FormattedMessage id="student-classroomDetail-testDetail.type.title" />
                            </p>
                        </div>
                        <p style={{ fontWeight: 600 }}>
                            <FormattedMessage id="student-classroomDetail-testDetail.type.sub-title" />
                        </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <UsergroupAddOutlined />
                            <p>
                                <FormattedMessage id="student-classroomDetail-testDetail.total-submit.title" />
                            </p>
                        </div>
                        <p style={{ fontWeight: 600 }}>{classroomExercise.histories?.length} <FormattedMessage id="student-classroomDetail-testDetail.total-submit.sub-title" /></p>
                    </div>
                </div>
                <Access permission={ALL_PERMISSIONS.HISTORY.CREATE} hideChildren>
                    <Button onClick={handleStartTest} type='primary' style={{ background: '#F97316', color: 'white', width: '100%', marginTop: 20 }}>
                        <FormattedMessage id="student-classroomDetail-testDetail.btn-start" /><RightOutlined />
                    </Button>
                </Access>
            </div>
            {(openHistory) ? (<div className={styles['history']}>
                <p style={{ textAlign: 'left' }}>
                    <FormattedMessage id="student-classroomDetail-testDetail.history.title" />
                </p>
                {(classroomExercise.histories as IHistory[]).filter(history => history.userId === user.id).length > 0 ?
                    (classroomExercise.histories as IHistory[])
                        .sort((a, b) => new Date(b.createdAt + '').getTime() - new Date(a.createdAt + '').getTime())
                        .map((history, index) => history.userId === user.id && (
                            <div key={index} style={{ marginTop: 20 }} className={styles['wrapper-history']}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20, borderBottom: '1px solid #d9d9d9' }}>
                                    <FormattedMessage id="student-classroomDetail-testDetail.history.score" /> <h1>{history.score}</h1>
                                </div>
                                <div style={{ padding: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <ClockCircleOutlined />
                                            <p><FormattedMessage id="student-classroomDetail-testDetail.history.duration" /> </p>
                                        </div>
                                        <p style={{ fontWeight: 600 }}>{formatMinute(history.duration as number)}</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, color: '#6FCE0D' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <CheckCircleOutlined />
                                            <p><FormattedMessage id="student-classroomDetail-testDetail.history.number-correct" /> </p>
                                        </div>
                                        <p style={{ fontWeight: 600 }}>{history.totalCorrect}</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <CheckCircleOutlined />
                                            <p><FormattedMessage id="student-classroomDetail-testDetail.history.number-question" /> </p>
                                        </div>
                                        <p style={{ fontWeight: 600 }}>{classroomExercise.exercise?.questions?.length}</p>
                                    </div>
                                    <Button type='default' style={{ width: '100%', marginTop: 20, background: '#F1F5F9', color: '#64748B', fontWeight: 600 }}>
                                        <Link href={`/student/history/${history.id}`}>
                                            <FormattedMessage id="student-classroomDetail-testDetail.history.view-detail" />
                                        </Link>
                                    </Button>
                                    <p style={{ textAlign: 'right', marginTop: 12 }}>{dayjs(history.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                                </div>
                            </div>
                        )) : <div style={{ marginTop: 6, fontWeight: 600 }}>
                        <FormattedMessage id="student-classroomDetail-testDetail.history.no-info" />
                    </div>}
            </div>) :
                (<Button onClick={() => setOpenHistory(true)} type='default' style={{ marginTop: 20, background: '#F1F5F9', color: '#64748B', fontWeight: 600 }}>
                    <FormattedMessage id="student-classroomDetail-testDetail.view-history" />
                </Button>)
            }


        </div>
    )
}

export default StudentTest