import { Button, Checkbox, Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './basic-statistic-student.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardCheck, faUserCheck, faUserXmark } from '@fortawesome/free-solid-svg-icons'
import { PercentageOutlined, SnippetsOutlined } from '@ant-design/icons'
import { useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/router'
import { IClassroomExercise } from '@/types/backend'
import { callFetchClassroomExerciseByClassroomIdAndExerciseId } from '@/config/api'
import { FormattedMessage } from 'react-intl'

const BasicStatisticStudent = () => {
    const theme = useAppSelector(state => state.theme.name)
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

    const [scoreAvg, setScoreAvg] = useState(0)
    const [countLessThan5, setCountLessThan5] = useState(0)
    const [countGreaterOrEqual5, setCountGreaterOrEqual5] = useState(0)

    useEffect(() => {
        if (router.query.testId && router.query.classroomId) {
            const testId = router.query.testId
            const classroomId = router.query.classroomId

            const getScoreAvg = (classroomExercise: IClassroomExercise) => {
                let cnt = 0
                let sum = 0
                classroomExercise.histories?.forEach(history => {
                    cnt++
                    sum += Number(history.score);
                })
                if (cnt !== 0) {
                    setScoreAvg(sum / cnt)
                }
            }

            const getCountLessThan5 = (classroomExercise: IClassroomExercise) => {
                let cnt = 0
                classroomExercise.histories?.forEach(history => {
                    if (Number(history.score) < 5) {
                        cnt++
                    }
                })
                setCountLessThan5(classroomExercise.histories ? cnt * 100 / classroomExercise.histories.length : 0)
            }

            const getCountGreaterOrEqual5 = (classroomExercise: IClassroomExercise) => {
                let cnt = 0
                classroomExercise.histories?.forEach(history => {
                    if (Number(history.score) >= 5) {
                        cnt++
                    }
                })
                setCountGreaterOrEqual5(classroomExercise.histories ? cnt * 100 / classroomExercise.histories.length : 0)
            }

            const handleGetClassroomExercise = async () => {
                const res = await callFetchClassroomExerciseByClassroomIdAndExerciseId(+classroomId, +testId)
                if (res.data) {
                    setClassroomExercise(res.data)
                    getScoreAvg(res.data)
                    getCountLessThan5(res.data)
                    getCountGreaterOrEqual5(res.data)
                }
            }

            handleGetClassroomExercise()
        }
    }, [router])

    return (
        <Row gutter={30}>
            <Col span={16}>
                <h2><FormattedMessage id="classroomDetail-testDetail-statistic.basic-statistic.title" /></h2>
                <div className={styles['basic-left']}>
                    <div style={{ padding: 20, width: '50%', borderRight: '1px dashed #d9d9d9' }}>
                        <h2>{classroomExercise.exercise?.name}</h2>
                        <div style={{ marginTop: 12 }}>
                            <div>
                                <FontAwesomeIcon style={{ marginRight: 10 }} icon={faUserCheck} />
                                <FormattedMessage id="classroomDetail-testDetail-statistic.basic-statistic.number-register-testing" />
                            </div>
                            <div style={{ marginTop: 4 }}>{classroomExercise.histories?.length}</div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <div>
                                <FontAwesomeIcon style={{ marginRight: 10 }} icon={faUserXmark} />
                                <FormattedMessage id="classroomDetail-testDetail-statistic.basic-statistic.number-un-testing" />
                            </div>
                            <div style={{ marginTop: 4 }}>{(classroomExercise.classroom?.userClassrooms?.length as number) - (classroomExercise.histories?.length as number)}</div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                            <div>
                                <FontAwesomeIcon style={{ marginRight: 10 }} icon={faClipboardCheck} />
                                <FormattedMessage id="classroomDetail-testDetail-statistic.basic-statistic.total-submit" />
                            </div>
                            <div style={{ marginTop: 4 }}>{classroomExercise.histories?.length}</div>
                        </div>
                    </div>
                    <div style={{ padding: 20, width: '50%' }}>
                        <div>
                            <div><FormattedMessage id="classroomDetail-testDetail-statistic.basic-statistic.score-average" /></div>
                            <div style={{ marginTop: 4 }}>{scoreAvg.toFixed(2)}</div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <div><FormattedMessage id="classroomDetail-testDetail-statistic.basic-statistic.number-score-less-5" /></div>
                            <div style={{ marginTop: 4, display: 'flex', gap: 10 }}>
                                {countLessThan5.toFixed(2)}
                                <div style={{ height: 24, width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#DC2626', borderRadius: '50%' }}>
                                    <PercentageOutlined style={{ color: 'white' }} />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <div><FormattedMessage id="classroomDetail-testDetail-statistic.basic-statistic.number-score-greate-equal-5" /></div>
                            <div style={{ marginTop: 4, display: 'flex', gap: 10 }}>
                                {countGreaterOrEqual5.toFixed(2)}
                                <div style={{ height: 24, width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FACC15', borderRadius: '50%' }}>
                                    <PercentageOutlined style={{ color: 'white' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col span={8}>
                <h2><FormattedMessage id="classroomDetail-testDetail-statistic.excel-exporting.title" /></h2>
                <div className={styles['basic-right']}>
                    <div style={{ padding: '8px 0' }}>
                        <Checkbox onChange={e => console.log(e.target.checked)}><FormattedMessage id="classroomDetail-testDetail-statistic.excel-exporting.score-spectrum-statistic" /></Checkbox>
                    </div>
                    <div style={{ padding: '8px 0', borderTop: '1px solid #d9d9d9' }}>
                        <Checkbox onChange={e => console.log(e.target.checked)}><FormattedMessage id="classroomDetail-testDetail-statistic.excel-exporting.question-statistic" /></Checkbox>
                    </div>
                    <div style={{ padding: '8px 0', borderTop: '1px solid #d9d9d9' }}>
                        <Checkbox onChange={e => console.log(e.target.checked)}><FormattedMessage id="classroomDetail-testDetail-statistic.excel-exporting.score-statistic" /></Checkbox>
                    </div>
                    <div style={{ padding: '8px 0', borderTop: '1px solid #d9d9d9' }}>
                        <Button style={{ color: theme, border: `1px solid ${theme}` }} icon={<SnippetsOutlined />}><span><FormattedMessage id="classroomDetail-testDetail-statistic.excel-exporting.export" /></span></Button>
                    </div>
                </div>
            </Col>
        </Row>
    )
}

export default BasicStatisticStudent