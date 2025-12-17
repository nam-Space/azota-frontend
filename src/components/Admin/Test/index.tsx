
import { Button, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './test.module.scss'
import { FileOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Link from 'next/link'
import dayjs from 'dayjs'
import { fetchExercise } from '@/redux/slice/exerciseSlide'
import { IClassroom, IClassroomExercise } from '@/types/backend'
import { TEST } from '@/constants/task'
import ModalCreateOption from '../Modal'
import { fetchClassroom } from '@/redux/slice/classroomSlide'
import { fetchClassroomExercise } from '@/redux/slice/classroomExerciseSlide'
import { ProForm } from '@ant-design/pro-components'
import { STUDENT } from '@/constants/role'
import { FormattedMessage } from 'react-intl'

const Test = () => {
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
                    dispatch(fetchClassroomExercise({ query: `filter.createdBy=${user.id}&filter.classroom.createdBy=${user.id}&&filter.exercise.createdBy=${user.id}&filter.exercise.type=${TEST}&filter.classroom.name=$ilike:${keyword}&relations=classroom,exercise` }))
                    dispatch(fetchClassroom({ query: `filter.classroomExercises.exercise.type=${TEST}&filter.createdBy=${user.id}&filter.name=$ilike:${keyword}&relations=classroomExercises.exercise` }))
                }
                else {
                    dispatch(fetchClassroomExercise({ query: `filter.createdBy=${user.id}&filter.classroom.createdBy=${user.id}&&filter.exercise.createdBy=${user.id}&filter.exercise.type=${TEST}&relations=classroom,exercise` }))
                    dispatch(fetchClassroom({ query: `filter.classroomExercises.exercise.type=${TEST}&filter.createdBy=${user.id}&relations=classroomExercises.exercise` }))
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
                            <FormattedMessage id="test.search.placeholder">
                                {(placeholder) => <Input placeholder={placeholder as any} value={keyword} onChange={(e) => setKeyword(e.target.value)} />}
                            </FormattedMessage>

                        </ProForm.Item >
                        <Button style={{ background: theme }} type='primary'><FormattedMessage id="test.search.search" /></Button>
                    </div>
                </ProForm>
                <Button type='primary' className={styles['button-create']} onClick={() => setIsModalOpen(true)}><PlusOutlined /> <FormattedMessage id="test.create.title" /></Button>
            </div>
            <div className={styles['exercise-container']}>
                <h2 style={{ textAlign: 'left' }}><FormattedMessage id="test.recommend" /></h2>
                <div className={styles['exercise-wrapper']}>
                    {classroomExercises.map((classroomExercise, index) => (
                        <Link href={`/classroom/${classroomExercise.classroom?.id}/test/${classroomExercise.exercise?.id}`} key={index} className={styles['exercise-item']}>
                            <FileTextOutlined style={{ color: '#F9812E', fontSize: 34 }} />
                            <div>
                                <div style={{ marginBottom: 5, fontWeight: '600' }}>{classroomExercise.exercise?.name}</div>
                                <div style={{ fontSize: 12, color: 'gray' }}><FormattedMessage id="test.createdAt" /> {dayjs(classroomExercise.exercise?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</div>
                                <div style={{ fontSize: 12, color: 'gray' }}> <FormattedMessage id="test.duration" /> {classroomExercise.exercise?.duration} <FormattedMessage id="test.minute" /></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className={styles['exercise-container']}>
                <h2 style={{ textAlign: 'left' }}><FormattedMessage id="test.all" /></h2>
                <div className={styles['exercise-wrapper']}>
                    {classrooms.length > 0 && classrooms.map((classroom: IClassroom, indexClassroom) => (
                        (classroom.classroomExercises as IClassroomExercise[])?.length > 0 && (
                            <div key={indexClassroom} className={styles['exercise-classroom-item']}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: '1px solid #EDF1F6' }}>
                                    <p style={{ fontWeight: 600 }}>{classroom.name}</p>
                                    <Link href={`/classroom/${classroom.id}/test`}><FormattedMessage id="test.view-all" /></Link>
                                </div>
                                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {classroom.classroomExercises?.map((classroomExercises, indexClassroomExercise) => (
                                        <Link href={`/classroom/${classroom.id}/test/${classroomExercises.exerciseId}`} key={indexClassroomExercise} className={styles['exercise-classroom-sub-item']}>
                                            <FileTextOutlined style={{ color: '#F9812E', fontSize: 34 }} />
                                            <div>
                                                <div style={{ marginBottom: 5, fontWeight: '600' }}>{classroomExercises.exercise?.name}</div>
                                                <div style={{ fontSize: 12, color: 'gray' }}><FormattedMessage id="test.createdAt" /> {dayjs(classroomExercises.exercise?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</div>
                                                <div style={{ fontSize: 12, color: 'gray' }}> <FormattedMessage id="test.duration" /> {classroomExercises.exercise?.duration} <FormattedMessage id="test.minute" /> </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
            <ModalCreateOption task={TEST} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div >
    )
}

export default Test