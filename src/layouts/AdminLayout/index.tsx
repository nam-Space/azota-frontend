import React, { useState, useEffect } from 'react';
import {
    LoadingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PlusSquareOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar, Button, Popover, Spin } from 'antd';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isMobile } from 'react-device-detect';
import type { MenuProps } from 'antd';
import { fetchAccount, setLogoutAction, setRefreshTokenAction } from '@/redux/slice/accountSlide';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { callLogout } from '@/config/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { getUserAvatar } from '@/utils/imageUrl';
import { ALL_PERMISSIONS } from '@/constants/permission';
import Image from 'next/image';
import viImg from '@/images/header/language/vi.svg'
import enImg from '@/images/header/language/en.svg'

import styles from './adminLayout.module.scss'
import { FormattedMessage } from 'react-intl';
import { VI } from '@/constants/language';
import Cookies from 'js-cookie';

const { Footer, Sider } = Layout;

const AdminLayout = ({ children }: any) => {
    const router = useRouter();

    const { locales, locale } = router

    const [openPopoverLanguage, setOpenPopoverLanguage] = useState(false)
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const isLoading = useAppSelector((state) => state.account.isLoading);
    const user = useAppSelector(state => state.account.user);
    const permissions = useAppSelector(state => state.account.user.permissions);

    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

    const dispatch = useAppDispatch();

    const errorRefreshToken = useAppSelector(state => state.account.errorRefreshToken);


    useEffect(() => {
        if (permissions.length) {
            const viewUser = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.USER.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.USER.GET_PAGINATE.method
            )

            const viewGroup = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.GROUP.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.GROUP.GET_PAGINATE.method
            )

            const viewSchoolYear = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.SCHOOL_YEAR.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.SCHOOL_YEAR.GET_PAGINATE.method
            )

            const viewClassroom = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.CLASSROOM.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.CLASSROOM.GET_PAGINATE.method
            )

            const viewUserClassroom = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.USER_CLASSROOM.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.USER_CLASSROOM.GET_PAGINATE.method
            )

            const viewExercise = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.EXERCISE.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.EXERCISE.GET_PAGINATE.method
            )

            const viewClassroomExercise = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.CLASSROOM_EXERCISE.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.CLASSROOM_EXERCISE.GET_PAGINATE.method
            )


            const viewSubject = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.SUBJECT.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.SUBJECT.GET_PAGINATE.method
            )

            const viewGrade = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.GRADE.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.GRADE.GET_PAGINATE.method
            )

            const viewHistory = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.HISTORY.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.HISTORY.GET_PAGINATE.method
            )

            const viewAnswerHistory = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.ANSWER_HISTORY.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.ANSWER_HISTORY.GET_PAGINATE.method
            )

            const viewQuestion = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.QUESTION.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.QUESTION.GET_PAGINATE.method
            )

            const viewAnswer = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.ANSWER.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.ANSWER.GET_PAGINATE.method
            )


            const viewRole = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.ROLE.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.ROLE.GET_PAGINATE.method
            )

            const viewPermission = permissions.find(item =>
                item.endpoint === ALL_PERMISSIONS.PERMISSION.GET_PAGINATE.endpoint
                && item.method === ALL_PERMISSIONS.PERMISSION.GET_PAGINATE.method
            )

            const full = [
                {
                    label: <Link href='/admin'>Dashboard</Link>,
                    key: '/admin',
                    icon: <PlusSquareOutlined />
                },
                ...(viewUser ? [{
                    label: <Link href='/admin/user'>User</Link>,
                    key: '/admin/user',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewGroup ? [{
                    label: <Link href='/admin/group'>Group</Link>,
                    key: '/admin/group',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewSchoolYear ? [{
                    label: <Link href='/admin/school-year'>School Year</Link>,
                    key: '/admin/school-year',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewClassroom ? [{
                    label: <Link href='/admin/classroom'>Classroom</Link>,
                    key: '/admin/classroom',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewUserClassroom ? [{
                    label: <Link href='/admin/user-classroom'>User Classroom</Link>,
                    key: '/admin/user-classroom',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewExercise ? [{
                    label: <Link href='/admin/exercise'>Exercise</Link>,
                    key: '/admin/exercise',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewClassroomExercise ? [{
                    label: <Link href='/admin/classroom-exercise'>Classroom Exercise</Link>,
                    key: '/admin/classroom-exercise',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewSubject ? [{
                    label: <Link href='/admin/subject'>Subject</Link>,
                    key: '/admin/subject',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewGrade ? [{
                    label: <Link href='/admin/grade'>Grade</Link>,
                    key: '/admin/grade',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewHistory ? [{
                    label: <Link href='/admin/history'>History</Link>,
                    key: '/admin/history',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewAnswerHistory ? [{
                    label: <Link href='/admin/answer-history'>Answer History</Link>,
                    key: '/admin/answer-history',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewQuestion ? [{
                    label: <Link href='/admin/question'>Question</Link>,
                    key: '/admin/question',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewAnswer ? [{
                    label: <Link href='/admin/answer'>Answer</Link>,
                    key: '/admin/answer',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewRole ? [{
                    label: <Link href='/admin/role'>Role</Link>,
                    key: '/admin/role',
                    icon: <PlusSquareOutlined />
                }] : []),
                ...(viewPermission ? [{
                    label: <Link href='/admin/permission'>Permission</Link>,
                    key: '/admin/permission',
                    icon: <PlusSquareOutlined />
                }] : []),
            ];
            setMenuItems(full);
        }
    }, [JSON.stringify(permissions)])
    useEffect(() => {
        setActiveMenu(router.pathname)
    }, [router])

    useEffect(() => {
        dispatch(fetchAccount())
    }, [dispatch])

    useEffect(() => {
        if (errorRefreshToken) {
            localStorage.removeItem('access_token')
            message.error(errorRefreshToken);
            dispatch(setRefreshTokenAction({ status: false, message: "" }))
            router.push('/login');
        }
    }, [errorRefreshToken]);

    if (isLoading) {
        return (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} fullscreen />
        )
    }

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res.data) {
            Cookies.remove('refresh_token');
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            router.push('/login')
        }
    }

    const itemsDropdown = [
        {
            label: <Link href={'/'}>
                <FormattedMessage id="admin.header.user.pop.homepage" />
            </Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >
                <FormattedMessage id="admin.header.user.pop.logout" />
            </label>,
            key: 'logout',
        },
    ];

    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                {!isMobile ?
                    <Sider
                        theme='light'
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}>
                        <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                            <FontAwesomeIcon icon={faUserTie} />  ADMIN
                        </div>
                        <Menu
                            selectedKeys={[activeMenu]}
                            mode="inline"
                            items={menuItems}
                            onClick={(e) => setActiveMenu(e.key)}
                        />
                    </Sider>
                    :
                    <Menu
                        selectedKeys={[activeMenu]}
                        items={menuItems}
                        onClick={(e) => setActiveMenu(e.key)}
                        mode="horizontal"
                    />
                }

                <Layout>
                    {!isMobile &&
                        <div className='admin-header' style={{ display: "flex", justifyContent: "space-between", marginRight: 20 }}>
                            <Button
                                type="text"
                                icon={collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined)}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                <Popover
                                    content={<>
                                        <Link href={router.asPath} locale={(locales as string[])[0]} className={styles['lang-item']}>
                                            <Image src={viImg} width={20} height={20} alt='viImg' />
                                            <span><FormattedMessage id="admin.header.language.vi" /></span>
                                        </Link>
                                        <Link href={router.asPath} locale={(locales as string[])[1]} className={styles['lang-item']}>
                                            <Image src={enImg} width={20} height={20} alt='enImg' />
                                            <span><FormattedMessage id="admin.header.language.en" /></span>
                                        </Link>
                                    </>}
                                    trigger="click"
                                    open={openPopoverLanguage}
                                    onOpenChange={(val: boolean) => setOpenPopoverLanguage(val)}
                                >
                                    {locale === VI ?
                                        <Image src={viImg} width={30} height={20} alt='viImg' style={{ cursor: 'pointer' }} /> :
                                        <Image src={enImg} width={30} height={20} alt='enImg' style={{ cursor: 'pointer' }} />}
                                </Popover>

                                <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                    <Space style={{ cursor: "pointer" }}>
                                        <FormattedMessage id="admin.header.welcome" /> {user?.name}
                                        <Avatar src={getUserAvatar(user.avatar)} />
                                    </Space>
                                </Dropdown>
                            </div>
                        </div>
                    }
                    <div style={{ padding: '15px' }}>
                        {children}
                    </div>
                    <Footer style={{ padding: 10, textAlign: 'center' }}>
                        Nextjs with Nest.JS &copy; Nguyễn Viết Nam - Made with <FontAwesomeIcon icon={faHeart} style={{ color: '#EC1F55' }} />
                    </Footer>
                </Layout>
            </Layout>
        </>
    );
};

export default AdminLayout;