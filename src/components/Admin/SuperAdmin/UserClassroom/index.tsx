import { callDeleteUserClassroom } from '@/config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IClassroom, IUserClassroom } from '@/types/backend';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification } from 'antd';
import React, { useRef, useState } from 'react'
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import DataTable from '@/components/Share/Table';
import { fetchUserClassroom } from '@/redux/slice/userClassroomSlide';
import ModalAdminForUserClassroom from './Modal';
import Access from '@/components/Share/Access';
import { ALL_PERMISSIONS } from '@/constants/permission';
import { FormattedMessage } from 'react-intl';

const AdminForUserClassroom = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IUserClassroom | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.userClassroom.isFetching);
    const meta = useAppSelector(state => state.userClassroom.meta);
    const userClassrooms = useAppSelector(state => state.userClassroom.result);
    const dispatch = useAppDispatch();

    const handleDeleteUserClassroom = async (id: number | undefined) => {
        if (id) {
            const res = await callDeleteUserClassroom(id);
            if (res && res.data) {
                message.success('Xóa User Classroom thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IUserClassroom>[] = [
        {
            title: <FormattedMessage id='admin.admin-user-classroom.table.col.id' />,
            dataIndex: 'id',
            hideInSearch: true,
        },
        {
            title: <FormattedMessage id='admin.admin-user-classroom.table.col.user' />,
            dataIndex: 'user',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.user?.name}</p>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-user-classroom.table.col.classroom' />,
            dataIndex: 'classroom',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.classroom?.name}</p>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-user-classroom.table.col.created-at' />,
            dataIndex: 'createdAt',
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: <FormattedMessage id='admin.admin-user-classroom.table.col.updated-at' />,
            dataIndex: 'updatedAt',
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        {

            title: <FormattedMessage id='admin.admin-user-classroom.table.col.action' />,
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.USER_CLASSROOM.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                setOpenModal(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access>

                    <Access
                        permission={ALL_PERMISSIONS.USER_CLASSROOM.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={<FormattedMessage id='admin.admin-user-classroom.table.row.delete.pop.title' />}
                            description={<FormattedMessage id='admin.admin-user-classroom.table.row.delete.pop.description' />}
                            onConfirm={() => handleDeleteUserClassroom(entity.id)}
                            okText={<FormattedMessage id='admin.admin-user-classroom.table.row.delete.pop.submit' />}
                            cancelText={<FormattedMessage id='admin.admin-user-classroom.table.row.delete.pop.cancel' />}
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

        if (clone.user) {
            temp += `&filter.user.name=$ilike:${clone.user}`
        }

        if (clone.classroom) {
            temp += `&filter.classroom.name=$ilike:${clone.classroom}`
        }

        let sortBy = "";
        if (sort && sort.user) {
            sortBy = sort.user === 'ascend' ? "sort=user.name-ASC" : "sort=user.name-DESC";
        }
        if (sort && sort.classroom) {
            sortBy = sort.classroom === 'ascend' ? "sort=classroom.name-ASC" : "sort=classroom.name-DESC";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt-ASC" : "sort=createdAt-DESC";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt-ASC" : "sort=updatedAt-DESC";
        }

        temp += `&relations=user,classroom`

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt-DESC`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }

    return (
        <div>
            <DataTable<IClassroom>
                actionRef={tableRef}
                headerTitle={<FormattedMessage id='admin.admin-user-classroom.table.title' />}
                rowKey="id"
                loading={isFetching}
                columns={columns}
                dataSource={userClassrooms}
                request={async (params, sort, filter): Promise<any> => {
                    const query = buildQuery(params, sort, filter);
                    dispatch(fetchUserClassroom({ query }))
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
                toolBarRender={(_action, _rows): any => {
                    return (
                        <Access permission={ALL_PERMISSIONS.USER_CLASSROOM.CREATE} hideChildren>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => setOpenModal(true)}
                            >
                                <span>
                                    <FormattedMessage id='admin.admin-user-classroom.table.button-add' />
                                </span>
                            </Button>
                        </Access>
                    );
                }}
            />
            <ModalAdminForUserClassroom
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    )
}

export default AdminForUserClassroom