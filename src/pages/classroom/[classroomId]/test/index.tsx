import LayoutClassroomDetail from '@/components/Share/Classroom/ClassroomDetail/Layout'
import ClassroomDetailTest from '@/components/Share/Classroom/ClassroomDetail/Test'
import ClientLayout from '@/layouts/ClientLayout'
import Head from 'next/head'
import React from 'react'

const ClassroomDetailTestPage = () => {
    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientLayout>
                <LayoutClassroomDetail>
                    <ClassroomDetailTest />
                </LayoutClassroomDetail>
            </ClientLayout>
        </>
    )
}

export default ClassroomDetailTestPage