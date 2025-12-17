import React, { useEffect, useState } from 'react'
import styles from './left-container.module.scss'
import { CalendarOutlined, ClockCircleOutlined, CloseCircleOutlined, DeleteOutlined, FileTextOutlined, FolderOutlined, LineChartOutlined, SettingOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRouter } from 'next/router'
import { IClassroomExercise, IExercise } from '@/types/backend'
import { callFetchClassroomExerciseByClassroomIdAndExerciseId, callFetchExerciseById } from '@/config/api'
import dayjs from 'dayjs'
import Link from 'next/link'
import Access from '@/components/Share/Access'
import { ALL_PERMISSIONS } from '@/constants/permission'
import ModalDeleteClassroomExercise from '../Modal'
import { HOMEWORK } from '@/constants/task'
import { useAppSelector } from '@/redux/hooks'
import ModalViewQuestionAnswer from '../Modal/ModalViewQuestionAnswer/ModalViewQuestionAnswer'
import { FormattedMessage } from 'react-intl'

const LeftManageExercise = () => {
    const router = useRouter()
    const theme = useAppSelector(state => state.theme.name)
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

    const [classroomExercise, setClassroomExercise] = useState<IClassroomExercise>({
        id: 0,
        classroomId: 0,
        exerciseId: 0,

        createdBy: 0,
        updatedBy: 0,
        deletedBy: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
    })

    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [openModalViewQuestionAnswer, setOpenModalViewQuestionAnswer] = useState(false)

    useEffect(() => {
        if (router.query.exerciseId && router.query.classroomId) {
            const exerciseId = router.query.exerciseId
            const classroomId = router.query.classroomId
            const handleGetExercise = async () => {
                const res = await callFetchExerciseById(+exerciseId)
                if (res.data) {
                    setExercise(res.data)
                }
            }

            handleGetExercise()

            const handleGetClassroomExercise = async () => {
                const res = await callFetchClassroomExerciseByClassroomIdAndExerciseId(+classroomId, +exerciseId)
                if (res.data) {
                    setClassroomExercise(res.data)
                }
            }

            handleGetClassroomExercise()
        }
    }, [router])

    return (
        <div className={styles['wrapper']}>
            <p style={{ fontWeight: 600 }}>{classroomExercise.exercise?.name}</p>
            <div>
                <div style={{ display: 'flex', marginTop: 10, gap: 6 }}>
                    <CalendarOutlined />
                    <p><FormattedMessage id="classroomDetail-exerciseDetail.left-container.created-at" /> {dayjs(classroomExercise.exercise?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                </div>
                <div style={{ display: 'flex', marginTop: 6, gap: 6 }}>
                    <CalendarOutlined />
                    <p><FormattedMessage id="classroomDetail-exerciseDetail.left-container.time-start" /> {dayjs(classroomExercise.exercise?.timeStart).format('DD-MM-YYYY HH:mm:ss')}</p>
                </div>
                <div style={{ display: 'flex', marginTop: 6, gap: 6 }}>
                    <ClockCircleOutlined />
                    <p><FormattedMessage id="classroomDetail-exerciseDetail.left-container.duration.title" /> {classroomExercise.exercise?.duration} phút</p>
                </div>

                <div style={{ display: 'flex', marginTop: 6, gap: 6 }}>
                    <CloseCircleOutlined />
                    <p><FormattedMessage id="classroomDetail-exerciseDetail.left-container.time-end" /> {dayjs(classroomExercise.exercise?.timeEnd).format('DD-MM-YYYY HH:mm:ss')}</p>
                </div>
            </div>
            <div>
                <p style={{ fontWeight: 600, marginTop: 20 }}><FormattedMessage id="classroomDetail-exerciseDetail.left-container.menu" /></p>
                <div className={styles['setting']}>
                    <Access permission={ALL_PERMISSIONS.EXERCISE.UPDATE} hideChildren>
                        <Button type='text' style={{ width: '100%', textAlign: 'left' }}>
                            <Link style={{ display: 'flex', gap: 6 }} href={`/exercise/${classroomExercise.exercise?.id}/setting`}>
                                <SettingOutlined /><FormattedMessage id="classroomDetail-exerciseDetail.left-container.setting" />
                            </Link>
                        </Button>
                    </Access>
                    <Access permission={ALL_PERMISSIONS.CLASSROOM_EXERCISE.DELETE} hideChildren>
                        <Button onClick={() => setOpenModalDelete(true)} type='text' style={{ width: '100%', textAlign: 'left', color: 'red' }}><DeleteOutlined />
                            <span>
                                <FormattedMessage id="classroomDetail-exerciseDetail.left-container.delete.title" />
                            </span>
                        </Button>
                    </Access>
                </div>
            </div>
            <div>
                <p style={{ fontWeight: 600, marginTop: 20 }}><FormattedMessage id="classroomDetail-exerciseDetail.left-container.assign-to" /></p>
                <div className={styles['assign']}>
                    {exercise.classroomExercises?.map((classroomExercise, index) => classroomExercise.classroom && (
                        <Button key={index} style={{ width: '100%', textAlign: 'left', marginTop: index !== 0 ? 6 : 0 }}>
                            <Link href={`/classroom/${classroomExercise.classroomId}/student`}>{classroomExercise.classroom?.name}</Link>
                        </Button>
                    ))}
                </div>
            </div>
            <div>
                <p style={{ fontWeight: 600, marginTop: 20 }}><FormattedMessage id="classroomDetail-exerciseDetail.left-container.description" /></p>
                <div className={styles['description']}>
                    <p>{classroomExercise.exercise?.description}</p>
                </div>
            </div>
            <div>
                <p style={{ fontWeight: 600, marginTop: 20 }}><FormattedMessage id="classroomDetail-exerciseDetail.left-container.view-question-answer" /></p>
                <div onClick={() => setOpenModalViewQuestionAnswer(true)} style={{ color: theme, fontWeight: 600, display: 'flex', gap: 6, cursor: 'pointer' }} className={styles['view-question-answer']}>
                    <FileTextOutlined />
                    <FormattedMessage id="classroomDetail-exerciseDetail.left-container.view-detail" />
                </div>
            </div>
            <ModalDeleteClassroomExercise type={HOMEWORK} classroomExercise={classroomExercise} isModalOpen={openModalDelete} setIsModalOpen={setOpenModalDelete} />
            <ModalViewQuestionAnswer exercise={exercise} isModalOpen={openModalViewQuestionAnswer} setIsModalOpen={setOpenModalViewQuestionAnswer} />
        </div>
    )
}

export default LeftManageExercise