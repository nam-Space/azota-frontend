import React from 'react'
import styles from './super-admin.module.scss'
import { Card, Col, Row } from 'antd'
import dynamic from 'next/dynamic'

const Line = dynamic(
    (): any => import("@ant-design/plots").then((item) => item.Line),
    {
        ssr: false,
    }
)

const Pie = dynamic(
    (): any => import("@ant-design/plots").then((item) => item.Pie),
    {
        ssr: false,
    }
)

const Column = dynamic(
    (): any => import("@ant-design/plots").then((item) => item.Column),
    {
        ssr: false,
    }
)

const Dashboard = () => {
    const config1 = {
        data: {
            type: 'fetch',
            value: 'https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json',
        },
        xField: (d: any) => new Date(d.year),
        yField: 'value',
        sizeField: 'value',
        shapeField: 'trail',
        legend: { size: false },
        colorField: 'category',
    };

    const config2 = {
        data: [
            { type: '分类一', value: 27 },
            { type: '分类二', value: 25 },
            { type: '分类三', value: 18 },
            { type: '分类四', value: 15 },
            { type: '分类五', value: 10 },
            { type: '其他', value: 5 },
        ],
        angleField: 'value',
        colorField: 'type',
        label: {
            text: 'value',
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
    };

    const config3 = {
        data: {
            type: 'fetch',
            value: 'https://gw.alipayobjects.com/os/bmw-prod/be63e0a2-d2be-4c45-97fd-c00f752a66d4.json',
        },
        xField: '城市',
        yField: '销售额',
        scrollbar: {
            x: {
                ratio: 0.05,
            },
        },
    };

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Card title" bordered={false}>
                        Card content
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Card title" bordered={false}>
                        Card content
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Card title" bordered={false}>
                        Card content
                    </Card>
                </Col>
            </Row>
            <Row style={{ marginTop: 20 }} gutter={16}>
                <Col span={24}>
                    <div style={{ background: 'white' }}>
                        <Line {...config1 as any} />
                    </div>

                </Col>
            </Row>
            <Row style={{ marginTop: 20 }} gutter={16}>
                <Col span={8}>
                    <div style={{ background: 'white' }}>
                        <Pie {...config2 as any} />
                    </div>
                </Col>
                <Col span={16}>
                    <div style={{ background: 'white' }}>
                        <Column {...config3 as any} />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Dashboard