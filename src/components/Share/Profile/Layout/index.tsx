import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Col, Row } from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import styles from './layout.module.scss'
import { useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'

const LayoutProfile = ({ children }: any) => {
    const router = useRouter()

    const theme = useAppSelector(state => state.theme.name)
    const [activeMenu, setActiveMenu] = useState('')

    useEffect(() => {
        if (router.pathname) {
            setActiveMenu(router.pathname)
        }
    }, [router])

    return (
        <div>
            <h2 style={{ textAlign: 'left' }}><FormattedMessage id="profile.title" /></h2>
            <Row gutter={20} style={{ marginTop: 20 }}>
                <Col span={6}>
                    <div className={styles['menu']}>
                        <Button className={styles['menu-item']} style={{ background: activeMenu === '/profile' ? theme : 'transparent' }} type={activeMenu === '/profile' ? 'primary' : 'text'} icon={<UserOutlined />} >
                            <Link onClick={() => setActiveMenu('/profile')} href={`/profile`}>
                                <FormattedMessage id="profile.left-container.general" />
                            </Link>
                        </Button>
                        <Button className={styles['menu-item']} style={{ background: activeMenu === '/profile/changePassword' ? theme : 'transparent' }} type={activeMenu === '/profile/changePassword' ? 'primary' : 'text'} icon={<LockOutlined />} >
                            <Link onClick={() => setActiveMenu('/profile/changePassword')} href={`/profile/changePassword`}>
                                <FormattedMessage id="profile.left-container.change-password" />
                            </Link>
                        </Button>
                    </div>
                </Col>
                <Col span={18}>
                    {children}
                </Col>
            </Row>
        </div>
    )
}

export default LayoutProfile