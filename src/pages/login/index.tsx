import Head from 'next/head'
import Login from '@/components/Share/Login'
import { useAppDispatch } from '@/redux/hooks'
import { useEffect } from 'react'
import { fetchAccount } from '@/redux/slice/accountSlide'
import AuthLayout from '@/layouts/AuthLayout'

export default function LoginPage() {

    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AuthLayout>
                <Login />
            </AuthLayout>
        </>
    )
}
