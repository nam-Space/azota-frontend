
import { Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './score-chart.module.scss'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { IClassroomExercise } from '@/types/backend'
import { callFetchClassroomExerciseByClassroomIdAndExerciseId } from '@/config/api'
import dynamic from 'next/dynamic'
import { FormattedMessage } from 'react-intl'

const Column = dynamic(
    (): any => import("@ant-design/plots").then((item) => item.Column),
    {
        ssr: false,
    }
)

const ScoreChart = () => {
    const router = useRouter()

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

    useEffect(() => {
        if (router.query.testId && router.query.classroomId) {
            const testId = router.query.testId
            const classroomId = router.query.classroomId

            const handleGetClassroomExercise = async () => {
                const res = await callFetchClassroomExerciseByClassroomIdAndExerciseId(+classroomId, +testId)
                if (res.data) {
                    const histories = res.data.histories?.map(history => {
                        return {
                            ...history,
                            score: Math.floor(history.score as number)
                        }
                    })
                    setClassroomExercise({
                        ...res.data,
                        histories
                    })
                }
            }

            handleGetClassroomExercise()
        }
    }, [router])

    const result = _(classroomExercise.histories)
        .groupBy('score')
        .map((value, key) => {
            return { score: key, percent: classroomExercise.histories ? value.length / classroomExercise.histories.length : 0 };
        })
        .value();

    const config: any = {
        data: result,
        xField: 'score',
        yField: 'percent',
        label: {
            text: (item: any) => `${(item.percent * 100).toFixed(2)}%`,
            textBaseline: 'bottom',
        },
        axis: {
            y: {
                labelFormatter: '.0%',
            },
        }
    };

    return (
        <Row style={{ marginTop: 30 }}>
            <Col span={24} >
                <h2><FormattedMessage id="classroomDetail-testDetail-statistic.score-spectrum-chart.title" /></h2>
                <div className={styles['statistic-item']}>
                    <Column {...config} />
                </div>

            </Col>
        </Row>
    )
}

export default ScoreChart