import { FileTextOutlined, FolderOutlined, HomeOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, MenuProps, Popover } from 'antd';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

import logoImg from '@/images/sidebar/logo-white.svg'

import styles from './sidebar.module.scss'
import { useAppSelector } from '@/redux/hooks';
import { changeTheme } from '@/redux/slice/themeSlide';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ALL_PERMISSIONS } from '@/constants/permission';
import { STUDENT } from '@/constants/role';
import { FormattedMessage } from 'react-intl';

const { Sider } = Layout;

const SidebarClient = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const theme = useAppSelector(state => state.theme.name)
    const user = useAppSelector(state => state.account.user)
    const [openPopoverTheme, setOpenPopoverTheme] = useState(false)
    const [selectedItem, setSelectedItem] = useState('')

    const permissions = useAppSelector(state => state.account.user.permissions);

    const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);

    const listTheme = ['#1E40AF', '#2F3542', '#1E3A8A', '#164E63', '#312E81']

    useEffect(() => {
        const viewExercise = user.role.name !== STUDENT

        const viewGroup = permissions.find(item =>
            item.endpoint === ALL_PERMISSIONS.GROUP.GET_PAGINATE.endpoint
            && item.method === ALL_PERMISSIONS.GROUP.GET_PAGINATE.method
        )

        const full = [
            {
                icon: HomeOutlined,
                title: <FormattedMessage id="sidebar.homepage" />,
                link: '/'
            },
            ...(viewExercise ? [{
                icon: FileTextOutlined,
                title: <FormattedMessage id="sidebar.homework" />,
                link: '/exercise'
            }] : []),
            ...(viewExercise ? [{
                icon: FolderOutlined,
                title: <FormattedMessage id="sidebar.test" />,
                link: '/test'
            }] : []),
            ...(viewGroup ? [{
                icon: TeamOutlined,
                title: <FormattedMessage id="sidebar.classroom" />,
                link: '/classroom'
            }] : [])
        ].map((item, _) => ({
            key: item.link,
            icon: React.createElement(item.icon),
            label: <Link href={item.link}>{item.title}</Link>,
        }));

        setMenuItems(full)
    }, [JSON.stringify(permissions)])

    useEffect(() => {
        setSelectedItem(router.pathname)
    }, [router])

    return (
        <Sider
            style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, background: theme }}
            collapsed={true}
        >
            <Link href={'/'} className={styles['logo']}>
                <Image src={logoImg} width={40} height={40} alt='logoImg' />
            </Link>
            <div className="demo-logo-vertical" />
            <Menu style={{ background: theme }} theme="dark" mode="inline" onSelect={(e) => setSelectedItem(e.key)} selectedKeys={[selectedItem]} items={menuItems} />
            <Popover
                placement="topLeft"
                content={<div className={styles['theme-setting-container']} >
                    <span>
                        <FormattedMessage id="sidebar.theme" />
                    </span>
                    <div className={styles['theme-color-wrapper']}>
                        {listTheme.map((item, index) => (
                            <div onClick={() => dispatch(changeTheme({ name: item }))} key={index} className={styles['theme-color-item']} style={{ background: item, boxShadow: `${item === theme ? '0px 0px 0px 3px rgba(0,0,0,0.3)' : 'none'}` }}></div>
                        ))}
                    </div>
                </div>}
                trigger="click"
                open={openPopoverTheme}
                onOpenChange={(val: boolean) => setOpenPopoverTheme(val)}
            >
                <Button className={styles['button-theme-setting']} type='text' icon={<SettingOutlined style={{ color: 'white', fontSize: '24px' }} />} ></Button>
            </Popover>
        </Sider>
    )
}

export default SidebarClient