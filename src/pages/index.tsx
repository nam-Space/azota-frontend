import Head from 'next/head'
import ClientLayout from '@/layouts/ClientLayout'
import MainLobby from '@/components/Client/MainLobby'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useEffect } from 'react'
import { fetchUser } from '@/redux/slice/userSlide'

export default function Home() {
  return (
    <>
      <Head>
        <title>Azota</title>
        <meta name="description" content="This is a quiz system" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClientLayout>
        <MainLobby />
      </ClientLayout>
    </>
  )
}
