import React, { useEffect, useRef, useState } from 'react'
import styles from './right-container.module.scss'
import DataTable from '@/components/Share/Table';
import { IClassroomExercise, IUser } from '@/types/backend';
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchUser } from '@/redux/slice/userSlide';
import { Avatar, Button } from 'antd';
import { useRouter } from 'next/router';
import { callFetchClassroomExerciseByClassroomIdAndExerciseId } from '@/config/api';
import dayjs from 'dayjs';
import { getUserAvatar } from '@/utils/imageUrl';
import { formatMinute } from '@/utils/formatDate';
import { ClockCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

const RightManageTest = () => {
    const router = useRouter()

    const tableRef = useRef<ActionType>();
    const users = useAppSelector(state => state.user.result)
    const theme = useAppSelector(state => state.theme.name)
    const isFetching = useAppSelector(state => state.user.isFetching);

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

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (router.query.testId && router.query.classroomId) {
            const testId = router.query.testId
            const classroomId = router.query.classroomId
            dispatch(fetchUser({ query: `page=1&limit=500&filter.userClassrooms.classroom.classroomExercises.exerciseId=$eq:${testId}&filter.userClassrooms.classroom.classroomExercises.classroomId=$eq:${classroomId}&relations=userClassrooms.classroom.classroomExercises,histories&sort=updatedAt-DESC` }))

            const handleGetClassroomExercise = async () => {
                const res = await callFetchClassroomExerciseByClassroomIdAndExerciseId(+classroomId, +testId)
                if (res.data) {
                    setClassroomExercise(res.data)
                }
            }

            handleGetClassroomExercise()
        }
    }, [router])

    const columns: ProColumns<IUser>[] = [
        {
            title: <FormattedMessage id="classroomDetail-testDetail.right-container.table.col.no" />,
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
            title: <FormattedMessage id="classroomDetail-testDetail.right-container.table.col.name" />,
            dataIndex: 'name',
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Avatar src={getUserAvatar(record.avatar)} />
                        <span>
                            {record.name}
                        </span>
                    </div>
                )
            }
        },
        {
            title: <FormattedMessage id="classroomDetail-testDetail.right-container.table.col.max-score" />,
            dataIndex: 'score',
            render: (text, record, index, action) => {
                const scoreMax = Math.max(...(record.histories?.filter(history => history.classroomExerciseId === classroomExercise.id).map(history => history.score) as number[]))
                const datetimeScoreMax = (record.histories?.find(history => history.classroomExerciseId === classroomExercise.id && history.score == scoreMax)?.createdAt)
                const datetimeScoreMaxMilliseconds = new Date(datetimeScoreMax as any).getTime()

                const timeEndMilliseconds = (new Date(classroomExercise.exercise?.timeEnd as any).getTime())

                return (
                    <span style={{ fontWeight: 600, color: ((!datetimeScoreMaxMilliseconds && new Date().getTime() <= timeEndMilliseconds) || (datetimeScoreMaxMilliseconds && datetimeScoreMaxMilliseconds <= timeEndMilliseconds && scoreMax >= 5)) ? 'black' : '#FF0000' }}>
                        {datetimeScoreMaxMilliseconds && datetimeScoreMaxMilliseconds <= timeEndMilliseconds
                            ? scoreMax
                            : (!datetimeScoreMaxMilliseconds && new Date().getTime() <= timeEndMilliseconds) ? <FormattedMessage id="classroomDetail-testDetail.right-container.table.row.status.waiting" /> : <FormattedMessage id="classroomDetail-testDetail.right-container.table.row.status.unsubmitted" />}

                    </span>
                )
            }
        },
        {
            title: <FormattedMessage id="classroomDetail-testDetail.right-container.table.col.created-at" />,
            hideInSearch: true,
            render: (text, record, index, action) => {
                const scoreMax = Math.max(...(record.histories?.filter(history => history.classroomExerciseId === classroomExercise.id).map(history => history.score) as number[]))
                const datetimeScoreMax = (record.histories?.find(history => history.classroomExerciseId === classroomExercise.id && history.score == scoreMax)?.createdAt)
                const datetimeScoreMaxMilliseconds = new Date(datetimeScoreMax as any).getTime()

                const timeEndMilliseconds = (new Date(classroomExercise.exercise?.timeEnd as any).getTime())

                return (
                    <span>
                        {datetimeScoreMaxMilliseconds && datetimeScoreMaxMilliseconds <= timeEndMilliseconds
                            ? dayjs(record.histories?.find(history => history.classroomExerciseId === classroomExercise.id && history.score == scoreMax)?.createdAt).format('DD-MM-YYYY HH:mm:ss')
                            : (!datetimeScoreMaxMilliseconds && new Date().getTime() <= timeEndMilliseconds) ? <FormattedMessage id="classroomDetail-testDetail.right-container.table.row.status.waiting" /> : <FormattedMessage id="classroomDetail-testDetail.right-container.table.row.status.unsubmitted" />}
                    </span>
                )
            }
        },
        {
            title: <FormattedMessage id="classroomDetail-testDetail.right-container.table.col.duration" />,
            hideInSearch: true,
            render: (text, record, index, action) => {
                const scoreMax = Math.max(...(record.histories?.filter(history => history.classroomExerciseId === classroomExercise.id).map(history => history.score) as number[]))
                const datetimeScoreMax = (record.histories?.find(history => history.classroomExerciseId === classroomExercise.id && history.score == scoreMax)?.createdAt)
                const datetimeScoreMaxMilliseconds = new Date(datetimeScoreMax as any).getTime()

                const timeEndMilliseconds = (new Date(classroomExercise.exercise?.timeEnd as any).getTime())

                const historyScoreMax = record.histories?.find(history => history.classroomExerciseId === classroomExercise.id && history.score == scoreMax)

                return (
                    <span>
                        {datetimeScoreMaxMilliseconds && datetimeScoreMaxMilliseconds <= timeEndMilliseconds
                            ? formatMinute(historyScoreMax?.duration as number)
                            : (!datetimeScoreMaxMilliseconds && new Date().getTime() <= timeEndMilliseconds) ? <FormattedMessage id="classroomDetail-testDetail.right-container.table.row.status.waiting" /> : <FormattedMessage id="classroomDetail-testDetail.right-container.table.row.status.unsubmitted" />}
                    </span>
                )
            }
        },
        {
            title: <FormattedMessage id="classroomDetail-testDetail.right-container.table.col.action" />,
            hideInSearch: true,
            render: (text, record, index, action) => {
                const scoreMax = Math.max(...(record.histories?.filter(history => history.classroomExerciseId === classroomExercise.id).map(history => history.score) as number[]))
                const datetimeScoreMax = (record.histories?.find(history => history.classroomExerciseId === classroomExercise.id && history.score == scoreMax)?.createdAt)
                const datetimeScoreMaxMilliseconds = new Date(datetimeScoreMax as any).getTime()

                const timeEndMilliseconds = (new Date(classroomExercise.exercise?.timeEnd as any).getTime())

                const historyScoreMax = record.histories?.find(history => history.classroomExerciseId === classroomExercise.id && history.score == scoreMax)

                return (
                    <span>
                        <Button style={{ background: theme }} type='primary' icon={<ClockCircleOutlined />}>
                            <Link href={`/student/${record.id}/classroomExercise/${classroomExercise.id}`}>
                                <FormattedMessage id="classroomDetail-testDetail.right-container.table.row.action.view-history" />
                            </Link>
                        </Button>
                    </span>
                )
            }
        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        let temp = ""

        params.current = 1
        params.pageSize = 500

        const clone = { ...params, currentPage: params.current, limit: params.pageSize };
        delete clone.current
        delete clone.pageSize

        temp += `page=${clone.currentPage}`
        temp += `&limit=${clone.limit}`
        if (clone.name) {
            temp += `&filter.name=$ilike:${clone.name}`
        }
        if (clone.score) {
            temp += `&filter.histories.score=$eq:${clone.score}`
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

        if (router.query.testId && router.query.classroomId) {
            const testId = router.query.testId
            const classroomId = router.query.classroomId
            temp += `&filter.userClassrooms.classroom.classroomExercises.exerciseId=$eq:${testId}&filter.userClassrooms.classroom.classroomExercises.classroomId=$eq:${classroomId}`
        }

        temp += `&relations=userClassrooms.classroom.classroomExercises,histories`
        return temp;
    }

    return (
        <div className={styles['wrapper']}>
            <h2 className={styles['heading-title']}><FormattedMessage id="classroomDetail-testDetail.right-container.classroom" /> {classroomExercise.classroom?.name}</h2>

            <div className={styles['table-user']}>
                <DataTable<IUser>
                    actionRef={tableRef}
                    headerTitle={<FormattedMessage id="classroomDetail-testDetail.right-container.table.title" />}
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={users}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchUser({ query }))
                    }}
                    scroll={{ x: true }}
                    rowSelection={false}
                />
            </div>
        </div>
    )
}

export default RightManageTest