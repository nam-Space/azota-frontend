import ManageExercise from '@/components/Admin/Exercise/Manage'
import StudentHistory from '@/components/Client/StudentTask/History'
import ClientLayout from '@/layouts/ClientLayout'
import Head from 'next/head'
import React from 'react'

const StudentHistoryPage = () => {
    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientLayout>
                <StudentHistory />
            </ClientLayout>
        </>
    )
}

export default StudentHistoryPage