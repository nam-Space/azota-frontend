import React, { useEffect, useRef, useState } from 'react'
import LayoutClassroomDetail from '../Layout'
import styles from './student.module.scss'
import DataTable from '@/components/Share/Table'
import { IClassroom, IExercise, IUser, IUserClassroom } from '@/types/backend'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { ActionType, ProColumns } from '@ant-design/pro-components'
import { CheckOutlined, CheckSquareOutlined, CopyOutlined, DeleteOutlined, EditOutlined, FileOutlined, FolderViewOutlined, LogoutOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { fetchExercise } from '@/redux/slice/exerciseSlide'
import { fetchUser } from '@/redux/slice/userSlide'
import { Avatar, Button, Popconfirm, Space, message, notification } from 'antd'
import defaultAvatar from '@/images/header/user/default-avatar.png'
import { useRouter } from 'next/router'
import { callDeleteUserClassroom, callFetchClassroomById } from '@/config/api'
import { fetchUserClassroom } from '@/redux/slice/userClassroomSlide'
import { HOMEWORK, TEST } from '@/constants/task'
import { getUserAvatar } from '@/utils/imageUrl'
import Access from '@/components/Share/Access'
import { ALL_PERMISSIONS } from '@/constants/permission'
import ModalLeaveRoom from './Modal'
import ModalEditStudent from './Modal/ModalEditStudent'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'

const StudentClassroomList = () => {
    const router = useRouter()

    const tableRef = useRef<ActionType>();
    const [classroom, setClassroom] = useState<IClassroom>({
        id: 0,
        name: '',
        userClassrooms: [],
        classroomExercises: [],
        groupId: 0,
        schoolYearId: 0,

        createdBy: 0,
        updatedBy: 0,
        deletedBy: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
    })
    const theme = useAppSelector(state => state.theme.name)
    const userClassrooms = useAppSelector(state => state.userClassroom.result)
    const meta = useAppSelector(state => state.userClassroom.meta)
    const isFetching = useAppSelector(state => state.userClassroom.isFetching);
    const [isCopyClassroomId, setIsCopyClassroomId] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IUser | null>(null);

    const dispatch = useAppDispatch()

    const handleGetUserClassrooms = (query: string) => {
        dispatch(fetchUserClassroom({ query }))
    }

    useEffect(() => {
        if (router.query.classroomId) {
            const classroomId = router.query.classroomId
            const handleGetClassroom = async () => {
                const res = await callFetchClassroomById(+classroomId)
                if (res.data) {
                    setClassroom(res.data)
                }
            }

            handleGetClassroom()
            handleGetUserClassrooms(`filter.classroomId=$eq:${classroomId}`)
        }
    }, [router])

    useEffect(() => {
        reloadTable()
    }, [JSON.stringify(userClassrooms)])

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const handleDeleteUserClassroom = async (id: number | undefined) => {
        if (id) {
            const res = await callDeleteUserClassroom(id);
            if (res && res.data) {
                message.success('Xóa học sinh khỏi lớp thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const columns: ProColumns<IUserClassroom>[] = [
        {
            title: <FormattedMessage id="classroomDetail-student.right-container.table.col.no" />,
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
            title: <FormattedMessage id="classroomDetail-student.right-container.table.col.name" />,
            dataIndex: 'name',
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Avatar src={getUserAvatar(record.user?.avatar)} />
                        <span>
                            {record.user?.name}
                        </span>
                    </div>
                )
            }
        },
        {
            title: <FormattedMessage id="classroomDetail-student.right-container.table.col.number-homework" />,
            hideInSearch: true,
            render: (text, record, index, action) => {
                let cntHomework = 0
                classroom.classroomExercises?.forEach(classroomExercise => {
                    if (classroomExercise.exercise?.type === HOMEWORK) {
                        const user = classroomExercise.histories?.find(history => history.userId === record.userId)
                        if (user) {
                            cntHomework++
                        }
                    }
                })

                return (
                    <span>
                        {cntHomework} / {classroom.classroomExercises?.filter(classroomExercise => classroomExercise.exercise?.type === HOMEWORK).length} <FormattedMessage id="classroomDetail-student.right-container.table.row.homework" />
                    </span>
                )
            }
        },
        {
            title: <FormattedMessage id="classroomDetail-student.right-container.table.col.number-test" />,
            hideInSearch: true,
            render: (text, record, index, action) => {
                let cntTest = 0
                classroom.classroomExercises?.forEach(classroomExercise => {
                    if (classroomExercise.exercise?.type === TEST) {
                        const user = classroomExercise.histories?.find(history => history.userId === record.userId)
                        if (user) {
                            cntTest++
                        }
                    }
                })

                return (
                    <span>
                        {cntTest} / {classroom.classroomExercises?.filter(classroomExercise => classroomExercise.exercise?.type === TEST).length} <FormattedMessage id="classroomDetail-student.right-container.table.row.test" />
                    </span>
                )
            }
        },
        {

            title: <FormattedMessage id="classroomDetail-student.right-container.table.col.action" />,
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <Access permission={ALL_PERMISSIONS.USER.GET_BY_ID} hideChildren>
                        <Link href={`/classroom/${classroom.id}/student/${entity.user?.id}`}>
                            <FolderViewOutlined style={{
                                fontSize: 20,
                                color: theme,
                                cursor: 'pointer',
                                paddingLeft: 6,
                                paddingRight: 6

                            }} />
                        </Link>
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.USER.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                setOpenModalEdit(true);
                                setDataInit(entity.user as IUser);
                            }}
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.USER_CLASSROOM.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={<FormattedMessage id="classroomDetail-student.right-container.table.row.delete.pop.title" />}
                            description={<FormattedMessage id="classroomDetail-student.right-container.table.row.delete.pop.description" />}
                            onConfirm={() => handleDeleteUserClassroom(entity.id)}
                            okText={<FormattedMessage id="classroomDetail-student.right-container.table.row.delete.pop.submit" />}
                            okType='danger'
                            cancelText={<FormattedMessage id="classroomDetail-student.right-container.table.row.delete.pop.cancel" />}
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 20,
                                        color: '#ff4d4f',
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),

        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        let temp = ""

        const clone = { ...params, currentPage: params.current, limit: params.pageSize };
        delete clone.current
        delete clone.pageSize

        temp += `page=${clone.currentPage}`
        temp += `&limit=${clone.limit}`
        if (clone.name) {
            temp += `&filter.user.name=$ilike:${clone.name}`
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
            temp = `${temp}&sort=updatedAt-DESC`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        temp += `&filter.classroomId=$eq:${classroom.id}`
        temp += `&relations=user,classroom`
        return temp;
    }

    const handleCopyClassroomId = (classroomToken: string) => {
        setIsCopyClassroomId(true)
        navigator.clipboard.writeText(classroomToken)
    }

    return (
        <div className={styles['right-container']}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 className={styles['heading-title']}>{classroom.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className={styles['classroom-token']}>
                            <FormattedMessage id="classroomDetail-student.right-container.classroom-id" />
                            <span style={{ marginLeft: 4, color: '#42c908', fontSize: 18 }}>{classroom.classroomToken}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Button onClick={() => handleCopyClassroomId(classroom.classroomToken as string)} icon={isCopyClassroomId ? <CheckOutlined /> : <CopyOutlined />}></Button>
                            {isCopyClassroomId && 'Đã copy'}
                        </div>
                    </div>
                </div>
                <Access permission={ALL_PERMISSIONS.USER_CLASSROOM.LEAVE_ROOM} hideChildren>
                    <Button onClick={() => setIsModalOpen(true)} style={{ background: '#DB2E2E', fontWeight: 600 }} type='primary' icon={<LogoutOutlined />}>
                        <span>
                            <FormattedMessage id="classroomDetail-student.right-container.leave-room.title" />
                        </span>
                    </Button>
                </Access>
            </div>
            <div className={styles['table-user']}>
                <DataTable<IUserClassroom>
                    actionRef={tableRef}
                    headerTitle={<FormattedMessage id="classroomDetail-student.right-container.table.title" />}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={userClassrooms}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        if (router.query.classroomId) {
                            handleGetUserClassrooms(query)
                        }
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
            <ModalLeaveRoom isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} classroom={classroom} />
            <ModalEditStudent
                openModal={openModalEdit}
                setOpenModal={setOpenModalEdit}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    )
}

export default StudentClassroomList