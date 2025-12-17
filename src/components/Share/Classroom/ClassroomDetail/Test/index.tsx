import React, { useEffect, useState } from 'react'
import styles from './test.module.scss'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchExercise } from '@/redux/slice/exerciseSlide'
import { STUDENT, TEACHER } from '@/constants/role'
import { TEST } from '@/constants/task'
import { formatDate } from '@/utils/formatDate'
import _ from 'lodash'
import { FileTextOutlined, PlusOutlined } from '@ant-design/icons'
import { ProForm } from '@ant-design/pro-components'
import { Button, Collapse, Input } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Access from '@/components/Share/Access'
import { ALL_PERMISSIONS } from '@/constants/permission'
import ModalCreateOption from '@/components/Admin/Modal'
import { FormattedMessage, useIntl } from 'react-intl'

const ClassroomDetailTest = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const intl = useIntl()

    const { locale } = router
    const user = useAppSelector(state => state.account.user)
    const exercises = useAppSelector(state => state.exercise.result)
    const [classroomId, setClassroomId] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (router.query.classroomId) {
            const classroomIdParam = router.query.classroomId
            setClassroomId(+classroomIdParam)

            if (user.role.name) {
                if (user.role.name !== STUDENT) {
                    dispatch(fetchExercise({ query: `filter.createdBy=$eq:${user.id}&filter.type=$eq:${TEST}&filter.classroomExercises.classroomId=$eq:${classroomIdParam}&relations=classroomExercises` }))
                }
                else {
                    dispatch(fetchExercise({ query: `filter.type=$eq:${TEST}&filter.classroomExercises.classroomId=$eq:${classroomIdParam}&relations=classroomExercises` }))
                }
            }
        }
    }, [JSON.stringify(user), router])

    const groupByDate = (data: any) => {
        return _(data)
            .groupBy(x => x.createdAt.substring(0, 10))
            .map((value, key) => {
                return { date: key, exercises: value };
            })
            .value();
    }

    const items = groupByDate(exercises).map(item => {
        return {
            key: item.date,
            label: <p style={{ fontWeight: 600 }}>{formatDate(item.date, locale)}</p>,
            children: (
                <div className={styles['exercise-wrapper']}>
                    {item.exercises.map((exercise, index) => (
                        <Link href={user.role.name !== STUDENT ? `/classroom/${classroomId}/test/${exercise.id}` : `/student/classroom/${classroomId}/test/${exercise.id}`} key={index} className={styles['exercise-item']}>
                            <FileTextOutlined style={{ color: '#F9812E', fontSize: 34 }} />
                            <div>
                                <div style={{ marginBottom: 5, fontWeight: '600' }}>{exercise.name}</div>
                                <div style={{ fontSize: 12, color: 'gray' }}>
                                    <FormattedMessage id="classroomDetail-test.right-container.list-test.duration" /> {exercise.duration} <FormattedMessage id="classroomDetail-test.right-container.list-test.sub-duration" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )
        }
    })

    const onChange = (key: string | string[]) => {
        console.log(key);
    };

    return (
        <div className={styles['wrapper']}>
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
                            <Input placeholder={intl.messages['classroomDetail-test.right-container.search.placeholder'] as string} />
                        </ProForm.Item >
                        <Button type='primary' >
                            <FormattedMessage id="classroomDetail-test.right-container.search.search" />
                        </Button>
                    </div>
                </ProForm>
                <Access permission={ALL_PERMISSIONS.EXERCISE.CREATE} hideChildren>
                    <Button onClick={() => setIsModalOpen(true)} type='primary' className={styles['button-create']}>
                        <PlusOutlined /> <FormattedMessage id="classroomDetail-test.right-container.create.title" />
                    </Button>
                </Access>
            </div>
            <div className={styles['task']}>
                <h2>
                    <FormattedMessage id="classroomDetail-test.right-container.title" />
                </h2>
                <div className={styles['date-group']}>
                    <Collapse ghost bordered={false} items={items} defaultActiveKey={['1']} onChange={onChange} />
                </div>
            </div>
            <ModalCreateOption task={TEST} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </div>
    )
}

export default ClassroomDetailTest