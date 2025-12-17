import { ModalForm, ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Col, ConfigProvider, Form, Modal, Row, Upload, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateUser, callFetchRole, callRefreshToken, callUpdateUser, callUploadSingleFile } from "@/config/api";
import { IRole, IUser } from "@/types/backend";
import { DebounceSelect } from "../../../../Share/DebounceSelect";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';
import defaultAvatar from '@/images/header/user/default-avatar.png'
import dayjs from "dayjs";
import { getUserAvatar } from "@/utils/imageUrl";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUserLoginInfo } from "@/redux/slice/accountSlide";
import { FormattedMessage, useIntl } from "react-intl";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IUser | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
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

const ModalAdminForUser = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const intl = useIntl()

    const [role, setRole] = useState<IRoleSelect>({
        label: "",
        value: 0,
        key: 0,
    });
    const user = useAppSelector(state => state.account.user)

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

            if (dataInit.role) {
                setRole(
                    {
                        label: dataInit.role?.name,
                        value: dataInit.role?.id,
                        key: dataInit.role?.id,
                    }
                )
            }
        }
        return () => form.resetFields()
    }, [dataInit]);

    const submitUser = async (valuesForm: any) => {
        const { name, email, phone, password, gender, birthDay } = valuesForm;

        if (dataInit?.id) {
            //update
            const userObj = {
                email,
                name,
                birthDay: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(birthDay) ? dayjs(birthDay, 'DD/MM/YYYY').toDate() : birthDay,
                phone,
                gender,
                avatar: dataAvatar[0]?.name,
                roleId: role.value,
            }

            const res = await callUpdateUser(dataInit.id, userObj);
            if (res.data) {
                if (user.id === dataInit.id) {
                    const resTmp = await callRefreshToken();
                    if (resTmp.data) {
                        localStorage.setItem('access_token', resTmp.data.access_token);
                        dispatch(setUserLoginInfo(resTmp.data.user))
                    }
                }
                message.success("Cập nhật user thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const userObj = {
                email,
                password,
                name,
                birthDay: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(birthDay) ? dayjs(birthDay, 'DD/MM/YYYY').toDate() : birthDay,
                phone,
                gender,
                avatar: dataAvatar[0]?.name,
                roleId: role.value,
            }
            const res = await callCreateUser(userObj);
            if (res.data) {
                message.success("Thêm mới user thành công");
                handleReset();
                reloadTable();
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
        setDataInit(null);
        setDataAvatar([])
        setRole({
            label: "",
            value: 0,
            key: 0,
        });
        setOpenModal(false);
    }

    async function fetchRoleList(): Promise<IRoleSelect[]> {
        const res = await callFetchRole(`page=1&limit=500`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name,
                    value: item.id
                }
            })
            return temp;
        } else return [];
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
                title={<>{dataInit?.id ? <FormattedMessage id='admin.admin-user.table.row.edit.modal.title' /> : <FormattedMessage id='admin.admin-user.table.row.add.modal.title' />}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? <FormattedMessage id='admin.admin-user.table.row.edit.modal.submit' /> : <FormattedMessage id='admin.admin-user.table.row.add.modal.submit' />}</>,
                    cancelText: <FormattedMessage id='admin.admin-user.table.row.add.modal.cancel' />
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
                            label={<FormattedMessage id='admin.admin-user.table.row.add.modal.email.title' />}
                            name="email"
                            rules={[
                                { required: true, message: <FormattedMessage id='admin.admin-user.table.row.add.modal.email.required' /> },
                            ]}
                            placeholder={intl.messages['admin.admin-user.table.row.add.modal.email.placeholder'] as string}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText.Password
                            disabled={dataInit?.id ? true : false}
                            label={<FormattedMessage id='admin.admin-user.table.row.add.modal.password.title' />}
                            name="password"
                            rules={[{ required: dataInit?.id ? false : true, message: <FormattedMessage id='admin.admin-user.table.row.add.modal.password.required' /> }]}
                            placeholder={intl.messages['admin.admin-user.table.row.add.modal.password.placeholder'] as string}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label={<FormattedMessage id='admin.admin-user.table.row.add.modal.avatar.title' />}
                            name="avatar"
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
                                            <FormattedMessage id='admin.admin-user.table.row.add.modal.avatar.upload' />
                                        </div>
                                    </div>
                                </Upload>
                            </ConfigProvider>
                        </Form.Item>

                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ConfigProvider locale={enUS}>
                            <ProFormDatePicker
                                label={<FormattedMessage id='admin.admin-user.table.row.add.modal.birthDay.title' />}
                                name="birthDay"
                                normalize={(value) => value && dayjs(value, 'YYYY/MM/DD')}
                                fieldProps={{
                                    format: 'DD/MM/YYYY',
                                }}
                                width={'lg'}
                                placeholder={intl.messages['admin.admin-user.table.row.add.modal.birthDay.placeholder'] as string}
                            />
                        </ConfigProvider>
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormText
                            label={<FormattedMessage id='admin.admin-user.table.row.add.modal.name.title' />}
                            name="name"
                            rules={[{ required: true, message: <FormattedMessage id='admin.admin-user.table.row.add.modal.name.required' /> }]}
                            placeholder={intl.messages['admin.admin-user.table.row.add.modal.name.placeholder'] as string}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormText
                            label={<FormattedMessage id='admin.admin-user.table.row.add.modal.phone.title' />}
                            name="phone"
                            placeholder={intl.messages['admin.admin-user.table.row.add.modal.phone.placeholder'] as string}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormSelect
                            name="gender"
                            label={<FormattedMessage id='admin.admin-user.table.row.add.modal.gender.title' />}
                            valueEnum={{
                                MALE: <FormattedMessage id='admin.admin-user.table.row.add.modal.gender.male' />,
                                FEMALE: <FormattedMessage id='admin.admin-user.table.row.add.modal.gender.female' />,
                                OTHER: <FormattedMessage id='admin.admin-user.table.row.add.modal.gender.other' />,
                            }}
                            placeholder={intl.messages['admin.admin-user.table.row.add.modal.gender.placeholder'] as string}
                            rules={[{ required: true, message: <FormattedMessage id='admin.admin-user.table.row.add.modal.gender.required' /> }]}
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProForm.Item
                            name="role"
                            label={<FormattedMessage id='admin.admin-user.table.row.add.modal.role.title' />}
                            rules={[{ required: true, message: <FormattedMessage id='admin.admin-user.table.row.add.modal.role.required' /> }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={role}
                                value={role}
                                placeholder={intl.messages['admin.admin-user.table.row.add.modal.role.placeholder'] as string}
                                fetchOptions={fetchRoleList}
                                onChange={(newValue: any) => {
                                    setRole({
                                        key: newValue?.key,
                                        label: newValue?.label,
                                        value: newValue?.value
                                    });
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>

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

export default ModalAdminForUser;
