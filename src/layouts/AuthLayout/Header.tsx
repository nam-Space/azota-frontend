import React, { useState } from 'react';
import { Button, Popover } from 'antd';

import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';
import { VI } from '@/constants/language';
import { MoonOutlined } from '@ant-design/icons';
import logoImg from '@/images/login/logo.svg'
import viImg from '@/images/header/language/vi.svg'
import enImg from '@/images/header/language/en.svg'

const HeaderAuth = () => {
    const router = useRouter()
    const { locales, locale } = router

    const [openPopoverLanguage, setOpenPopoverLanguage] = useState(false)

    return (
        <div style={{ height: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5, position: 'fixed', top: 0, left: 0, right: 0, padding: '8px 12px' }}>
            <Link href={'/login'}>
                <Image src={logoImg} width={95} height={30} alt='logoImg' />
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Popover
                    content={<>
                        <Link href={router.asPath} locale={(locales as string[])[0]} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 8 }}>
                            <Image src={viImg} width={20} height={20} alt='viImg' />
                            <span><FormattedMessage id="header.language.vi" /></span>
                        </Link>
                        <Link href={router.asPath} locale={(locales as string[])[1]} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 8 }}>
                            <Image src={enImg} width={20} height={20} alt='enImg' />
                            <span><FormattedMessage id="header.language.en" /></span>
                        </Link>
                    </>}
                    trigger="click"
                    open={openPopoverLanguage}
                    onOpenChange={(val: boolean) => setOpenPopoverLanguage(val)}
                >
                    {locale === VI ? <Image src={viImg} width={30} height={20} alt='viImg' style={{ cursor: 'pointer' }} /> : <Image src={enImg} width={30} height={20} alt='enImg' style={{ cursor: 'pointer' }} />}
                </Popover>
                <Button style={{ width: '100%', textAlign: 'left' }} type='text' icon={<MoonOutlined style={{ fontSize: 18 }} />} >
                    <span>
                        <FormattedMessage id="header.user.pop.dark-theme" />
                    </span>
                </Button>
            </div>
        </div>
    );
};

export default HeaderAuth;