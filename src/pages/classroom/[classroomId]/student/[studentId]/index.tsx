import StudentDetailTask from '@/components/Share/Classroom/ClassroomDetail/Student/StudentDetail'
import ClientLayout from '@/layouts/ClientLayout'
import Head from 'next/head'
import React from 'react'

const DetailStudentTaskPage = () => {
    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientLayout>
                <StudentDetailTask />
            </ClientLayout>
        </>
    )
}

export default DetailStudentTaskPage