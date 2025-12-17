import React, { useState } from 'react'
import styles from './header.module.scss'
import { Avatar, Button, Layout, Popover, message } from 'antd';
import { BellOutlined, LeftOutlined, LogoutOutlined, MoonOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import Image from 'next/image';

import viImg from '@/images/header/language/vi.svg'
import enImg from '@/images/header/language/en.svg'
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import { callLogout } from '@/config/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import { getUserAvatar } from '@/utils/imageUrl';
import { ADMIN } from '@/constants/role';
import { FormattedMessage } from 'react-intl';
import { VI } from '@/constants/language';

const { Header } = Layout;

const HeaderClient = () => {
    const router = useRouter()
    const { locales, locale, pathname } = router

    const dispatch = useAppDispatch()

    const [openPopoverLanguage, setOpenPopoverLanguage] = useState(false)
    const [openPopoverNotification, setOpenPopoverNotification] = useState(false)
    const [openPopoverUser, setOpenPopoverUser] = useState(false)

    const user = useAppSelector(state => state.account.user)

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            dispatch(setLogoutAction({}))
            message.success('Đăng xuất thành công');
            router.push('/login')
        }
    }

    const handleRouteBack = () => {
        router.back()
    }

    return (
        <Header className={styles['header-container']}>
            {/* <Button type='text' icon={<LeftOutlined />} ><span style={{ fontWeight: 600 }} onClick={handleRouteBack}><FormattedMessage id="header.back" /></span></Button> */}
            <div></div>
            <p style={{ fontWeight: '600' }}>
                <FormattedMessage id="header.main-menu" />
            </p>
            <div className={styles['user-config']}>
                {pathname !== '/student/classroom/[classroomId]/exercise/[exerciseId]/starting/[classroomExerciseId]' && pathname !== '/student/classroom/[classroomId]/test/[testId]/starting/[classroomExerciseId]' &&
                    <Popover
                        content={<>
                            <Link href={router.asPath} locale={(locales as string[])[0]} className={styles['lang-item']}>
                                <Image src={viImg} width={20} height={20} alt='viImg' />
                                <span><FormattedMessage id="header.language.vi" /></span>
                            </Link>
                            <Link href={router.asPath} locale={(locales as string[])[1]} className={styles['lang-item']}>
                                <Image src={enImg} width={20} height={20} alt='enImg' />
                                <span><FormattedMessage id="header.language.en" /></span>
                            </Link>
                        </>}
                        trigger="click"
                        open={openPopoverLanguage}
                        onOpenChange={(val: boolean) => setOpenPopoverLanguage(val)}
                    >
                        {locale === VI ? <Image src={viImg} width={30} height={20} alt='viImg' style={{ cursor: 'pointer' }} /> : <Image src={enImg} width={30} height={20} alt='enImg' style={{ cursor: 'pointer' }} />}
                    </Popover>
                }
                <Popover
                    placement="bottomRight"
                    content={<div style={{ width: '330px' }}>
                        <div style={{ fontWeight: 'bold' }}><FormattedMessage id="header.notifications.title" /></div>
                        <div style={{ color: 'gray', marginTop: '20px', textAlign: 'center' }}><FormattedMessage id="header.notifications.no-info" /></div>
                    </div>}
                    trigger="click"
                    open={openPopoverNotification}
                    onOpenChange={(val: boolean) => setOpenPopoverNotification(val)}
                >
                    <Button type='text' icon={<BellOutlined className={styles['bell-icon']} />} ></Button>
                </Popover>

                <Popover
                    placement="bottomRight"
                    content={<div style={{ width: '220px' }}>
                        <div style={{ fontWeight: 'bold' }}>
                            {user.role.name === ADMIN && <Button className={styles['user-button-item']} type='text' icon={<FontAwesomeIcon icon={faUserTie} className={styles['user-icon-item']} />} >
                                <Link href={`/admin`}><FormattedMessage id="header.user.pop.admin-page" /></Link>
                            </Button>}

                            <Button className={styles['user-button-item']} type='text' icon={<UserOutlined className={styles['user-icon-item']} />} >
                                <Link href={'/profile'}><FormattedMessage id="header.user.pop.account" /></Link>
                            </Button>
                            <Button className={styles['user-button-item']} type='text' icon={<MoonOutlined className={styles['user-icon-item']} />} >
                                <span>
                                    <FormattedMessage id="header.user.pop.dark-theme" />
                                </span>
                            </Button>
                            <Button className={styles['user-button-item']} type='text' icon={<ReloadOutlined className={styles['user-icon-item']} />} >
                                <a href={`${locale === VI ? '' : '/en'}${router.asPath}`}>
                                    <FormattedMessage id="header.user.pop.refresh" />
                                </a>
                            </Button>
                            <Button onClick={handleLogout} className={styles['user-button-item']} type='text' icon={<LogoutOutlined className={styles['user-icon-item']} />} >
                                <span><FormattedMessage id="header.user.pop.logout" /></span>
                            </Button>
                        </div>
                    </div>}
                    trigger="click"
                    open={openPopoverUser}
                    onOpenChange={(val: boolean) => setOpenPopoverUser(val)}
                >
                    <div className={styles['user']}>
                        <Avatar src={getUserAvatar(user.avatar)} />
                        <div className={styles['user-info']}>
                            <p className={styles['user-info-name']}>{user.name}</p>
                            <p>{user.role.name}</p>
                        </div>
                    </div>
                </Popover>
            </div>
        </Header>
    )
}

export default HeaderClient