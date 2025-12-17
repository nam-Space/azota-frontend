import React, { useEffect } from 'react';
import { Layout, Menu, message, theme } from 'antd';

import styles from './clientLayout.module.scss'
import HeaderClient from '@/components/Client/Header';
import SidebarClient from '@/components/Client/Sidebar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchAccount, setRefreshTokenAction } from '@/redux/slice/accountSlide';
import { useRouter } from 'next/router';

const { Content, Footer } = Layout;

interface ClientLayoutProps {
    children: React.ReactNode
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const dispatch = useAppDispatch()
    const router = useRouter()

    const isRefreshToken = useAppSelector(state => state.account.isRefreshToken);
    const errorRefreshToken = useAppSelector(state => state.account.errorRefreshToken);

    useEffect(() => {
        dispatch(fetchAccount())
    }, [dispatch])

    useEffect(() => {
        if (isRefreshToken) {
            localStorage.removeItem('access_token')
            message.error(errorRefreshToken);
            dispatch(setRefreshTokenAction({ status: false, message: "" }))
            router.push('/login');
        }
    }, [isRefreshToken]);

    return (
        <Layout hasSider >
            <SidebarClient />
            <Layout className={styles['sub-layout']}>
                <HeaderClient />
                <Content style={{ margin: '20px 16px', overflow: 'initial' }}>
                    <div
                        style={{
                            padding: 24,
                            textAlign: 'center',
                            background: '#F1F5F9',
                            borderRadius: borderRadiusLG,
                            minHeight: '100%',
                            height: '100%'
                        }}
                    >
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout >
    );
};

export default ClientLayout;