import { callDeleteClassroomExercise } from '@/config/api'
import { TEST } from '@/constants/task'
import { IClassroomExercise } from '@/types/backend'
import { CheckSquareOutlined } from '@ant-design/icons'
import { ModalForm } from '@ant-design/pro-components'
import { Form, message, notification } from 'antd'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { FormattedMessage, useIntl } from 'react-intl'

interface IProps {
    type: string;
    classroomExercise: IClassroomExercise;
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalDeleteClassroomExercise = (props: IProps) => {
    const { type, classroomExercise, isModalOpen, setIsModalOpen } = props

    const intl = useIntl()
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

    const submitDelete = async (valuesForm: any) => {
        const res = await callDeleteClassroomExercise(classroomExercise.id as number);
        if (res && res.data) {
            message.success(`Xóa ${type === TEST ? 'bài kiểm tra' : 'bài tập'} khỏi lớp thành công`);
            router.push(`/classroom/${classroomExercise.classroomId}/${type === TEST ? 'test' : 'exercise'}`)
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }

    return (
        <ModalForm
            title={<>{`${type === TEST ? intl.messages["classroomDetail-testDetail.left-container.delete.modal.title"] : intl.messages["classroomDetail-exerciseDetail.left-container.delete.modal.title"]}`}</>}
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
            onFinish={submitDelete}
            initialValues={{}}
            submitter={{
                render: (_: any, dom: any) => <div style={{ display: 'flex', gap: '10px' }}>{dom}</div>,
                submitButtonProps: {
                    icon: <CheckSquareOutlined />,
                    danger: true
                },
                searchConfig: {
                    resetText: <span><FormattedMessage id="classroomDetail-exerciseDetail.left-container.delete.modal.cancel" /></span>,
                    submitText: <span> <FormattedMessage id="classroomDetail-exerciseDetail.left-container.delete.modal.submit" /></span>,

                },
            }}

        >
            <div>
                {type === TEST ? <FormattedMessage id="classroomDetail-testDetail.left-container.delete.modal.description" /> : <FormattedMessage id="classroomDetail-exerciseDetail.left-container.delete.modal.description" />}
            </div>
        </ModalForm>
    )
}

export default ModalDeleteClassroomExercise