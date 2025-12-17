import React, { useEffect } from 'react';
import HeaderAuth from './Header';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchAccount } from '@/redux/slice/accountSlide';
import { useRouter } from 'next/router';
import { VI } from '@/constants/language';


interface ClientLayoutProps {
    children: React.ReactNode
}

const AuthLayout = ({ children }: ClientLayoutProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch()

    const { locale } = router
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            if (locale === VI) {
                router.push('/');
            }
            else {
                router.push('/en');
            }
        }
    }, [isAuthenticated])

    useEffect(() => {
        dispatch(fetchAccount())
    }, [dispatch])

    return (
        <div>
            <HeaderAuth />
            {children}
        </div>
    );
};

export default AuthLayout;