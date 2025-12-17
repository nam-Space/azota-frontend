import { callDeleteUserClassroom, callLeaveRoom } from '@/config/api'
import { BY_FILE, BY_HANDMADE } from '@/constants/option'
import { HOMEWORK, TEST } from '@/constants/task'
import { useAppSelector } from '@/redux/hooks'
import { IClassroom, IUser, IUserClassroom } from '@/types/backend'
import { CheckSquareOutlined } from '@ant-design/icons'
import { ModalForm } from '@ant-design/pro-components'
import { Button, Form, Radio, RadioChangeEvent, Space, message, notification } from 'antd'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { FormattedMessage } from 'react-intl'

interface IProps {
    userClassroom: IUserClassroom;
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteUserClassroom = (props: IProps) => {
    const { userClassroom, isModalOpen, setIsModalOpen } = props

    const router = useRouter()

    const [form] = Form.useForm()
    const [animation, setAnimation] = useState<string>('open');

    const handleReset = async () => {
        form.resetFields();

        //add animation when closing modal
        setAnimation('close')
        await new Promise(r => setTimeout(r, 200))
        setIsModalOpen(false);
        setAnimation('open')
    }

    const submitLeaveRoom = async (valuesForm: any) => {
        const res = await callDeleteUserClassroom(userClassroom.id as number);
        if (res && res.data) {
            message.success('Xóa học sinh khỏi lớp thành công');
            router.push(`/classroom/${userClassroom.classroomId}/student`)
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }

    return (
        <ModalForm
            title={<>{<FormattedMessage id="studentDetail-classroomExerciseDetail.profile.delete.modal.title" />}</>}
            open={isModalOpen}
            modalProps={{
                onCancel: () => handleReset(),
                afterClose: () => handleReset(),
                destroyOnClose: true,
                width: isMobile ? "100%" : 700,
                footer: null,
                keyboard: false,
                maskClosable: false,
                className: `${animation}`,
                rootClassName: `${animation}`
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            onFinish={submitLeaveRoom}
            initialValues={{}}
            submitter={{
                render: (_: any, dom: any) => <div style={{ display: 'flex', gap: '10px' }}>{dom}</div>,
                submitButtonProps: {
                    icon: <CheckSquareOutlined />,
                    danger: true
                },
                searchConfig: {
                    resetText: <span><FormattedMessage id="studentDetail-classroomExerciseDetail.profile.delete.modal.cancel" /></span>,
                    submitText: <span><FormattedMessage id="studentDetail-classroomExerciseDetail.profile.delete.modal.submit" /></span>,

                },
            }}

        >
            <div>
                <FormattedMessage id="studentDetail-classroomExerciseDetail.profile.delete.modal.description" />
            </div>
        </ModalForm>
    )
}

export default ModalDeleteUserClassroom