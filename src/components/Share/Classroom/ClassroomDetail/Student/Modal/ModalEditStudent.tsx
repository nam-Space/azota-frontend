import { ModalForm, ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, ConfigProvider, Form, Modal, Row, Upload, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateUser, callFetchRole, callRefreshToken, callUpdateUser, callUpdateUserProfile, callUploadSingleFile } from "@/config/api";
import { IRole, IUser } from "@/types/backend";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';
import defaultAvatar from '@/images/header/user/default-avatar.png'
import dayjs from "dayjs";
import { getUserAvatar } from "@/utils/imageUrl";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";
import { DebounceSelect } from "@/components/Share/DebounceSelect";
import { FormattedMessage, useIntl } from "react-intl";
import Cookies from "js-cookie";
import ms from "ms";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IUser | null;
    setDataInit?: (v: any) => void;
    reloadTable?: () => void;
    reloadUser?: (v: string) => void
}

export interface ICompanySelect {
    label: string;
    value: string;
    key?: string;
}

export interface IRoleSelect {
    label?: string;
    value?: number;
    key?: number;
}

interface IUserAvatar {
    name: string;
    uid: string;
}

const ModalEditStudent = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit, reloadUser } = props;

    const intl = useIntl()
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [dataAvatar, setDataAvatar] = useState<IUserAvatar[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const dispatch = useAppDispatch()
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id) {
            if (dataInit?.avatar) {
                setDataAvatar([
                    {
                        uid: uuidv4(),
                        name: dataInit.avatar
                    }
                ])
            }
        }
        return () => form.resetFields()
    }, [dataInit, openModal]);

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
                    if (reloadTable) {
                        reloadTable();
                    }
                    if (reloadUser) {
                        reloadUser(dataInit.id + '')
                    }
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
        if (setDataInit) {
            setDataInit(null);
        }
        setDataAvatar([])
        setOpenModal(false);
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
        return true;
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
        <>
            <ModalForm
                title={<>{dataInit?.id ? <FormattedMessage id="studentDetail-classroomExerciseDetail.profile.edit.modal.title" /> : <FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.title" />}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <span>{dataInit?.id ? <FormattedMessage id="studentDetail-classroomExerciseDetail.profile.edit.modal.submit" /> : <FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.submit" />}</span>,
                    cancelText: <span><FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.cancel" /></span>,
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitUser}
                initialValues={dataInit?.id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label={<FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.email.title" />}
                            name="email"
                            disabled={true}
                            placeholder={intl.messages['studentDetail-classroomExerciseDetail.profile.create.modal.email.placeholder'] as string}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label={<FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.name.title" />}
                            name="name"
                            rules={[{ required: true, message: <FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.name.required" /> }]}
                            placeholder={intl.messages['studentDetail-classroomExerciseDetail.profile.create.modal.name.placeholder'] as string}
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormText
                            label={<FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.phone.title" />}
                            name="phone"
                            placeholder={intl.messages['studentDetail-classroomExerciseDetail.profile.create.modal.phone.placeholder'] as string}
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ConfigProvider locale={enUS}>
                            <ProFormDatePicker
                                label={<FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.birthDay.title" />}
                                name="birthDay"
                                normalize={(value) => value && dayjs(value, 'YYYY/MM/DD')}
                                fieldProps={{
                                    format: 'DD/MM/YYYY',
                                }}
                                width={'lg'}
                                placeholder={intl.messages['studentDetail-classroomExerciseDetail.profile.create.modal.birthDay.placeholder'] as string}
                            />
                        </ConfigProvider>
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <ProFormSelect
                            name="gender"
                            label={<FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.gender.title" />}
                            valueEnum={{
                                MALE: <FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.gender.male" />,
                                FEMALE: <FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.gender.female" />,
                                OTHER: <FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.gender.other" />,
                            }}
                            placeholder={intl.messages['studentDetail-classroomExerciseDetail.profile.create.modal.gender.placeholder'] as string}
                            rules={[{ required: true, message: <FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.gender.required" /> }]}
                        />
                    </Col>
                    <Col lg={8} md={8} sm={24} xs={24}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label={<FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.avatar.title" />}
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
                                        <div style={{ marginTop: 8 }}>
                                            <FormattedMessage id="studentDetail-classroomExerciseDetail.profile.create.modal.avatar.upload" />
                                        </div>
                                    </div>
                                </Upload>
                            </ConfigProvider>
                        </Form.Item>
                    </Col>
                </Row>
            </ModalForm>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                style={{ zIndex: 50 }}
            >
                <Image alt="userImg" style={{ width: '100%', objectFit: 'cover' }} width={500} height={500} src={previewImage} />
            </Modal>
        </>
    )
}

export default ModalEditStudent;
