import { callDeleteExercise } from '@/config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IExercise } from '@/types/backend';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message, notification } from 'antd';
import React, { useRef, useState } from 'react'
import dayjs from 'dayjs';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import DataTable from '@/components/Share/Table';
import { HOMEWORK, TEST } from '@/constants/task';
import { fetchExercise } from '@/redux/slice/exerciseSlide';
import ModalAdminForTask from './Modal';
import Access from '@/components/Share/Access';
import { ALL_PERMISSIONS } from '@/constants/permission';
import { FormattedMessage } from 'react-intl';

const AdminForTask = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IExercise | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.exercise.isFetching);
    const meta = useAppSelector(state => state.exercise.meta);
    const exercises = useAppSelector(state => state.exercise.result);
    const dispatch = useAppDispatch();

    const handleDeleteTask = async (id: number | undefined) => {
        if (id) {
            const res = await callDeleteExercise(id);
            if (res && res.data) {
                if (res.data.type === HOMEWORK) {
                    message.success('Xóa homework thành công');
                }
                else if (res.data.type === TEST) {
                    message.success('Xóa test thành công');
                }

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

    const columns: ProColumns<IExercise>[] = [
        {
            title: <FormattedMessage id='admin.admin-exercise.table.col.id' />,
            dataIndex: 'id',
            hideInSearch: true,
        },
        {
            title: <FormattedMessage id='admin.admin-exercise.table.col.name' />,
            dataIndex: 'name',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.name}</p>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-exercise.table.col.type' />,
            dataIndex: 'type',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.type}</p>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-exercise.table.col.time-start' />,
            dataIndex: 'timeStart',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{dayjs(record.timeStart).format('DD-MM-YYYY HH:mm:ss')}</p>
                    </div>
                )
            },
            sorter: true,
            hideInSearch: true
        },
        {
            title: <FormattedMessage id='admin.admin-exercise.table.col.time-end' />,
            dataIndex: 'timeEnd',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{dayjs(record.timeEnd).format('DD-MM-YYYY HH:mm:ss')}</p>
                    </div>
                )
            },
            sorter: true,
            hideInSearch: true
        },
        {
            title: <FormattedMessage id='admin.admin-exercise.table.col.duration' />,
            dataIndex: 'duration',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.duration} <FormattedMessage id='admin.admin-exercise.table.row.duration.sub-title' /></p>
                    </div>
                )
            },
            sorter: true,
            hideInSearch: true
        },
        {
            title: <FormattedMessage id='admin.admin-exercise.table.col.random-reserve-question' />,
            dataIndex: 'isRandomQuestion',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.isRandomQuestion ? 'Active' : 'Unactive'}</p>
                    </div>
                )
            },
            sorter: true,
            hideInSearch: true
        },
        {
            title: <FormattedMessage id='admin.admin-exercise.table.col.random-reserve-answer' />,
            dataIndex: 'isRandomAnswer',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.isRandomAnswer ? 'Active' : 'Unactive'}</p>
                    </div>
                )
            },
            sorter: true,
            hideInSearch: true
        },
        {
            title: <FormattedMessage id='admin.admin-exercise.table.col.description' />,
            dataIndex: 'description',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.description}</p>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-exercise.table.col.grade' />,
            dataIndex: 'grade',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.grade?.name}</p>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-exercise.table.col.subject' />,
            dataIndex: 'subject',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.subject?.name}</p>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-exercise.table.col.created-at' />,
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
            title: <FormattedMessage id='admin.admin-exercise.table.col.updated-at' />,
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

            title: <FormattedMessage id='admin.admin-exercise.table.col.action' />,
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.EXERCISE.UPDATE}
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
                        permission={ALL_PERMISSIONS.EXERCISE.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={<FormattedMessage id='admin.admin-exercise.table.row.delete.pop.title' />}
                            description={<FormattedMessage id='admin.admin-exercise.table.row.delete.pop.description' />}
                            onConfirm={() => handleDeleteTask(entity.id)}
                            okText={<FormattedMessage id='admin.admin-exercise.table.row.delete.pop.submit' />}
                            cancelText={<FormattedMessage id='admin.admin-exercise.table.row.delete.pop.cancel' />}
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
        if (clone.type) {
            temp += `&filter.type=$eq:${clone.type}`
        }
        if (clone.description) {
            temp += `&filter.description=$ilike:${clone.description}`
        }
        if (clone.grade) {
            temp += `&filter.grade.name=$ilike:${clone.grade}`
        }
        if (clone.subject) {
            temp += `&filter.subject.name=$ilike:${clone.subject}`
        }

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name-ASC" : "sort=name-DESC";
        }
        if (sort && sort.subject) {
            sortBy = sort.subject === 'ascend' ? "sort=subject.name-ASC" : "sort=subject.name-DESC";
        }
        if (sort && sort.grade) {
            sortBy = sort.grade === 'ascend' ? "sort=grade.name-ASC" : "sort=grade.name-DESC";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt-ASC" : "sort=createdAt-DESC";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt-ASC" : "sort=updatedAt-DESC";
        }

        temp += `&relations=subject,grade`

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
            <DataTable<IExercise>
                actionRef={tableRef}
                headerTitle={<FormattedMessage id='admin.admin-exercise.table.title' />}
                rowKey="id"
                loading={isFetching}
                columns={columns}
                dataSource={exercises}
                request={async (params, sort, filter): Promise<any> => {
                    const query = buildQuery(params, sort, filter);
                    dispatch(fetchExercise({ query }))
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
                        <Access permission={ALL_PERMISSIONS.EXERCISE.CREATE} hideChildren>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => setOpenModal(true)}
                            >
                                <span>
                                    <FormattedMessage id='admin.admin-exercise.table.button-add' />
                                </span>
                            </Button>
                        </Access>
                    );
                }}
            />
            <ModalAdminForTask
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    )
}

export default AdminForTask