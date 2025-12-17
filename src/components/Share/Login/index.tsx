import { Button, Divider, Form, Input, message, notification } from 'antd';
import { callLogin } from '@/config/api';
import { useState, useEffect } from 'react';
import { setUserLoginInfo } from '@/redux/slice/accountSlide';
import styles from './auth.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FormattedMessage, useIntl } from 'react-intl';
import { VI } from '@/constants/language';

const Login = () => {
    const router = useRouter();
    const intl = useIntl()

    const { locale } = router

    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useAppDispatch();

    // let location = useLocation();
    // let params = new URLSearchParams(location.search);
    // const callback = params?.get("callback");

    const onFinish = async (values: any) => {
        const { username, password } = values;
        setIsSubmit(true);
        const res = await callLogin(username, password);
        setIsSubmit(false);
        if (res?.data) {
            localStorage.setItem('access_token', res.data.access_token);
            dispatch(setUserLoginInfo(res.data.user))
            message.success('Đăng nhập tài khoản thành công!');
            // window.location.href = callback ? callback : '/';
            if (locale === VI) {
                // window.location.href = '/'
                router.push('/')
            }
            else {
                // window.location.href = '/en'
                router.push('/en')
            }
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };

    return (
        <div className={styles["login-page"]}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <div className={styles.heading}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 className={`${styles.text} ${styles["text-large"]}`}>
                                    <FormattedMessage id="login.title" />
                                </h2>
                            </div>
                            <Divider />

                        </div>
                        <Form
                            name="basic"
                            // style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={<FormattedMessage id="login.email.label" />}
                                name="username"
                                rules={[{ required: true, message: <FormattedMessage id="login.email.required" /> }]}
                            >
                                <Input placeholder={intl.messages['login.email.placeholder'] as string} />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={<FormattedMessage id="login.password.label" />}
                                name="password"
                                rules={[{ required: true, message: <FormattedMessage id="login.password.required" /> }]}
                            >
                                <Input.Password placeholder={intl.messages['login.password.placeholder'] as string} />
                            </Form.Item>

                            <Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    <FormattedMessage id="login.submit" />
                                </Button>
                            </Form.Item>
                            <Divider><FormattedMessage id="login.or" /></Divider>
                            <div className={styles["wrapper-auth"]}>
                                <p className="text text-normal">
                                    <span>
                                        <Link href='/forgot' ><FormattedMessage id="login.forgot-password" /></Link>
                                    </span>
                                </p>
                                <p className="text text-normal"><FormattedMessage id="login.no-account" />
                                    <span>
                                        <Link href='/register' > <FormattedMessage id="login.register" /> </Link>
                                    </span>
                                </p>
                            </div>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Login;