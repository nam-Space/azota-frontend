import React, { useState } from 'react'
import styles from './mainLobby.module.scss'
import { DeleteOutlined, FacebookOutlined, FileTextOutlined, FolderOutlined, InfoCircleOutlined, LogoutOutlined, MoonOutlined, QuestionCircleOutlined, ReloadOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Popover } from 'antd'
import { useAppSelector } from '@/redux/hooks'
import Link from 'next/link'
import Access from '@/components/Share/Access'
import { ALL_PERMISSIONS } from '@/constants/permission'
import { STUDENT } from '@/constants/role'
import { FormattedMessage } from 'react-intl'

const MainLobby = () => {
    const [openPopoverInfo, setOpenPopoverInfo] = useState(false)
    const [openPopoverTrash, setOpenPopoverTrash] = useState(false)
    const user = useAppSelector(state => state.account.user)

    const theme = useAppSelector(state => state.theme.name)

    return (
        <div className={styles['container']}>
            <div>
                <div className={styles['wrapper']}>
                    {user.role.name !== STUDENT &&
                        <Link href={'/exercise'} className={styles['page-item']}>
                            <FileTextOutlined style={{ color: theme }} className={styles['icon-item']} />
                            <p><FormattedMessage id="homepage.homework" /></p>
                        </Link>
                    }

                    {user.role.name !== STUDENT && <Link href={'/test'} className={styles['page-item']}>
                        <FolderOutlined style={{ color: theme }} className={styles['icon-item']} />
                        <p><FormattedMessage id="homepage.test" /></p>
                    </Link>}
                    <Access permission={ALL_PERMISSIONS.GROUP.GET_PAGINATE} hideChildren>
                        <Link href={'/classroom'} className={styles['page-item']}>
                            <TeamOutlined style={{ color: theme }} className={styles['icon-item']} />
                            <p><FormattedMessage id="homepage.classroom" /></p>
                        </Link>
                    </Access>
                </div>
            </div>
            <div className={styles['extension']}>
                <Popover
                    placement="topLeft"
                    content={<div style={{ width: '300px' }}>
                        <div style={{ fontWeight: 'bold' }}>
                            <Button className={styles['extension-sub-button-item']} type='text' icon={<TeamOutlined className={styles['extension-sub-icon-item']} />} >Tài khoản</Button>
                            <Button className={styles['extension-sub-button-item']} type='text' icon={<FacebookOutlined className={styles['extension-sub-icon-item']} />} >Chế độ tối</Button>
                            <Button className={styles['extension-sub-button-item']} type='text' icon={<ReloadOutlined className={styles['extension-sub-icon-item']} />} >Phiên bản: 2024-03-01 10:24:02</Button>
                        </div>
                    </div>}
                    trigger="click"
                    open={openPopoverInfo}
                    onOpenChange={(val: boolean) => setOpenPopoverInfo(val)}
                >
                    <Button type='text' icon={<InfoCircleOutlined style={{ color: theme }} className={styles['extension-icon-item']} />} ></Button>
                </Popover>
                <Button type='text' icon={<DeleteOutlined style={{ color: theme }} className={styles['extension-icon-item']} />} ></Button>
                <Button type='text' icon={<QuestionCircleOutlined style={{ color: theme }} className={styles['extension-icon-item']} />} ></Button>
            </div>
        </div>
    )
}

export default MainLobby