import Head from 'next/head'
import AdminLayout from '@/layouts/AdminLayout'
import AdminForClassroom from '@/components/Admin/SuperAdmin/Classroom'
import AdminForTask from '@/components/Admin/SuperAdmin/Exercise'

export default function AdminForExercisePage() {
    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AdminLayout>
                <AdminForTask />
            </AdminLayout>
        </>
    )
}
