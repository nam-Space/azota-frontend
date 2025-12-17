import Head from 'next/head'
import ClientLayout from '@/layouts/ClientLayout'
import Exercise from '@/components/Admin/Exercise'

export default function ExercisePage() {

    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientLayout>
                <Exercise />
            </ClientLayout>
        </>
    )
}
