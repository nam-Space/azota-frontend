import { callDeleteUser } from '@/config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IUser } from '@/types/backend';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Avatar, Button, Popconfirm, Space, message, notification } from 'antd';
import React, { useEffect, useRef, useState } from 'react'
import defaultAvatar from '@/images/header/user/default-avatar.png'
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import DataTable from '@/components/Share/Table';
import { fetchUser } from '@/redux/slice/userSlide';
import ModalAdminForUser from './Modal';
import { getUserAvatar } from '@/utils/imageUrl';
import Access from '@/components/Share/Access';
import { ALL_PERMISSIONS } from '@/constants/permission';
import { FormattedMessage } from 'react-intl';

const AdminForUser = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IUser | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.user.isFetching);
    const meta = useAppSelector(state => state.user.meta);
    const users = useAppSelector(state => state.user.result);
    const dispatch = useAppDispatch();

    const handleDeleteUser = async (id: number | undefined) => {
        if (id) {
            const res = await callDeleteUser(id);
            if (res && res.data) {
                message.success('Xóa User thành công');
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

    const columns: ProColumns<IUser>[] = [
        {
            title: <FormattedMessage id='admin.admin-user.table.col.id' />,
            dataIndex: 'id',
            hideInSearch: true,
        },
        {
            title: <FormattedMessage id='admin.admin-user.table.col.name' />,
            dataIndex: 'name',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar src={getUserAvatar(record.avatar)} />
                        <p>{record.name}</p>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-user.table.col.email' />,
            dataIndex: 'email',
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-user.table.col.gender' />,
            dataIndex: 'gender',
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-user.table.col.phone' />,
            dataIndex: 'phone',
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-user.table.col.birthday' />,
            dataIndex: 'birthDay',
            render: (text, record, index, action) => {
                return (
                    <>{record.birthDay ? dayjs(record.birthDay).format('DD-MM-YYYY') : '-'}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: <FormattedMessage id='admin.admin-user.table.col.role' />,
            dataIndex: 'role',
            render: (text, record, index, action) => {
                return (
                    <>{record.role?.name}</>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-user.table.col.created-at' />,
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
            title: <FormattedMessage id='admin.admin-user.table.col.updated-at' />,
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

            title: <FormattedMessage id='admin.admin-user.table.col.action' />,
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
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
                                setOpenModal(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access>

                    <Access
                        permission={ALL_PERMISSIONS.USER.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={<FormattedMessage id='admin.admin-user.table.row.delete.pop.title' />}
                            description={<FormattedMessage id='admin.admin-user.table.row.delete.pop.description' />}
                            onConfirm={() => handleDeleteUser(entity.id)}
                            okText={<FormattedMessage id='admin.admin-user.table.row.delete.pop.submit' />}
                            cancelText={<FormattedMessage id='admin.admin-user.table.row.delete.pop.cancel' />}
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
            temp += `&filter.name=$ilike:${clone.name}`
        }
        if (clone.email) {
            temp += `&filter.email=$ilike:${clone.email}`
        }
        if (clone.gender) {
            temp += `&filter.gender=$eq:${clone.gender}`
        }
        if (clone.phone) {
            temp += `&filter.phone=$ilike:${clone.phone}`
        }
        if (clone.role) {
            temp += `&filter.role.name=$eq:${clone.role}`
        }

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name-ASC" : "sort=name-DESC";
        }
        if (sort && sort.email) {
            sortBy = sort.email === 'ascend' ? "sort=email-ASC" : "sort=email-DESC";
        }
        if (sort && sort.gender) {
            sortBy = sort.gender === 'ascend' ? "sort=gender-ASC" : "sort=gender-DESC";
        }
        if (sort && sort.phone) {
            sortBy = sort.phone === 'ascend' ? "sort=phone-ASC" : "sort=phone-DESC";
        }
        if (sort && sort.role) {
            sortBy = sort.role === 'ascend' ? "sort=role.name-ASC" : "sort=role.name-DESC";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt-ASC" : "sort=createdAt-DESC";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt-ASC" : "sort=updatedAt-DESC";
        }

        temp += `&relations=role`

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
            <DataTable<IUser>
                actionRef={tableRef}
                headerTitle={<FormattedMessage id='admin.admin-user.table.title' />}
                rowKey="id"
                loading={isFetching}
                columns={columns}
                dataSource={users}
                request={async (params, sort, filter): Promise<any> => {
                    const query = buildQuery(params, sort, filter);
                    dispatch(fetchUser({ query }))
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
                        <Access permission={ALL_PERMISSIONS.USER.CREATE} hideChildren>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => setOpenModal(true)}
                            >
                                <span>
                                    <FormattedMessage id='admin.admin-user.table.button-add' />
                                </span>
                            </Button>
                        </Access>
                    );
                }}
            />
            <ModalAdminForUser
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    )
}

export default AdminForUser