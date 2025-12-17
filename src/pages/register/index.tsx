
import Register from '@/components/Share/Login/Register';
import AuthLayout from '@/layouts/AuthLayout';
import Head from 'next/head';

const RegisterPage = () => {

    return (
        <>
            <Head>
                <title>Azota</title>
                <meta name="description" content="This is a quiz system" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <AuthLayout>
                <Register />
            </AuthLayout>
        </>
    )
}

export default RegisterPage;