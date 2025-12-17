import ManageTest from '@/components/Admin/Test/Manage'
import StudentTest from '@/components/Client/StudentTask/Test'
import ClientLayout from '@/layouts/ClientLayout'
import Head from 'next/head'
import React from 'react'

const StudentTestingPage = () => {
    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientLayout>
                <StudentTest />
            </ClientLayout>
        </>
    )
}

export default StudentTestingPage