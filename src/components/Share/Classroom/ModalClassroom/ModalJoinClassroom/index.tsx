import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { Col, Form, Row, message, notification, } from 'antd'
import React, { useEffect, useState } from 'react'
import { CheckSquareOutlined, PlusOutlined } from '@ant-design/icons'
import { isMobile } from 'react-device-detect'
import { useAppSelector } from '@/redux/hooks'
import { callCreateUserClassroom, callFetchClassroomByClassroomToken, callFetchClassroomById } from '@/config/api'
import { IClassroom } from '@/types/backend'
import { useRouter } from 'next/router'
import { FormattedMessage, useIntl } from 'react-intl'

interface ModalJoinClassroomProps {
    isModalOpenJoinClassroom: boolean
    setIsModalOpenJoinClassroom: any
}

const ModalJoinClassroom = (props: ModalJoinClassroomProps) => {
    const { isModalOpenJoinClassroom, setIsModalOpenJoinClassroom } = props

    const router = useRouter()
    const intl = useIntl()

    const [form] = Form.useForm();
    const [animation, setAnimation] = useState<string>('open');
    const user = useAppSelector(state => state.account.user)

    const submitClassroom = async (valuesForm: any) => {
        const { classroomToken } = valuesForm
        const resClassroom = await callFetchClassroomByClassroomToken(classroomToken)
        if (resClassroom.data) {
            const classroom = resClassroom.data
            const res = await callCreateUserClassroom({
                classroomId: classroom.id,
                userId: user.id
            })
            if (res.data) {
                message.success('Gia nhập lớp thành công!');
                router.push(`/classroom/${classroom.id}/student`)
            }
            else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description:
                        res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5
                })
            }
        }
        else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    resClassroom.message && Array.isArray(resClassroom.message) ? resClassroom.message[0] : resClassroom.message,
                duration: 5
            })
        }

    }

    const handleReset = async () => {
        form.resetFields();

        //add animation when closing modal
        setAnimation('close')
        await new Promise(r => setTimeout(r, 200))
        setIsModalOpenJoinClassroom(false);
        setAnimation('open')
    }
    return (
        <ModalForm
            title={<FormattedMessage id="classroom.join.modal.title" />}
            open={isModalOpenJoinClassroom}
            modalProps={{
                onCancel: () => { handleReset() },
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
            onFinish={submitClassroom}
            initialValues={{}}
            submitter={{
                render: (_: any, dom: any) => <div style={{ display: 'flex', gap: '10px' }}>{dom}</div>,
                submitButtonProps: {
                    icon: <CheckSquareOutlined />
                },
                searchConfig: {
                    resetText: <span><FormattedMessage id="classroom.join.modal.cancel" /></span>,
                    submitText: <span><FormattedMessage id="classroom.join.modal.submit" /></span>,
                }
            }}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <ProFormText
                        label={<FormattedMessage id="classroom.join.modal.classroom-token.label" />}
                        name="classroomToken"
                        rules={[{ required: true, message: <FormattedMessage id="classroom.join.modal.classroom-token.required" /> }]}
                        placeholder={intl.messages['classroom.join.modal.classroom-token.placeholder'] as string}
                    />
                </Col>
            </Row>
        </ModalForm >
    )
}

export default ModalJoinClassroom