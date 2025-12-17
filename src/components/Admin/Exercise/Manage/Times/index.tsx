import { callFetchClassroomExerciseById, callFetchUserById, callFetchUserClassroomByUserIdAndClassroomId } from '@/config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IClassroom, IClassroomExercise, IHistory, IUser, IUserClassroom } from '@/types/backend';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import styles from './times.module.scss'
import { Avatar, Button, Col, Row } from 'antd';
import { getUserAvatar } from '@/utils/imageUrl';
import { CalendarOutlined, ClockCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined, MailOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { MALE } from '@/utils/gender';
import DataTable from '@/components/Share/Table';
import { formatMinute } from '@/utils/formatDate';
import { fetchHistory } from '@/redux/slice/history';
import ModalEditStudent from '@/components/Share/Classroom/ClassroomDetail/Student/Modal/ModalEditStudent';
import ModalDeleteUserClassroom from '@/components/Share/Classroom/ClassroomDetail/Student/Modal/ModalDeleteStudent';
import Access from '@/components/Share/Access';
import { ALL_PERMISSIONS } from '@/constants/permission';
import { FormattedMessage, useIntl } from 'react-intl';

const StudentExerciseTimes = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const intl = useIntl()
    const tableRef = useRef<ActionType>();
    const histories = useAppSelector(state => state.history.result)
    const meta = useAppSelector(state => state.history.meta)
    const isFetching = useAppSelector(state => state.history.isFetching);

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

    const getClassroomExercise = async (classroomExerciseId: string) => {
        const res = await callFetchClassroomExerciseById(+classroomExerciseId)
        if (res.data) {
            setClassroomExercise(res.data)
        }
    }

    const getUserClassroom = async (userId: string, classroomId: string) => {
        const res = await callFetchUserClassroomByUserIdAndClassroomId(`userId=${userId}&classroomId=${classroomId}`)
        if (res.data) {
            setUserClassroom(res.data)
        }
    }

    useEffect(() => {
        if (router.query.studentId && router.query.classroomExerciseId) {
            const studentId = router.query.studentId
            const classroomExerciseId = router.query.classroomExerciseId
            dispatch(fetchHistory({ query: `&filter.userId=$eq:${studentId}&filter.classroomExerciseId=$eq:${classroomExerciseId}` }))

            getUser(studentId as string)
            getClassroomExercise(classroomExerciseId as string)
        }

    }, [router])

    useEffect(() => {
        if (classroomExercise.id) {
            getUserClassroom(student.id + '', classroomExercise.classroom?.id + '')
        }
    }, [classroomExercise])

    const columns: ProColumns<IHistory>[] = [
        {
            title: <FormattedMessage id='studentDetail-classroomExerciseDetail.table.col.count' />,
            dataIndex: 'stt',
            render: (text, record, index, action) => {
                return (
                    <span>
                        {index + 1}
                    </span>
                )
            },
            hideInSearch: true,
        },
        {
            title: <FormattedMessage id='studentDetail-classroomExerciseDetail.table.col.score' />,
            dataIndex: 'score',
            render: (text, record, index, action) => {

                return (
                    <span style={{ color: (record.score as number) >= 5 ? 'black' : '#FF0000', fontWeight: 600 }}>{record.score}</span>
                )
            }
        },
        {
            title: <FormattedMessage id='studentDetail-classroomExerciseDetail.table.col.correct-answer' />,
            dataIndex: 'totalCorrect',
            render: (text, record, index, action) => {

                return (
                    <span>{record.totalCorrect}</span>
                )
            }
        },
        {
            title: <FormattedMessage id='studentDetail-classroomExerciseDetail.table.col.created-at' />,
            hideInSearch: true,
            render: (text, record, index, action) => {
                return (
                    <span>
                        {dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </span>
                )
            }
        },
        {
            title: <FormattedMessage id='studentDetail-classroomExerciseDetail.table.col.duration' />,
            hideInSearch: true,
            render: (text, record, index, action) => {
                return (
                    <span>
                        {formatMinute(record?.duration as number)}
                    </span>
                )
            }
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        let temp = ""

        const clone = { ...params, currentPage: params.current, limit: params.pageSize };
        delete clone.current
        delete clone.pageSize

        temp += `page=${clone.currentPage}`
        temp += `&limit=${clone.limit}`
        if (clone.score) {
            temp += `&filter.score=$eq:${clone.score}`
        }
        if (clone.totalCorrect) {
            temp += `&filter.totalCorrect=$eq:${clone.totalCorrect}`
        }

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name-ASC" : "sort=name-DESC";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt-ASC" : "sort=createdAt-DESC";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt-ASC" : "sort=updatedAt-DESC";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt-ASC`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        if (router.query.studentId && router.query.classroomExerciseId) {
            const studentId = router.query.studentId
            const classroomExerciseId = router.query.classroomExerciseId
            temp += `&filter.userId=$eq:${studentId}&filter.classroomExerciseId=$eq:${classroomExerciseId}`
        }
        return temp;
    }

    return (
        <div>
            <div>
                <h2 className={styles['heading-title']}>{classroomExercise.exercise?.name} (<FormattedMessage id='studentDetail-classroomExerciseDetail.classroom' /> {classroomExercise.classroom?.name})</h2>
                <div>
                    <div style={{ display: 'flex', marginTop: 10, gap: 6 }}>
                        <CalendarOutlined />
                        <p><FormattedMessage id='studentDetail-classroomExerciseDetail.created-at' /> {dayjs(classroomExercise.exercise?.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                    </div>
                    <div style={{ display: 'flex', marginTop: 6, gap: 6 }}>
                        <CalendarOutlined />
                        <p><FormattedMessage id='studentDetail-classroomExerciseDetail.time-start' /> {dayjs(classroomExercise.exercise?.timeStart).format('DD-MM-YYYY HH:mm:ss')}</p>
                    </div>
                    <div style={{ display: 'flex', marginTop: 6, gap: 6 }}>
                        <ClockCircleOutlined />
                        <p><FormattedMessage id='studentDetail-classroomExerciseDetail.duration.title' /> {classroomExercise.exercise?.duration} <FormattedMessage id='studentDetail-classroomExerciseDetail.duration.sub-title' /></p>
                    </div>

                    <div style={{ display: 'flex', marginTop: 6, gap: 6 }}>
                        <CloseCircleOutlined />
                        <p><FormattedMessage id='studentDetail-classroomExerciseDetail.time-end' /> {dayjs(classroomExercise.exercise?.timeEnd).format('DD-MM-YYYY HH:mm:ss')}</p>
                    </div>
                </div>
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
                                    {student?.birthDay ? dayjs(student?.birthDay).format('DD-MM-YYYY') : <FormattedMessage id='studentDetail-classroomExerciseDetail.profile.no-info' />}
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
                                        <FormattedMessage id='studentDetail-classroomExerciseDetail.profile.edit.title' />
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
                                    <span><FormattedMessage id='studentDetail-classroomExerciseDetail.profile.delete.title' /></span>
                                </Button>
                            </Access>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className={styles['student-manage']} style={{ marginTop: 20 }}>
                <DataTable<IHistory>
                    actionRef={tableRef}
                    headerTitle={<FormattedMessage id='studentDetail-classroomExerciseDetail.table.title' />}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={histories}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchHistory({ query }))
                    }}
                    scroll={{ x: true }}
                    pagination={
                        {
                            current: meta.currentPage,
                            pageSize: meta.itemsPerPage,
                            showSizeChanger: true,
                            total: meta.totalItems,
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                        }
                    }
                    rowSelection={false}
                />
            </div>
            <ModalEditStudent
                openModal={openModalEdit}
                setOpenModal={setOpenModalEdit}
                dataInit={student}
                reloadUser={getUser}
            />
            <ModalDeleteUserClassroom userClassroom={userClassroom} isModalOpen={openModalDelete} setIsModalOpen={setOpenModalDelete} />
        </div>
    )
}

export default StudentExerciseTimes