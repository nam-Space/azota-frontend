import { PlusOutlined } from '@ant-design/icons'
import { ProForm } from '@ant-design/pro-components'
import { Button, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './searchAndCreate.module.scss'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchGroup } from '@/redux/slice/groupSlide'
import ModalClassroom from '../ModalClassroom'
import { IClassroom } from '@/types/backend'
import { STUDENT } from '@/constants/role'
import ModalJoinClassroom from '../ModalClassroom/ModalJoinClassroom'
import Access from '../../Access'
import { ALL_PERMISSIONS } from '@/constants/permission'
import { FormattedMessage, useIntl } from 'react-intl'

const SearchAndCreate = () => {
    const dispatch = useAppDispatch()
    const intl = useIntl()
    const theme = useAppSelector(state => state.theme.name)
    const user = useAppSelector(state => state.account.user)
    const groupClassroom = useAppSelector(state => state.group.result)
    const [classroom, setClassroom] = useState<IClassroom | null>(null)

    const [keyword, setKeyword] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenJoinClassroom, setIsModalOpenJoinClassroom] = useState(false);

    useEffect(() => {
        if (user.id && user.role.name) {
            const roleName = user.role.name
            if (roleName !== STUDENT) {
                if (keyword) {
                    dispatch(fetchGroup({ query: `page=1&limit=500&filter.createdBy=$eq:${user.id}&filter.classrooms.name=$ilike:${keyword}&relations=classrooms.group,classrooms.schoolYear,classrooms.classroomExercises,classrooms.userClassrooms&sort=updatedAt-DESC` }))
                }
                else {
                    dispatch(fetchGroup({ query: `page=1&limit=500&filter.createdBy=$eq:${user.id}&relations=classrooms.group,classrooms.schoolYear,classrooms.classroomExercises,classrooms.userClassrooms&sort=updatedAt-DESC` }))
                }
            }
            else {
                if (keyword) {
                    dispatch(fetchGroup({ query: `page=1&limit=500&filter.classrooms.name=$ilike:${keyword}&filter.classrooms.userClassrooms.userId=$eq:${user.id}&relations=classrooms.group,classrooms.schoolYear,classrooms.classroomExercises,classrooms.userClassrooms&sort=updatedAt-DESC` }))
                }
                else {
                    dispatch(fetchGroup({ query: `page=1&limit=500&filter.classrooms.userClassrooms.userId=$eq:${user.id}&relations=classrooms.group,classrooms.schoolYear,classrooms.classroomExercises,classrooms.userClassrooms&sort=updatedAt-DESC` }))
                }
            }
        }
    }, [keyword, JSON.stringify(user)])

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className={styles['search-create']}>
                <div>
                    <h2 style={{ textAlign: 'left' }}><FormattedMessage id="classroom.search.title" /></h2>
                    <div className={styles['search-item']}>
                        <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={intl.messages['classroom.search.placeholder'] as string} />
                        <Button style={{ background: theme }} type='primary'><span><FormattedMessage id="classroom.search.search" /></span></Button>
                    </div>
                </div>
                {/* {user.role.name !== STUDENT ? (
                    <Button type='primary' className={styles['button-create']} onClick={showModal}><PlusOutlined />Tạo lớp học</Button>
                ) : (<Button type='primary' style={{ background: '#1E40AF' }} onClick={() => setIsModalOpenJoinClassroom(true)}><PlusOutlined />Gia nhập lớp học</Button>)
                } */}
                <div style={{ display: 'flex', gap: 10 }}>
                    <Access permission={ALL_PERMISSIONS.CLASSROOM.CREATE} hideChildren>
                        <Button type='primary' className={styles['button-create']} onClick={showModal}>
                            <PlusOutlined />
                            <span>
                                <FormattedMessage id="classroom.create.title" />
                            </span>
                        </Button>
                    </Access>
                    <Access permission={ALL_PERMISSIONS.USER_CLASSROOM.CREATE} hideChildren>
                        <Button type='primary' style={{ background: '#1E40AF' }} onClick={() => setIsModalOpenJoinClassroom(true)}><PlusOutlined />
                            <span>
                                <FormattedMessage id="classroom.join.title" />
                            </span>
                        </Button>
                    </Access>
                </div>

            </div >
            <ModalClassroom setClassroom={setClassroom} classroom={classroom} groupClassroom={groupClassroom} isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} setIsModalOpen={setIsModalOpen} />
            <ModalJoinClassroom isModalOpenJoinClassroom={isModalOpenJoinClassroom} setIsModalOpenJoinClassroom={setIsModalOpenJoinClassroom} />
        </div>
    )
}

export default SearchAndCreate