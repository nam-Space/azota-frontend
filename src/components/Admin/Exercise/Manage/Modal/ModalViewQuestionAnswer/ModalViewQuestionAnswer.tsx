
import { IExercise } from '@/types/backend'
import { ModalForm } from '@ant-design/pro-components'
import { Form } from 'antd'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { isMobile } from 'react-device-detect'
import styles from './modal-view-question-answer.module.scss'
import { FormattedMessage, useIntl } from 'react-intl'

interface IProps {
    exercise: IExercise;
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalViewQuestionAnswer = (props: IProps) => {
    const { exercise, isModalOpen, setIsModalOpen } = props

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

    return (
        <ModalForm
            title={<>{intl.messages['classroomDetail-exerciseDetail.left-container.modal.title']}</>}
            open={isModalOpen}
            modalProps={{
                onCancel: () => handleReset(),
                afterClose: () => handleReset(),
                destroyOnClose: true,
                width: isMobile ? "100%" : 920,
                footer: null,
                keyboard: true,
                maskClosable: true,
                className: `${animation}`,
                rootClassName: `${animation}`
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            initialValues={{}}
            submitter={{
                render: (_: any, dom: any) => <div style={{ display: 'flex', gap: '10px' }}></div>,
            }}

        >
            <div style={{ marginTop: 14 }}>
                {exercise.questions?.map((question, indexQuestion) => (
                    <div key={indexQuestion + 1} className={styles['question-item']}>
                        <div style={{ padding: 20 }}>
                            <div style={{ marginTop: 10 }}>
                                <p style={{ fontWeight: 600 }}><FormattedMessage id="classroomDetail-exerciseDetail.left-container.modal.question" /> {indexQuestion + 1}:</p>
                                <div dangerouslySetInnerHTML={{
                                    __html: question.name as string
                                }}></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                                {question.answers?.map((answer, indexAnswer) => (
                                    <div key={indexAnswer + 1} style={{ display: 'flex', gap: 6 }}>
                                        <span style={{ fontWeight: 600 }}>{String.fromCharCode(indexAnswer + 65)}.</span>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: answer.name as string
                                            }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'left', marginTop: 12 }}>
                                <p
                                    style={{
                                        fontWeight: 700,
                                        color: '#68CC00'
                                    }}>
                                    <FormattedMessage id="classroomDetail-exerciseDetail.left-container.modal.answer" /> {String.fromCharCode((question.answers?.findIndex(answer => answer.isCorrect) as number) + 65)}
                                </p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </ModalForm>
    )
}

export default ModalViewQuestionAnswer