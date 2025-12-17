import { callDeleteHistory } from '@/config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IHistory, } from '@/types/backend';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, message, notification } from 'antd';
import React, { useRef, useState } from 'react'
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import DataTable from '@/components/Share/Table';
import { fetchHistory } from '@/redux/slice/history';
import Access from '@/components/Share/Access';
import { ALL_PERMISSIONS } from '@/constants/permission';
import { FormattedMessage } from 'react-intl';

const AdminForHistory = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IHistory | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.history.isFetching);
    const meta = useAppSelector(state => state.history.meta);
    const histories = useAppSelector(state => state.history.result);
    const dispatch = useAppDispatch();

    const handleDeleteHistory = async (id: number | undefined) => {
        if (id) {
            const res = await callDeleteHistory(id);
            if (res && res.data) {
                message.success('Xóa history thành công');
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

    const columns: ProColumns<IHistory>[] = [
        {
            title: <FormattedMessage id='admin.admin-history.table.col.id' />,
            dataIndex: 'id',
            hideInSearch: true,
        },
        {
            title: <FormattedMessage id='admin.admin-history.table.col.user' />,
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
            title: <FormattedMessage id='admin.admin-history.table.col.score' />,
            dataIndex: 'score',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.score}</p>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-history.table.col.classroom' />,
            dataIndex: 'classroom',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.classroomExercise?.classroom?.name}</p>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-history.table.col.exercise' />,
            dataIndex: 'exercise',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.classroomExercise?.exercise?.name}</p>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-history.table.col.type' />,
            dataIndex: 'type',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.classroomExercise?.exercise?.type}</p>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-history.table.col.created-at' />,
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
            title: <FormattedMessage id='admin.admin-history.table.col.updated-at' />,
            dataIndex: 'updatedAt',
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
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
            temp += `&filter.classroomExercise.classroom.name=$ilike:${clone.classroom}`
        }
        if (clone.exercise) {
            temp += `&filter.classroomExercise.exercise.name=$ilike:${clone.exercise}`
        }
        if (clone.type) {
            temp += `&filter.classroomExercise.exercise.type=$eq:${clone.type}`
        }

        let sortBy = "";

        if (sort && sort.user) {
            sortBy = sort.user === 'ascend' ? "sort=user.name-ASC" : "sort=user.name-DESC";
        }

        if (sort && sort.score) {
            sortBy = sort.score === 'ascend' ? "sort=user.score-ASC" : "sort=user.score-DESC";
        }

        if (sort && sort.classroom) {
            sortBy = sort.classroom === 'ascend' ? "sort=classroomExercise.classroom.name-ASC" : "sort=classroomExercise.classroom.name-DESC";
        }

        if (sort && sort.exercise) {
            sortBy = sort.exercise === 'ascend' ? "sort=classroomExercise.exercise.name-ASC" : "sort=classroomExercise.exercise.name-DESC";
        }

        if (sort && sort.score) {
            sortBy = sort.score === 'ascend' ? "sort=score-ASC" : "sort=score-DESC";
        }

        if (sort && sort.duration) {
            sortBy = sort.duration === 'ascend' ? "sort=duration-ASC" : "sort=duration-DESC";
        }

        if (sort && sort.type) {
            sortBy = sort.type === 'ascend' ? "sort=classroomExercise.exercise.type-ASC" : "sort=classroomExercise.exercise.type-DESC";
        }

        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt-ASC" : "sort=createdAt-DESC";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt-ASC" : "sort=updatedAt-DESC";
        }

        temp += `&relations=user,classroomExercise.classroom,classroomExercise.exercise`

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
            <DataTable<IHistory>
                actionRef={tableRef}
                headerTitle={<FormattedMessage id='admin.admin-history.table.title' />}
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
    )
}

export default AdminForHistory