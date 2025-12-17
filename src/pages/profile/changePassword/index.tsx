import Head from 'next/head'
import ClientLayout from '@/layouts/ClientLayout'
import LayoutProfile from '@/components/Share/Profile/Layout'
import ChangePassword from '@/components/Share/Profile/ChangePassword'

export default function ProfileChangePasswordPage() {

    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientLayout>
                <LayoutProfile>
                    <ChangePassword />
                </LayoutProfile>
            </ClientLayout>
        </>
    )
}
