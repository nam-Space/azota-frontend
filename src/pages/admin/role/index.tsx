import Head from 'next/head'
import AdminLayout from '@/layouts/AdminLayout'
import AdminForRole from '@/components/Admin/SuperAdmin/Role'

export default function AdminForRolePage() {
    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AdminLayout>
                <AdminForRole />
            </AdminLayout>
        </>
    )
}
