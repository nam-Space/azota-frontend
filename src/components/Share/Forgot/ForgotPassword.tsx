import { IUser } from "@/types/backend";
import { Button, Divider, Form, Input, message, notification } from "antd";
import { useEffect, useState } from "react";
import styles from '../Login/auth.module.scss';
import { useRouter } from "next/router";
import { callGetUserByEmailAndPasswordToken, callUpdateUserPasswordForLogin } from "@/config/api";
import { FormattedMessage, useIntl } from "react-intl";

const ForgotPassword = () => {
    const router = useRouter()
    const intl = useIntl()

    const [isSubmit, setIsSubmit] = useState(false);

    const [form] = Form.useForm();

    const [linkIsValid, setLinkIsValid] = useState(true)
    const [user, setUser] = useState<IUser | null>(null)


    useEffect(() => {
        const getUser = async () => {
            if (router.query.passwordToken && router.query.email) {
                const passwordToken = router.query.passwordToken as string
                const email = router.query.email as string
                const res = await callGetUserByEmailAndPasswordToken({ email, passwordToken })
                if (!res.data) {
                    setLinkIsValid(false)
                }
                else {
                    setLinkIsValid(true)
                    setUser(res.data)
                }
            }
            else {
                setLinkIsValid(false)
            }
        }
        getUser()
        return () => form.resetFields()
    }, [router])

    const onFinish = async (values: any) => {
        const { new_password, renew_password } = values;
        setIsSubmit(true);
        const res = await callUpdateUserPasswordForLogin(user?.id as number, { new_password, renew_password });
        setIsSubmit(false);
        if (res?.data) {
            message.success('Thay đổi mật khẩu thành công!');
            // window.location.href = '/login';
            router.push('/login');
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
                    {linkIsValid ? <section className={styles.wrapper}>
                        <div className={styles.heading}>
                            <h2 className={`${styles.text} ${styles["text-large"]}`}><FormattedMessage id="reset-password.title" /></h2>
                            <Divider />

                        </div>
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={<FormattedMessage id="reset-password.new-password.label" />}
                                name="new_password"
                                rules={[{ required: true, message: <FormattedMessage id="reset-password.new-password.required" /> }]}
                            >
                                <Input.Password placeholder={intl.messages['reset-password.new-password.placeholder'] as string} />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={<FormattedMessage id="reset-password.re-password.label" />}
                                name="renew_password"
                                rules={[{ required: true, message: <FormattedMessage id="reset-password.re-password.required" /> }]}
                            >
                                <Input.Password placeholder={intl.messages['reset-password.re-password.placeholder'] as string} />
                            </Form.Item>

                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    <FormattedMessage id="reset-password.submit" />
                                </Button>
                            </Form.Item>
                        </Form>
                    </section> : <h2 className={`${styles.text} ${styles["text-large"]}`}>
                        <FormattedMessage id="reset-password.link-unauthorized" />
                    </h2>}

                </div>
            </main>
        </div>

    )
}

export default ForgotPassword