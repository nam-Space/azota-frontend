import Head from 'next/head'
import ClientLayout from '@/layouts/ClientLayout'
import SettingExerciseUpdate from '@/components/Admin/Exercise/Manage/Setting'

export default function SettingExerciseUpdatePage() {

    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientLayout>
                <SettingExerciseUpdate />
            </ClientLayout>
        </>
    )
}
