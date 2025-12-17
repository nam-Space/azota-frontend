import ClassroomDetailExercise from '@/components/Share/Classroom/ClassroomDetail/Exercise'
import LayoutClassroomDetail from '@/components/Share/Classroom/ClassroomDetail/Layout'
import ClientLayout from '@/layouts/ClientLayout'
import Head from 'next/head'
import React from 'react'

const ClassroomDetailExercisePage = () => {
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
                    <ClassroomDetailExercise />
                </LayoutClassroomDetail>
            </ClientLayout>
        </>
    )
}

export default ClassroomDetailExercisePage