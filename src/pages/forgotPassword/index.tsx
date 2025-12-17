import Head from 'next/head'
import { useAppDispatch } from '@/redux/hooks'
import { useEffect } from 'react'
import { fetchAccount } from '@/redux/slice/accountSlide'
import ForgotPassword from '@/components/Share/Forgot/ForgotPassword'
import AuthLayout from '@/layouts/AuthLayout'

export default function ForgotPage() {

    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AuthLayout>
                <ForgotPassword />
            </AuthLayout>
        </>
    )
}
