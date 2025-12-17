import { ModalForm, ProForm, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { Button, Col, Form, Radio, Row, message, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './modalClassroom.module.scss'
import { RadioChangeEvent } from 'antd/lib'
import { CheckSquareOutlined, PlusOutlined } from '@ant-design/icons'
import AddNewGroup from '../Group/AddNewGroup'
import { isMobile } from 'react-device-detect'
import { IClassroom, IGroup } from '@/types/backend'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchSchoolYear } from '@/redux/slice/schoolYearSlide'
import { callCreateClassroom, callUpdateClassroom } from '@/config/api'
import { fetchGroup } from '@/redux/slice/groupSlide'
import { v4 as uuidv4 } from 'uuid';
import Access from '../../Access'
import { ALL_PERMISSIONS } from '@/constants/permission'
import { FormattedMessage, useIntl } from 'react-intl'

interface ModalClassroomProps {
    setClassroom: any
    classroom: IClassroom | null
    groupClassroom: IGroup[]
    isModalOpen: boolean
    handleOk(): void
    handleCancel(): void
    setIsModalOpen: any
}

const ModalClassroom = (props: ModalClassroomProps) => {
    const { setClassroom, classroom, groupClassroom, isModalOpen, handleOk, handleCancel, setIsModalOpen } = props

    const intl = useIntl()
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.account.user)

    const listSchoolYear = useAppSelector(state => state.schoolYear.result)

    const [groupSelected, setGroupSelected] = useState(1);
    const [animation, setAnimation] = useState<string>('open');

    const [openFormAddNewGroup, setOpenFormAddNewGroup] = useState(false)
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(fetchSchoolYear({ query: '' }))
    }, [dispatch])

    useEffect(() => {
        if (classroom) {
            setGroupSelected(classroom.groupId as number)
        }

    }, [classroom])

    const onChange = (e: RadioChangeEvent) => {
        setGroupSelected(e.target.value);
    };


    const submitCompany = async (valuesForm: any) => {

        const { name, schoolYearId } = valuesForm;

        if (classroom?.id) {
            const res = await callUpdateClassroom({
                name,
                schoolYearId,
                groupId: groupSelected,
            }, classroom.id);
            if (res.data) {
                message.success("Cập nhật lớp thành công");
                handleReset();
                dispatch(fetchGroup({ query: `page=1&limit=500&filter.createdBy=$eq:${user.id}&relations=classrooms.group,classrooms.schoolYear,classrooms.classroomExercises,classrooms.userClassrooms&sort=updatedAt-DESC` }))
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            const res = await callCreateClassroom({
                name,
                schoolYearId,
                groupId: groupSelected,
                classroomToken: uuidv4()
            });
            if (res.data) {
                message.success("Thêm mới lớp thành công");
                handleReset();
                dispatch(fetchGroup({ query: `page=1&limit=500&filter.createdBy=$eq:${user.id}&relations=classrooms.group,classrooms.schoolYear,classrooms.classroomExercises,classrooms.userClassrooms&sort=updatedAt-DESC` }))
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
        setGroupSelected(1);
        setClassroom(null);

        //add animation when closing modal
        setAnimation('close')
        await new Promise(r => setTimeout(r, 200))
        setIsModalOpen(false);
        setAnimation('open')
    }
    return (
        <ModalForm
            title={<>{classroom ? intl.messages['classroom.classroom.update.modal.title'] : intl.messages['classroom.create.modal.title']}</>}
            open={isModalOpen}
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
            onFinish={submitCompany}
            initialValues={classroom ? {
                name: classroom.name,
                schoolYearId: classroom.schoolYear?.id,
            } : {}}
            submitter={{
                render: (_: any, dom: any) => <div style={{ display: 'flex', gap: '10px' }}>{dom}</div>,
                submitButtonProps: {
                    icon: <CheckSquareOutlined />
                },
                searchConfig: {
                    resetText: <span><FormattedMessage id='classroom.create.modal.cancel' /></span>,
                    submitText: <span>
                        {classroom ? <FormattedMessage id='classroom.classroom.update.modal.submit' /> : <FormattedMessage id='classroom.create.modal.submit' />}
                    </span>,
                }
            }}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <ProFormText
                        label={intl.messages['classroom.create.modal.input-classroom.label'] as string}
                        name="name"
                        rules={[{ required: true, message: intl.messages['classroom.create.modal.input-classroom.required'] as string }]}
                        placeholder={intl.messages['classroom.create.modal.input-classroom.placeholder'] as string}
                    />
                </Col>
                <Col span={24}>
                    <ProFormSelect
                        name="schoolYearId"
                        label={intl.messages['classroom.create.modal.input-schoolYear.label'] as string}
                        placeholder={intl.messages['classroom.create.modal.input-schoolYear.placeholder'] as string}
                        options={listSchoolYear.map((schoolYear) => {
                            return {
                                label: schoolYear.name,
                                value: schoolYear.id
                            }
                        })}
                        rules={[{ required: true, message: intl.messages['classroom.create.modal.input-schoolYear.required'] as string }]}

                    />
                </Col>
                <Col span={24}>
                    <ProForm
                        className={styles['group-form']}
                        submitter={
                            {
                                render: () => <></>
                            }
                        }
                    >
                        <div className={styles['title-group-select']}><FormattedMessage id='classroom.create.modal.group.title' /></div>
                        <Radio.Group onChange={onChange} value={groupSelected} style={{ width: '100%', padding: '6px 20px' }}>
                            <Row gutter={20}>
                                {groupClassroom?.map((group: IGroup, index: number) => (
                                    <Col key={index} span={8}><Radio value={group.id}>{group.name}</Radio></Col>
                                ))}
                            </Row>
                        </Radio.Group>

                        <Access permission={ALL_PERMISSIONS.GROUP.CREATE}>
                            {openFormAddNewGroup ?
                                <AddNewGroup setOpenFormAddNewGroup={setOpenFormAddNewGroup} /> : <Button type='link' icon={<PlusOutlined />} onClick={() => setOpenFormAddNewGroup(true)}>
                                    <span>
                                        <FormattedMessage id='classroom.create.modal.group.btn-add' />
                                    </span>
                                </Button>}
                        </Access>
                    </ProForm>
                </Col>
            </Row>
        </ModalForm >
    )
}

export default ModalClassroom