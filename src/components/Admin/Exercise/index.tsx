import { ProForm } from '@ant-design/pro-components'
import { Button, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './exercise.module.scss'
import { FileTextOutlined, PlusOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Link from 'next/link'
import { fetchExercise } from '@/redux/slice/exerciseSlide'
import dayjs from 'dayjs'
import { fetchClassroom } from '@/redux/slice/classroomSlide'
import { IClassroom, IClassroomExercise } from '@/types/backend'
import { HOMEWORK } from '@/constants/task'
import ModalCreateOption from '../Modal'
import { STUDENT, TEACHER } from '@/constants/role'
import { fetchClassroomExercise } from '@/redux/slice/classroomExerciseSlide'
import { FormattedMessage } from 'react-intl'

const Exercise = () => {
    const theme = useAppSelector(state => state.theme.name)

    const user = useAppSelector(state => state.account.user)
    const classroomExercises = useAppSelector(state => state.classroomExercise.result)
    const classrooms = useAppSelector(state => state.classroom.result)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [keyword, setKeyword] = useState('')

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (user.role.name && user.id) {
            const roleName = user.role.name
            if (roleName !== STUDENT) {
                if (keyword) {
                    dispatch(fetchClassroomExercise({ query: `filter.createdBy=${user.id}&filter.classroom.createdBy=${user.id}&&filter.exercise.createdBy=${user.id}&filter.exercise.type=${HOMEWORK}&filter.classroom.name=$ilike:${keyword}&relations=classroom,exercise` }))
                    dispatch(fetchClassroom({ query: `filter.classroomExercises.exercise.type=${HOMEWORK}&filter.createdBy=${user.id}&filter.name=$ilike:${keyword}&relations=classroomExercises.exercise` }))
                }
                else {
                    dispatch(fetchClassroomExercise({ query: `filter.createdBy=${user.id}&filter.classroom.createdBy=${user.id}&&filter.exercise.createdBy=${user.id}&filter.exercise.type=${HOMEWORK}&relations=classroom,exercise` }))
                    dispatch(fetchClassroom({ query: `filter.classroomExercises.exercise.type=${HOMEWORK}&filter.createdBy=${user.id}&relations=classroomExercises.exercise` }))
                }
            }
        }

    }, [JSON.stringify(user), keyword])

    return (
        <div>
            <div className={styles['search-create']}>
                <ProForm
                    submitter={
                        {
                            render: () => <></>
                        }
                    }
                >
                    <div className={styles['search-item']}>
                        <ProForm.Item name="name" style={{ marginBottom: 0 }}>
                            <FormattedMessage id="homework.search.placeholder">
                                {(placeholder) => <Input placeholder={placeholder as any} value={keyword} onChange={(e) => setKeyword(e.target.value)} />}
                            </FormattedMessage>

                        </ProForm.Item >
                        <Button style={{ background: theme }} type='primary'><FormattedMessage id="homework.search.search" /></Button>
                    </div>
                </ProForm>
                <Button type='primary' onClick={() => setIsModalOpen(true)} className={styles['button-create']}><PlusOutlined /> <FormattedMessage id="homework.create.title" /></Button>
            </div>
            <div className={styles['exercise-container']}>
                <h2 style={{ textAlign: 'left' }}><FormattedMessage id="homework.recommend" /></h2>
                <div className={styles['exercise-wrapper']}>
                    {classroomExercises.map((classroomExercise, index) => (
                        <Link href={`/classroom/${classroomExercise.classroom?.id}/exercise/${classroomExercise.exercise?.id}`} key={index} className={styles['exercise-item']}>
                            <FileTextOutlined style={{ color: theme, fontSize: 34 }} />
                            <div>
                                <div style={{ marginBottom: 5, fontWeight: '600' }}>{classroomExercise.exercise?.name}</div>
                                <div style={{ fontSize: 12, color: 'gray' }}><FormattedMessage id="homework.createdAt" /> {dayjs(classroomExercise.exercise?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</div>
                                <div style={{ fontSize: 12, color: 'gray' }}> <FormattedMessage id="homework.duration" /> {classroomExercise.exercise?.duration} <FormattedMessage id="homework.minute" /></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className={styles['exercise-container']}>
                <h2 style={{ textAlign: 'left' }}><FormattedMessage id="homework.all" /></h2>
                <div className={styles['exercise-wrapper']}>
                    {classrooms.length > 0 && classrooms.map((classroom: IClassroom, indexClassroom) => (
                        (classroom.classroomExercises as IClassroomExercise[])?.length > 0 && (
                            <div key={indexClassroom} className={styles['exercise-classroom-item']}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #EDF1F6' }}>
                                    <p style={{ fontWeight: 600 }}>{classroom.name}</p>
                                    <Link href={`/classroom/${classroom.id}/exercise`}><FormattedMessage id="homework.view-all" /></Link>
                                </div>
                                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {classroom.classroomExercises?.map((classroomExercises, indexClassroomExercise) => (
                                        <Link href={`/classroom/${classroom.id}/exercise/${classroomExercises.exerciseId}`} key={indexClassroomExercise} className={styles['exercise-classroom-sub-item']}>
                                            <FileTextOutlined style={{ color: theme, fontSize: 34 }} />
                                            <div>
                                                <div style={{ marginBottom: 5, fontWeight: '600' }}>{classroomExercises.exercise?.name}</div>
                                                <div style={{ fontSize: 12, color: 'gray' }}><FormattedMessage id="homework.createdAt" /> {dayjs(classroomExercises.exercise?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</div>
                                                <div style={{ fontSize: 12, color: 'gray' }}> <FormattedMessage id="homework.duration" /> {classroomExercises.exercise?.duration} <FormattedMessage id="homework.minute" /> </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
            <ModalCreateOption task={HOMEWORK} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div >
    )
}

export default Exercise