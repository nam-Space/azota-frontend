import Head from 'next/head'
import ClientLayout from '@/layouts/ClientLayout'
import MainLobby from '@/components/Client/MainLobby'
import Classroom from '@/components/Share/Classroom'

export default function ClassroomPage() {

    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientLayout>
                <Classroom />
            </ClientLayout>
        </>
    )
}
