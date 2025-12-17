import { CalendarOutlined, DeleteOutlined, FileTextOutlined, FolderOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Col, Menu, Row } from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import styles from './layout.module.scss'
import { useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'

const LayoutClassroomDetail = ({ children }: any) => {
    const router = useRouter()

    const theme = useAppSelector(state => state.theme.name)
    const [activeMenu, setActiveMenu] = useState('')

    const [classroomId, setClassroomId] = useState('')

    useEffect(() => {
        if (router.pathname) {
            setActiveMenu(router.pathname)
        }
        if (router.query.classroomId) {
            setClassroomId(router.query.classroomId as string)
        }
    }, [router])

    return (
        <div>
            <Row>
                <Col span={4}>
                    <div className={styles['menu']}>
                        <Button className={styles['menu-item']} style={{ background: activeMenu === '/classroom/[classroomId]/student' ? theme : 'transparent' }} type={activeMenu === '/classroom/[classroomId]/student' ? 'primary' : 'text'} icon={<UserOutlined />} >
                            <Link onClick={() => setActiveMenu('/classroom/[classroomId]/student')} href={`/classroom/${classroomId || 0}/student`}><FormattedMessage id="classroomDetail-student.left-container.list-student" /></Link>
                        </Button>
                        <Button className={styles['menu-item']} style={{ background: activeMenu === '/classroom/[classroomId]/exercise' ? theme : 'transparent' }} type={activeMenu === '/classroom/[classroomId]/exercise' ? 'primary' : 'text'} icon={<FileTextOutlined />} >
                            <Link onClick={() => setActiveMenu('/classroom/[classroomId]/exercise')} href={`/classroom/${classroomId || 0}/exercise`}><FormattedMessage id="classroomDetail-student.left-container.homework" /></Link>
                        </Button>
                        <Button className={styles['menu-item']} style={{ background: activeMenu === '/classroom/[classroomId]/test' ? theme : 'transparent' }} type={activeMenu === '/classroom/[classroomId]/test' ? 'primary' : 'text'} icon={<FolderOutlined />} >
                            <Link onClick={() => setActiveMenu('/classroom/[classroomId]/test')} href={`/classroom/${classroomId || 0}/test`}><FormattedMessage id="classroomDetail-student.left-container.test" /></Link>
                        </Button>
                    </div>
                </Col>
                <Col span={20}>
                    {children}
                </Col>
            </Row>
        </div>
    )
}

export default LayoutClassroomDetail