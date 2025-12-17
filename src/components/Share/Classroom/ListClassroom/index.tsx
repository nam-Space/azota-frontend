import React, { useEffect, useState } from 'react'
import styles from './listClassroom.module.scss'
import { Button, Input, Popconfirm, Popover, message, notification } from 'antd'
import { ProForm } from '@ant-design/pro-components'
import { DeleteOutlined, EllipsisOutlined, FormOutlined, MoreOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import ModalClassroom from '../ModalClassroom'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { IClassroom, IGroup } from '@/types/backend'
import { callDeleteClassroom, callDeleteGroup, callFetchClassroomById, callUpdateGroup } from '@/config/api'
import { fetchGroup } from '@/redux/slice/groupSlide'
import Link from 'next/link'
import { STUDENT } from '@/constants/role'
import Access from '../../Access'
import { ALL_PERMISSIONS } from '@/constants/permission'
import { FormattedMessage } from 'react-intl'

const ListClassroom = () => {
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.account.user)

    const groupClassroom = useAppSelector(state => state.group.result)
    const [classroom, setClassroom] = useState<IClassroom | null>(null)

    const [openPopoverStatus, setOpenPopoverStatus] = useState(groupClassroom.map(group => {
        return {
            groupStatus: false,
            classrooms: (group.classrooms as IClassroom[]).map(_ => {
                return {
                    classroomStatus: false
                }
            })
        }
    }))

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupNameInput, setGroupNameInput] = useState('')

    useEffect(() => {
        setOpenPopoverStatus(groupClassroom.map(group => {
            return {
                groupStatus: false,
                classrooms: (group.classrooms as IClassroom[]).map(classroom => {
                    return {
                        classroomStatus: false
                    }
                })
            }
        }))
    }, [JSON.stringify(groupClassroom)])

    const handleChangeStatusGroup = (groupIndex: number, val: boolean) => {
        const newOpenPopoverStatus = [...openPopoverStatus]
        newOpenPopoverStatus[groupIndex].groupStatus = val
        setOpenPopoverStatus(newOpenPopoverStatus)
    }

    const handleChangeStatusClassroom = (groupIndex: number, classroomIndex: number, val: boolean) => {
        const newOpenPopoverStatus = [...openPopoverStatus]
        newOpenPopoverStatus[groupIndex].classrooms[classroomIndex].classroomStatus = val
        setOpenPopoverStatus(newOpenPopoverStatus)
        setClassroom((groupClassroom[groupIndex].classrooms as IClassroom[])[classroomIndex])
    }

    const showModal = (groupIndex: number, classroomIndex: number) => {
        setIsModalOpen(true);
        handleChangeStatusClassroom(groupIndex, classroomIndex, false)
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleUpdateGroup = async (group: IGroup) => {
        const res = await callUpdateGroup({
            name: groupNameInput
        }, group.id as number);
        if (res.data) {
            message.success(`Sửa nhóm thành công!`);
            dispatch(fetchGroup({ query: `page=1&limit=500&filter.createdBy=$eq:${user.id}&relations=classrooms.group,classrooms.schoolYear,classrooms.classroomExercises,classrooms.userClassrooms&sort=updatedAt-DESC` }))
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }

    const handleDeleteGroup = async (group: IGroup) => {
        const res = await callDeleteGroup(group.id as number);
        if (res.data) {
            message.success(`Xóa nhóm ${group.name} thành công!`);
            dispatch(fetchGroup({ query: `page=1&limit=500&filter.createdBy=$eq:${user.id}&relations=classrooms.group,classrooms.schoolYear,classrooms.classroomExercises,classrooms.userClassrooms&sort=updatedAt-DESC` }))
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }

    const handleDeleteClassroom = async (classroom: IClassroom) => {
        const res = await callDeleteClassroom(classroom.id as number)
        if (res.data) {
            message.success(`Xóa lớp ${classroom.name} thành công!`);
            dispatch(fetchGroup({ query: `page=1&limit=500&filter.createdBy=$eq:${user.id}&relations=classrooms.group,classrooms.schoolYear,classrooms.classroomExercises,classrooms.userClassrooms&sort=updatedAt-DESC` }))
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }

    return (
        <div className={styles['group-container']}>
            {groupClassroom.map((group, groupIndex) => (
                <div key={groupIndex} className={styles['group-item']}>
                    <div className={styles['group-heading']}>
                        <h2 style={{ textAlign: 'left' }}>{group.name}</h2>
                        <Popover
                            placement="rightBottom"
                            content={<div>
                                <Access
                                    permission={ALL_PERMISSIONS.GROUP.UPDATE}
                                    hideChildren
                                >
                                    <Popconfirm
                                        placement="rightTop"
                                        icon={null}
                                        title={<FormattedMessage id="classroom.group.update.pop.title" />}
                                        onConfirm={() => handleUpdateGroup(group)}
                                        description={<ProForm
                                            submitter={
                                                {
                                                    render: () => <></>
                                                }
                                            }
                                        >
                                            <ProForm.Item name="name" style={{ marginBottom: 0 }}>
                                                <Input value={groupNameInput} onChange={(e) => setGroupNameInput(e.target.value)} placeholder="Nhập tên nhóm" />
                                            </ProForm.Item >
                                        </ProForm>}
                                        okText={<FormattedMessage id="classroom.group.update.pop.submit" />}
                                        cancelText={<FormattedMessage id="classroom.group.update.pop.cancel" />}
                                    >
                                        <div>
                                            <Button onClick={() => setGroupNameInput(group.name as string)} type='text' icon={<FormOutlined />} >
                                                <span>
                                                    <FormattedMessage id="classroom.group.update.title" />
                                                </span>
                                            </Button>
                                        </div>
                                    </Popconfirm>
                                </Access>
                                <Access
                                    permission={ALL_PERMISSIONS.GROUP.DELETE}
                                    hideChildren
                                >
                                    <Popconfirm
                                        placement="rightTop"
                                        title={<FormattedMessage id="classroom.group.delete.pop.title" />}
                                        description={<FormattedMessage id="classroom.group.delete.pop.content" />}
                                        onConfirm={() => handleDeleteGroup(group)}
                                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                    >
                                        <Button style={{ color: 'red' }} type='text' icon={<DeleteOutlined />} >
                                            <span>
                                                <FormattedMessage id="classroom.group.delete.title" />
                                            </span>
                                        </Button>
                                    </Popconfirm>
                                </Access>
                            </div>}
                            trigger="click"
                            open={openPopoverStatus[groupIndex]?.groupStatus}
                            onOpenChange={(val: boolean) => handleChangeStatusGroup(groupIndex, val)}
                        >
                            <Button type='text' icon={<MoreOutlined />} ></Button>
                        </Popover>
                    </div>
                    {
                        (group.classrooms as IClassroom[]).length > 0 ? <div className={styles['classroom-wrapper']}>
                            {(group.classrooms as IClassroom[]).map((classroom, classroomIndex) => {
                                return (
                                    <div key={classroomIndex} className={styles['classroom-item']}>
                                        <div style={{ width: '100%' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Link href={`/classroom/${classroom.id}/student`} style={{ marginBottom: 5, fontWeight: '600' }}>{classroom.name}</Link>
                                                <Popover
                                                    placement="rightBottom"
                                                    content={<div>
                                                        <Access permission={ALL_PERMISSIONS.CLASSROOM.UPDATE} hideChildren>
                                                            <div>
                                                                <Button onClick={() => showModal(groupIndex, classroomIndex)} type='text' icon={<FormOutlined />} >
                                                                    <span>
                                                                        <FormattedMessage id="classroom.classroom.update.title" />
                                                                    </span>
                                                                </Button>
                                                            </div>
                                                        </Access>
                                                        <Access permission={ALL_PERMISSIONS.CLASSROOM.DELETE} hideChildren>
                                                            <Popconfirm
                                                                placement="rightTop"
                                                                title={<FormattedMessage id="classroom.classroom.delete.pop.title" />}
                                                                description={<FormattedMessage id="classroom.classroom.delete.pop.content" />}
                                                                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                                onConfirm={() => handleDeleteClassroom(classroom)}
                                                            >
                                                                <Button style={{ color: 'red' }} type='text' icon={<DeleteOutlined />} >
                                                                    <span>
                                                                        <FormattedMessage id="classroom.classroom.delete.title" />
                                                                    </span>
                                                                </Button>
                                                            </Popconfirm>
                                                        </Access>
                                                    </div>}
                                                    trigger="click"
                                                    open={openPopoverStatus[groupIndex]?.classrooms[classroomIndex]?.classroomStatus}
                                                    onOpenChange={(val: boolean) => handleChangeStatusClassroom(groupIndex, classroomIndex, val)}
                                                >
                                                    <Button type='text' icon={<EllipsisOutlined />} ></Button>

                                                </Popover>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                {user.role.name !== STUDENT && <div style={{ fontSize: 12, color: 'gray' }}><FormattedMessage id="classroom.classroom.quantity" /> {classroom?.userClassrooms?.length || 0}</div>}

                                                <div style={{ fontSize: 12, color: 'gray' }}><FormattedMessage id="classroom.classroom.schoolYear" /> {classroom?.schoolYear?.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div> : <div className={styles['empty-classroom']}>
                            <FormattedMessage id="classroom.classroom.no-info" />
                        </div>
                    }

                </div >
            ))}
            <ModalClassroom setClassroom={setClassroom} classroom={classroom} groupClassroom={groupClassroom} isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} setIsModalOpen={setIsModalOpen} />
        </div >

    )
}

export default ListClassroom