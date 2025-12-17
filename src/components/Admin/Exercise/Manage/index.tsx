import React from 'react'
import styles from './manage.module.scss'
import { Col, Row } from 'antd'
import LeftManageExercise from './LeftContainer'
import RightManageExercise from './RightContainer'

const ManageExercise = () => {
    return (
        <div>
            <Row gutter={20}>
                <Col span={6}>
                    <LeftManageExercise />
                </Col>
                <Col span={18}>
                    <RightManageExercise />
                </Col>
            </Row>
        </div>
    )
}

export default ManageExercise