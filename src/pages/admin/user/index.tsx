import Head from 'next/head'
import AdminLayout from '@/layouts/AdminLayout'
import Dashboard from '@/components/Admin/SuperAdmin'
import AdminForUser from '@/components/Admin/SuperAdmin/User'

export default function AdminForUserPage() {
    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AdminLayout>
                <AdminForUser />
            </AdminLayout>
        </>
    )
}
