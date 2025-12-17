
import React, { useEffect, useState } from 'react'
import styles from './student-detail.module.scss'
import { Avatar, Button, Col, Empty, Row } from 'antd'
import { CalendarOutlined, DeleteOutlined, EditOutlined, FileOutlined, MailOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons'
import { useAppSelector } from '@/redux/hooks'
import { IClassroom, IUser, IUserClassroom } from '@/types/backend'
import { useRouter } from 'next/router'
import { callFetchClassroomById, callFetchUserById, callFetchUserClassroomByUserIdAndClassroomId } from '@/config/api'
import { getUserAvatar } from '@/utils/imageUrl'
import { MALE } from '@/utils/gender'
import dayjs from 'dayjs'
import ModalEditStudent from '../Modal/ModalEditStudent'
import { HOMEWORK, TEST } from '@/constants/task'
import ModalDeleteUserClassroom from '../Modal/ModalDeleteStudent'
import Link from 'next/link'
import { STUDENT } from '@/constants/role'
import Access from '@/components/Share/Access'
import { ALL_PERMISSIONS } from '@/constants/permission'
import _ from 'lodash'
import { FormattedMessage } from 'react-intl'

const StudentDetailTask = () => {
    const router = useRouter()

    const theme = useAppSelector(state => state.theme.name)
    const user = useAppSelector(state => state.account.user)

    const [student, setStudent] = useState<IUser>({
        id: 0,
        email: '',
        password: '',
        name: '',
        birthDay: new Date(),
        phone: '',
        gender: '',
        avatar: '',
        passwordToken: '',
        roleId: 0,

        createdBy: 0,
        updatedBy: 0,
        deletedBy: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
    })

    const [classroom, setClassroom] = useState<IClassroom>({
        id: 0,
        name: '',
        groupId: 0,
        schoolYearId: 0,
        classroomToken: '',

        createdBy: 0,
        updatedBy: 0,
        deletedBy: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
    })

    const [userClassroom, setUserClassroom] = useState<IUserClassroom>({
        id: 0,
        classroomId: 0,
        userId: 0,

        createdBy: 0,
        updatedBy: 0,
        deletedBy: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
    })

    const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);

    const getUser = async (studentId: string) => {
        const res = await callFetchUserById(+studentId)
        if (res.data) {
            setStudent(res.data)
        }
    }

    const getClassroom = async (classroomId: string) => {
        const res = await callFetchClassroomById(+classroomId)
        if (res.data) {
            setClassroom(res.data)
        }
    }

    const getUserClassroom = async (userId: string, classroomId: string) => {
        const res = await callFetchUserClassroomByUserIdAndClassroomId(`userId=${userId}&classroomId=${classroomId}`)
        if (res.data) {
            setUserClassroom(res.data)
        }
    }

    useEffect(() => {
        if (router.query.studentId && router.query.classroomId) {
            const studentId = router.query.studentId
            const classroomId = router.query.classroomId

            getUser(studentId as string)
            getClassroom(classroomId as string)
            getUserClassroom(studentId as string, classroomId as string)
        }

    }, [router])

    return (
        <div>
            <div className={styles['classroom-select']}>
                <h2><FormattedMessage id="classroomDetail-studentDetail.title" /> {classroom.name}</h2>
            </div>
            <div className={styles['student-manage']}>
                <Row>
                    <Col span={12}>
                        <div className={styles['student-wrapper']}>
                            <Avatar size={60} src={getUserAvatar(student?.avatar)} />
                            <div>
                                <div style={{ display: 'flex', gap: 3, fontWeight: 600 }}>
                                    {student?.name}
                                    {student?.gender === MALE ? <ManOutlined style={{ color: '#0D0DFF' }} /> : <WomanOutlined style={{ color: '#FE00A1' }} />}
                                </div>
                                <div style={{ display: 'flex', gap: 3 }}>
                                    <CalendarOutlined />
                                    {student?.birthDay ? dayjs(student?.birthDay).format('DD-MM-YYYY') : <FormattedMessage id="classroomDetail-studentDetail.profile.no-info" />}
                                </div>
                                <div style={{ display: 'flex', gap: 3 }}>
                                    <MailOutlined />
                                    {student?.email}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className={styles['action-container']}>
                            <Access permission={ALL_PERMISSIONS.USER.UPDATE} hideChildren>
                                <Button type='text' onClick={() => setOpenModalEdit(true)}>
                                    <EditOutlined
                                        style={{
                                            fontSize: 20,
                                            color: '#ffa500',
                                        }}
                                    />
                                    <span>
                                        <FormattedMessage id="classroomDetail-studentDetail.profile.edit.title" />
                                    </span>
                                </Button>
                            </Access>
                            <Access permission={ALL_PERMISSIONS.USER_CLASSROOM.DELETE} hideChildren>
                                <Button onClick={() => setOpenModalDelete(true)} type='text'>
                                    <DeleteOutlined
                                        style={{
                                            fontSize: 20,
                                            color: '#ff4d4f',
                                        }}
                                    />
                                    <span>
                                        <FormattedMessage id="classroomDetail-studentDetail.profile.delete.title" />
                                    </span>
                                </Button>
                            </Access>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row gutter={20} style={{ marginTop: '20px' }}>
                <Col span={12}>
                    <div className={styles["exercise-container"]}>
                        <h3 className={styles['exercise-item-title']}>
                            <FormattedMessage id="classroomDetail-studentDetail.list-test.title" />
                        </h3>
                        <div>
                            {!_.isEmpty(classroom.classroomExercises?.filter(classroomExercise => classroomExercise.exercise?.type === TEST)) ? classroom.classroomExercises?.map((classroomExercise, index) => {
                                const timeEndMilliseconds = (new Date(classroomExercise.exercise?.timeEnd as any).getTime())
                                return classroomExercise.exercise?.type === TEST && (
                                    <Link href={user.role.name !== STUDENT ? `/classroom/${classroom.id}/test/${classroomExercise.exercise.id}` : `/student/classroom/${classroom.id}/test/${classroomExercise.exercise.id}`} key={index} className={styles['exercise-item']}>
                                        <FileOutlined style={{ color: '#F9812E', fontSize: 34 }} />
                                        <div>
                                            <div style={{ marginBottom: 5, fontWeight: '600' }}>{classroomExercise.exercise?.name}</div>
                                            <div style={{ fontSize: 12, color: 'gray' }}>
                                                <FormattedMessage id="classroomDetail-studentDetail.list-test.created-at" /> {dayjs(classroomExercise.exercise?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                                            </div>
                                            {classroomExercise.histories?.find(history => history.userId === student.id) ?
                                                <div style={{ fontSize: 12, color: '#00AC33', fontWeight: 600 }}>
                                                    <FormattedMessage id="classroomDetail-studentDetail.list-test.status.submitted" />
                                                </div> :
                                                new Date().getTime() <= timeEndMilliseconds ?
                                                    <div style={{ fontSize: 12, fontWeight: 600, color: 'black' }}>
                                                        <FormattedMessage id="classroomDetail-studentDetail.list-test.status.waiting" />
                                                    </div> :
                                                    <div style={{ fontSize: 12, color: '#DB2E2E', fontWeight: 600 }}>
                                                        <FormattedMessage id="classroomDetail-studentDetail.list-test.status.unsubmitted" />
                                                    </div>}
                                        </div>
                                    </Link>
                                )
                            }) : <Empty style={{ paddingTop: 20, paddingBottom: 20 }} />}
                        </div>
                    </div>

                </Col>
                <Col span={12}>
                    <div className={styles["exercise-container"]}>
                        <h3 className={styles['exercise-item-title']}>
                            <FormattedMessage id="classroomDetail-studentDetail.list-homework.title" />
                        </h3>
                        <div>
                            {!_.isEmpty(classroom.classroomExercises?.filter(classroomExercise => classroomExercise.exercise?.type === HOMEWORK)) ? classroom.classroomExercises?.map((classroomExercise, index) => {
                                const timeEndMilliseconds = (new Date(classroomExercise.exercise?.timeEnd as any).getTime())
                                return classroomExercise.exercise?.type === HOMEWORK && (
                                    <Link href={user.role.name !== STUDENT ? `/classroom/${classroom.id}/exercise/${classroomExercise.exercise.id}` : `/student/classroom/${classroom.id}/exercise/${classroomExercise.exercise.id}`} key={index} className={styles['exercise-item']}>
                                        <FileOutlined style={{ color: theme, fontSize: 34 }} />
                                        <div>
                                            <div style={{ marginBottom: 5, fontWeight: '600' }}>{classroomExercise.exercise?.name}</div>
                                            <div style={{ fontSize: 12, color: 'gray' }}>
                                                <FormattedMessage id="classroomDetail-studentDetail.list-homework.created-at" /> {dayjs(classroomExercise.exercise?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                                            </div>
                                            {classroomExercise.histories?.find(history => history.userId === student.id) ?
                                                <div style={{ fontSize: 12, color: '#00AC33', fontWeight: 600 }}>
                                                    <FormattedMessage id="classroomDetail-studentDetail.list-homework.status.submitted" />
                                                </div> :
                                                new Date().getTime() <= timeEndMilliseconds ?
                                                    <div style={{ fontSize: 12, fontWeight: 600, color: 'black' }}>
                                                        <FormattedMessage id="classroomDetail-studentDetail.list-homework.status.waiting" />
                                                    </div> :
                                                    <div style={{ fontSize: 12, color: '#DB2E2E', fontWeight: 600 }}>
                                                        <FormattedMessage id="classroomDetail-studentDetail.list-homework.status.unsubmitted" />
                                                    </div>}
                                        </div>
                                    </Link>
                                )
                            }) : <Empty style={{ paddingTop: 20, paddingBottom: 20 }} />}
                        </div>
                    </div>
                </Col>
            </Row>
            <ModalEditStudent
                openModal={openModalEdit}
                setOpenModal={setOpenModalEdit}
                dataInit={student}
                reloadUser={getUser}
            />
            <ModalDeleteUserClassroom userClassroom={userClassroom} isModalOpen={openModalDelete} setIsModalOpen={setOpenModalDelete} />
        </div >
    )
}

export default StudentDetailTask