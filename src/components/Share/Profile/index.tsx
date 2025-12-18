import { callRefreshToken, callUpdateUserProfile, callUploadSingleFile } from '@/config/api';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchAccount, setUserLoginInfo } from '@/redux/slice/accountSlide';
import { Col, ConfigProvider, Form, Modal, Row, Upload, message, notification } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';
import { ProForm, ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getUserAvatar } from '@/utils/imageUrl';
import styles from './profile.module.scss'
import { FormattedMessage, useIntl } from 'react-intl';
import Cookies from 'js-cookie';
import ms from 'ms';

interface IUserAvatar {
    name: string;
    uid: string;
}

const Profile = () => {
    const dispatch = useAppDispatch();
    const intl = useIntl()

    const dataInit = useAppSelector(state => state.account.user);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [dataAvatar, setDataAvatar] = useState<IUserAvatar[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id) {
            if (dataInit?.avatar) {
                setDataAvatar([
                    {
                        name: dataInit.avatar,
                        uid: uuidv4()
                    }
                ])
            }
            form.setFieldsValue({
                ...dataInit,
            })
        }

        return () => form.resetFields()
    }, [dataInit]);

    const submitUser = async (valuesForm: any) => {
        const { name, birthDay, gender, phone } = valuesForm;

        if (dataInit?.id) {
            //update
            const user = {
                name,
                avatar: dataAvatar[0].name,
                birthDay: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(birthDay) ? dayjs(birthDay, 'DD/MM/YYYY').toDate() : birthDay,
                gender,
                phone,
            }


            const res = await callUpdateUserProfile(+dataInit.id, user);
            if (res.data) {
                const resTmp = await callRefreshToken();
                if (resTmp.data) {
                    Cookies.set("refresh_token", resTmp.data.refresh_token, {
                        expires:
                            +ms(process.env.NEXT_PUBLIC_COOKIE_EXPIRE as any) /
                            86400000,
                    });
                    localStorage.setItem('access_token', resTmp.data.access_token);
                    dispatch(setUserLoginInfo(resTmp.data.user))
                    message.success("Cập nhật user thành công");
                    handleReset();
                }

            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
    }

    const handleRemoveFile = (file: any) => {
        setDataAvatar([])
    }

    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
        }
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, "user");
        if (res && res.data) {
            setDataAvatar([{
                name: res.data.fileName,
                uid: uuidv4()
            }])
            if (onSuccess) onSuccess('ok')
        } else {
            if (onError) {
                setDataAvatar([])
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };

    return (
        <div className={styles['wrapper']}>
            <ConfigProvider locale={enUS}>
                <ProForm
                    form={form}
                    onFinish={submitUser}
                    submitter={
                        {
                            searchConfig: {
                                resetText: <span><FormattedMessage id="profile.right-container.cancel" /></span>,
                                submitText: <span><FormattedMessage id="profile.right-container.submit" /></span>
                            },
                            onReset: () => handleReset(),
                            submitButtonProps: {
                                icon: <CheckSquareOutlined />
                            },
                        }
                    }
                >
                    <Row gutter={16}>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText
                                label={<FormattedMessage id="profile.right-container.email.label" />}
                                name="email"
                                disabled={true}
                                placeholder={intl.messages['profile.right-container.email.placeholder'] as string}
                            />
                        </Col>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <ProFormText
                                label={<FormattedMessage id="profile.right-container.name.label" />}
                                name="name"
                                rules={[{ required: true, message: <FormattedMessage id="profile.right-container.name.required" /> }]}
                                placeholder={intl.messages['profile.right-container.name.placeholder'] as string}
                            />
                        </Col>
                        <Col lg={8} md={8} sm={24} xs={24}>
                            <ProFormText
                                label={<FormattedMessage id="profile.right-container.phone.label" />}
                                name="phone"
                                placeholder={intl.messages['profile.right-container.phone.placeholder'] as string}
                            />
                        </Col>
                        <Col lg={8} md={8} sm={24} xs={24}>
                            <ConfigProvider locale={enUS}>
                                <ProFormDatePicker
                                    label={<FormattedMessage id="profile.right-container.birthDay.label" />}
                                    name="birthDay"
                                    normalize={(value) => value && dayjs(value, 'YYYY/MM/DD')}
                                    fieldProps={{
                                        format: 'DD/MM/YYYY',
                                    }}
                                    width={'lg'}
                                    placeholder={intl.messages['profile.right-container.birthDay.placeholder'] as string}
                                />
                            </ConfigProvider>
                        </Col>
                        <Col lg={8} md={8} sm={24} xs={24}>
                            <ProFormSelect
                                name="gender"
                                label={<FormattedMessage id="profile.right-container.gender.label" />}
                                valueEnum={{
                                    MALE: <FormattedMessage id="profile.right-container.gender.male" />,
                                    FEMALE: <FormattedMessage id="profile.right-container.gender.female" />,
                                    OTHER: <FormattedMessage id="profile.right-container.gender.other" />,
                                }}
                                placeholder={intl.messages['profile.right-container.gender.placeholder'] as string}
                                rules={[{ required: true, message: <FormattedMessage id="profile.right-container.gender.required" /> }]}
                            />
                        </Col>
                        <Col lg={6} md={6} sm={24} xs={24}>

                            <Form.Item
                                labelCol={{ span: 24 }}
                                label={<FormattedMessage id="profile.right-container.avatar.title" />}
                                name="avatar"
                                rules={[{
                                    required: false,
                                }]}
                            >
                                <ConfigProvider locale={enUS}>
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        maxCount={1}
                                        multiple={false}
                                        customRequest={handleUploadFileLogo}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        onRemove={(file) => handleRemoveFile(file)}
                                        onPreview={handlePreview}
                                        defaultFileList={
                                            dataInit?.id && dataInit.avatar ?
                                                [
                                                    {
                                                        uid: uuidv4(),
                                                        name: dataInit?.avatar ?? "",
                                                        status: 'done',
                                                        url: getUserAvatar(dataInit.avatar),
                                                    }
                                                ] : []
                                        }

                                    >
                                        <div>
                                            {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>{<FormattedMessage id="profile.right-container.avatar.upload" />}</div>
                                        </div>
                                    </Upload>
                                </ConfigProvider>
                            </Form.Item>
                        </Col>
                    </Row>
                </ProForm>
                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={() => setPreviewOpen(false)}
                    style={{ zIndex: 1500 }}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </ConfigProvider>
        </div>
    )
}

export default Profile