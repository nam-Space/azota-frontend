import React from 'react'
import LeftManageTest from './LeftContainer'
import RightManageTest from './RightContainer'
import styles from './manage.module.scss'
import { Col, Row } from 'antd'

const ManageTest = () => {
    return (
        <div>
            <Row gutter={20}>
                <Col span={6}>
                    <LeftManageTest />
                </Col>
                <Col span={18}>
                    <RightManageTest />
                </Col>
            </Row>
        </div>
    )
}

export default ManageTest