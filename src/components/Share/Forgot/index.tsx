import { Button, Divider, Form, Input, message, notification } from 'antd';
import { useState, useEffect } from 'react';
import styles from '../Login/auth.module.scss';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { callGenerateTokenPassword } from '@/config/api';
import { FormattedMessage, useIntl } from 'react-intl';
import { VI } from '@/constants/language';

const Forgot = () => {
    const router = useRouter();
    const intl = useIntl()

    const { locale } = router

    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: any) => {
        const { email } = values;
        setIsSubmit(true);
        const res = await callGenerateTokenPassword({ email, locale: locale as string });
        setIsSubmit(false);
        if (res?.data) {
            message.success(`Gửi email thành công! Vui lòng bạn check email: ${email}`);
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
        <div className={styles["forgot-page"]}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.wrapper}>
                        <div className={styles.heading}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 className={`${styles.text} ${styles["text-large"]}`}><FormattedMessage id="forgot-password.title" /></h2>
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
                                label={<FormattedMessage id="forgot-password.email.label" />}
                                name="email"
                                rules={[{ required: true, message: <FormattedMessage id="forgot-password.email.required" /> }]}
                            >
                                <Input placeholder={intl.messages['forgot-password.email.placeholder'] as string} />
                            </Form.Item>
                            <Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    <FormattedMessage id="forgot-password.submit" />
                                </Button>
                            </Form.Item>
                            <Divider><FormattedMessage id="forgot-password.or" /></Divider>
                            <p className="text text-normal" > <FormattedMessage id="forgot-password.have-account" />
                                <span>
                                    <Link href='/login' > <FormattedMessage id="forgot-password.login" /> </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Forgot;