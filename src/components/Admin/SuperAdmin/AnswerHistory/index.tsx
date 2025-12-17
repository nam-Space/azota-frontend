
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { IAnswerHistory, } from '@/types/backend';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef, useState } from 'react'
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import DataTable from '@/components/Share/Table';
import { fetchAnswerHistory } from '@/redux/slice/answerHistory';
import { FormattedMessage } from 'react-intl';

const AdminForAnswerHistory = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IAnswerHistory | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.answerHistory.isFetching);
    const meta = useAppSelector(state => state.answerHistory.meta);
    const answerHistories = useAppSelector(state => state.answerHistory.result);
    const dispatch = useAppDispatch();

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IAnswerHistory>[] = [
        {
            title: <FormattedMessage id='admin.admin-answer-history.table.col.id' />,
            dataIndex: 'id',
            hideInSearch: true,
        },
        {
            title: <FormattedMessage id='admin.admin-answer-history.table.col.user' />,
            dataIndex: 'user',
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <p>{record.history?.user?.name}</p>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-answer-history.table.col.question' />,
            dataIndex: 'question',
            render: (text, record, index, action) => {
                return (
                    <div dangerouslySetInnerHTML={{
                        __html: record.question?.name as string
                    }}>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-answer-history.table.col.answer' />,
            dataIndex: 'answer',
            render: (text, record, index, action) => {
                return (
                    <div dangerouslySetInnerHTML={{
                        __html: record.answer?.name + ''
                    }}>
                    </div>
                )
            },
            sorter: true,
        },
        {
            title: <FormattedMessage id='admin.admin-answer-history.table.col.created-at' />,
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
            title: <FormattedMessage id='admin.admin-answer-history.table.col.updated-at' />,
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
            temp += `&filter.history.user.name=$ilike:${clone.user}`
        }

        if (clone.question) {
            temp += `&filter.question.name=$ilike:${clone.question}`
        }

        if (clone.answer) {
            temp += `&filter.answer.name=$ilike:${clone.answer}`
        }

        let sortBy = "";

        if (sort && sort.user) {
            sortBy = sort.user === 'ascend' ? "sort=history.user.name-ASC" : "sort=history.user.name-DESC";
        }

        if (sort && sort.question) {
            sortBy = sort.question === 'ascend' ? "sort=question.name-ASC" : "sort=question.name-DESC";
        }

        if (sort && sort.answer) {
            sortBy = sort.answer === 'ascend' ? "sort=answer-ASC" : "sort=answer-DESC";
        }

        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt-ASC" : "sort=createdAt-DESC";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt-ASC" : "sort=updatedAt-DESC";
        }

        temp += `&relations=history.user,question,answer`

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt-DESC`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        console.log(clone)

        return temp;
    }

    return (
        <div>
            <DataTable<IAnswerHistory>
                actionRef={tableRef}
                headerTitle={<FormattedMessage id='admin.admin-answer-history.table.title' />}
                rowKey="id"
                loading={isFetching}
                columns={columns}
                dataSource={answerHistories}
                request={async (params, sort, filter): Promise<any> => {
                    const query = buildQuery(params, sort, filter);
                    dispatch(fetchAnswerHistory({ query }))
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

export default AdminForAnswerHistory