import { callDeleteUserClassroom, callLeaveRoom } from '@/config/api'
import { BY_FILE, BY_HANDMADE } from '@/constants/option'
import { HOMEWORK, TEST } from '@/constants/task'
import { useAppSelector } from '@/redux/hooks'
import { IClassroom } from '@/types/backend'
import { CheckSquareOutlined } from '@ant-design/icons'
import { ModalForm } from '@ant-design/pro-components'
import { Button, Form, Radio, RadioChangeEvent, Space, message, notification } from 'antd'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { FormattedMessage } from 'react-intl'

interface IProps {
    classroom: IClassroom;
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalLeaveRoom = (props: IProps) => {
    const { classroom, isModalOpen, setIsModalOpen } = props

    const router = useRouter()

    const user = useAppSelector(state => state.account.user)

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
        const res = await callLeaveRoom({
            classroomId: classroom.id as number,
            userId: user.id
        });
        if (res && res.data) {
            message.success('Bạn đã rời nhóm thành công!');
            router.push('/classroom')
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }

    return (
        <ModalForm
            title={<FormattedMessage id="classroomDetail-student.right-container.leave-room.modal.title" />}
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
                    resetText: <span>
                        <FormattedMessage id="classroomDetail-student.right-container.leave-room.modal.cancel" />
                    </span>,
                    submitText: <span>
                        <FormattedMessage id="classroomDetail-student.right-container.leave-room.modal.submit" />
                    </span>,

                },
            }}

        >
            <div>
                <FormattedMessage id="classroomDetail-student.right-container.leave-room.modal.description" />
            </div>
        </ModalForm>
    )
}

export default ModalLeaveRoom