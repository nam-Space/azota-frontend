import { CloseOutlined } from '@ant-design/icons'
import { ProForm } from '@ant-design/pro-components'
import { Button, Input, message, notification } from 'antd'
import React, { useState } from 'react'
import styles from './addNewGroup.module.scss'
import { callCreateGroup } from '@/config/api'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchGroup } from '@/redux/slice/groupSlide'
import { FormattedMessage, useIntl } from 'react-intl'

const AddNewGroup = ({ setOpenFormAddNewGroup }: any) => {
    const intl = useIntl()
    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.account.user)

    const [groupName, setGroupName] = useState('')

    const handleAddNewGroup = async () => {
        const res = await callCreateGroup(groupName)
        if (res.data) {
            message.success("Thêm nhóm lớp thành công");
            setOpenFormAddNewGroup(false)
            dispatch(fetchGroup({ query: `page=1&limit=500&filter.createdBy=$eq:${user.id}&relations=classrooms.group,classrooms.schoolYear,classrooms.classroomExercises,classrooms.userClassrooms&sort=updatedAt-DESC` }))
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }

    return (
        <ProForm
            submitter={
                {
                    render: () => <></>
                }
            }
        >
            <div className={styles['search-item']}>
                <Input placeholder={intl.messages['classroom.create.modal.group.input-group.placeholder'] as string} value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                <Button type='primary' onClick={handleAddNewGroup}><FormattedMessage id='classroom.create.modal.group.submit' /></Button>
                <Button onClick={() => {
                    setOpenFormAddNewGroup(false);
                    setGroupName('')
                }} icon={<CloseOutlined style={{ color: '#64748B' }} />} style={{ background: '#EAEFF4', padding: '8px 12px', display: 'flex', justifyContent: 'center' }}></Button>
            </div>
        </ProForm>
    )
}

export default AddNewGroup