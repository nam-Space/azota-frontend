import { Button, Divider, Form, Input, Row, Select, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import styles from './auth.module.scss';
import { IUser } from '@/types/backend';
import { useAppSelector } from '@/redux/hooks';
import Link from 'next/link';
import { callRegister } from '@/config/api';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
import { VI } from '@/constants/language';
const { Option } = Select;


const Register = () => {
    const router = useRouter();
    const intl = useIntl()

    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values: IUser) => {
        const { name, email, password, gender } = values;
        setIsSubmit(true);
        const res = await callRegister(name as string, email as string, password as string, gender as string);
        setIsSubmit(false);
        if (res?.data?.id) {
            message.success('Đăng ký tài khoản thành công!');
            router.push('/login')
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
        <div className={styles["register-page"]} >

            <main className={styles.main} >
                <div className={styles.container} >
                    <section className={styles.wrapper} >
                        <div className={styles.heading} >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 className={`${styles.text} ${styles["text-large"]}`}> <FormattedMessage id="register.title" /></h2>
                            </div>
                            < Divider />
                        </div>
                        < Form<IUser>
                            name="basic"
                            // style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={<FormattedMessage id="register.name.label" />}
                                name="name"
                                rules={[{ required: true, message: <FormattedMessage id="register.name.required" /> }]}
                            >
                                <Input placeholder={intl.messages['register.name.placeholder'] as string} />
                            </Form.Item>


                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={<FormattedMessage id="register.email.label" />}
                                name="email"
                                rules={[{ required: true, message: <FormattedMessage id="register.email.required" /> }]}
                            >
                                <Input type='email' placeholder={intl.messages['register.email.placeholder'] as string} />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label={<FormattedMessage id="register.password.label" />}
                                name="password"
                                rules={[{ required: true, message: <FormattedMessage id="register.password.required" /> }]}
                            >
                                <Input.Password placeholder={intl.messages['register.password.placeholder'] as string} />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                name="gender"
                                label={<FormattedMessage id="register.gender.label" />}
                                rules={[{ required: true, message: <FormattedMessage id="register.gender.required" /> }]}
                            >
                                <Select
                                    // placeholder="Select a option and change input text above"
                                    // onChange={onGenderChange}
                                    placeholder={intl.messages['register.gender.placeholder'] as string}
                                    allowClear
                                >
                                    <Option value="MALE">
                                        <FormattedMessage id="register.gender.male" />
                                    </Option>
                                    <Option value="FEMALE">
                                        <FormattedMessage id="register.gender.female" />
                                    </Option>
                                    <Option value="OTHER">
                                        <FormattedMessage id="register.gender.other" />
                                    </Option>
                                </Select>
                            </Form.Item>

                            < Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit} >
                                    <FormattedMessage id="register.submit" />
                                </Button>
                            </Form.Item>
                            <Divider> <FormattedMessage id="register.or" /> </Divider>
                            <p className="text text-normal" > <FormattedMessage id="register.have-account" />
                                <span>
                                    <Link href='/login' > <FormattedMessage id="register.login" /> </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Register;