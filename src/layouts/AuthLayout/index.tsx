import React, { useEffect } from 'react';
import HeaderAuth from './Header';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchAccount } from '@/redux/slice/accountSlide';
import { useRouter } from 'next/router';
import { VI } from '@/constants/language';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';


interface ClientLayoutProps {
    children: React.ReactNode
}

const AuthLayout = ({ children }: ClientLayoutProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch()

    const { locale } = router
    const isLoading = useAppSelector((state) => state.account.isLoading);
    const user = useAppSelector((state) => state.account.user);

    useEffect(() => {
        if (user.id) {
            if (locale === VI) {
                router.push('/');
            }
            else {
                router.push('/en');
            }
        }
    }, [user, router])

    useEffect(() => {
        dispatch(fetchAccount())
    }, [dispatch])

    if (isLoading) {
        return (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} fullscreen />
        )
    }

    return (
        <div>
            <HeaderAuth />
            {children}
        </div>
    );
};

export default AuthLayout;