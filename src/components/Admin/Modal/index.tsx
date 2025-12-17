import { BY_FILE, BY_HANDMADE } from '@/constants/option'
import { HOMEWORK, TEST } from '@/constants/task'
import { CheckSquareOutlined } from '@ant-design/icons'
import { ModalForm } from '@ant-design/pro-components'
import { Form, Radio, RadioChangeEvent, Space } from 'antd'
import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { FormattedMessage, useIntl } from 'react-intl'

interface IProps {
    task: string;
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const ModalCreateOption = (props: IProps) => {
    const { task, isModalOpen, setIsModalOpen } = props

    const intl = useIntl();
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

    const [optionCreateValue, setOptionCreateValue] = useState(BY_HANDMADE);

    const submitCreateOption = async (valuesForm: any) => {
        if (task === TEST) {
            if (optionCreateValue === BY_HANDMADE) {
                router.push('/test/add')
            }
        }
        else {
            if (optionCreateValue === BY_HANDMADE) {
                router.push('/exercise/add')
            }
        }

    }

    const onChange = (e: RadioChangeEvent) => {
        setOptionCreateValue(e.target.value);
    };


    return (
        <ModalForm
            title={<>{`${task === HOMEWORK ? intl.messages["homework.create.title"] : intl.messages["test.create.title"]}`}</>}
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
            onFinish={submitCreateOption}
            initialValues={{}}
            submitter={{
                render: (_: any, dom: any) => <div style={{ display: 'flex', gap: '10px' }}>{dom}</div>,
                submitButtonProps: {
                    icon: <CheckSquareOutlined />
                },
                searchConfig: {
                    resetText: <span><FormattedMessage id='homework.create.modal.cancel' /></span>,
                    submitText: <span><FormattedMessage id='homework.create.modal.submit' /></span>,
                }
            }}

        >
            <div>
                <Radio.Group onChange={onChange} value={optionCreateValue}>
                    <Space direction="vertical">
                        <Radio value={BY_HANDMADE}>{task === HOMEWORK ? <FormattedMessage id='homework.create.modal.option-1' /> : <FormattedMessage id='test.create.modal.option-1' />}</Radio>
                        <Radio value={BY_FILE}><FormattedMessage id='homework.create.modal.option-2' /></Radio>
                    </Space>
                </Radio.Group>
            </div>
        </ModalForm>
    )
}

export default ModalCreateOption