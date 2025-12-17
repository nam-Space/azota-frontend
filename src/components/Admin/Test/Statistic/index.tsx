import React from 'react'
import styles from './statistic.module.scss'
import { Row, Col } from 'antd'
import _ from 'lodash'
import RightManageTest from '../Manage/RightContainer'
import BasicStatisticStudent from './BasicStatisticStudent'
import ScoreChart from './ScoreChart'

const StatisticTest = () => {
    return (
        <div className={styles['container']}>
            <BasicStatisticStudent />
            <ScoreChart />
            <Row style={{ marginTop: 30 }}>
                <Col span={24} >
                    <RightManageTest />
                </Col>
            </Row>
        </div>
    )
}

export default StatisticTest