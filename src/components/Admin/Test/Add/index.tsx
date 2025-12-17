import React, { useState } from 'react'
import styles from './add.module.scss'
import { Button, Checkbox, Col, Collapse, Row, notification } from 'antd'
import dynamic from 'next/dynamic';
import type { CollapseProps } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import SettingTest from './Setting';
import { useAppSelector } from '@/redux/hooks';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface IQuestion {
    name: string;
}

interface IAnswer {
    index?: number;
    name: string;
    isCorrect: boolean;
}

const AddingTest = () => {
    const theme = useAppSelector(state => state.theme.name)
    const [changeToSetting, setChangeToSetting] = useState(false)

    const [arrValueQuestion, setArrValueQuestion] = useState<Array<IQuestion>>([])

    const [listArrValueAnswer, setListArrValueAnswer] = useState<Array<Array<IAnswer>>>([])
    const [arrFormAnswer, setArrFormAnswer] = useState<Array<IAnswer>>([])
    const [arrAction, setArrAction] = useState<Array<string>>([])

    const handleSubmitAnswer = (indexQuestion: number) => {
        if (arrAction[indexQuestion] === 'CREATE') {
            const newListArrValueAnswer = [...listArrValueAnswer]
            newListArrValueAnswer[indexQuestion].push({ ...arrFormAnswer[indexQuestion] })
            setListArrValueAnswer([...newListArrValueAnswer])

            const newArrFormAnswer = [...arrFormAnswer]
            newArrFormAnswer[indexQuestion].name = ''
            newArrFormAnswer[indexQuestion].isCorrect = false
            setArrFormAnswer([...newArrFormAnswer])
        }

        else {
            const indexAnswer = arrFormAnswer[indexQuestion].index as number
            const newListArrValueAnswer = [...listArrValueAnswer]
            newListArrValueAnswer[indexQuestion][indexAnswer].name = arrFormAnswer[indexQuestion].name
            newListArrValueAnswer[indexQuestion][indexAnswer].isCorrect = arrFormAnswer[indexQuestion].isCorrect
            setListArrValueAnswer([...newListArrValueAnswer])

            const newArrFormAnswer = [...arrFormAnswer]
            newArrFormAnswer[indexQuestion].name = ''
            newArrFormAnswer[indexQuestion].isCorrect = false
            delete newArrFormAnswer[indexQuestion].index
            setArrFormAnswer([...newArrFormAnswer])

            const newArrAction = [...arrAction]
            newArrAction[indexQuestion] = 'CREATE'
            setArrAction([...newArrAction])
        }
    }

    const onChange = (key: string | string[]) => {
        // console.log(key);
    };

    const handleChangeValueQuestion = (value: string, indexQuestion: number) => {
        const newArrValueQuestion = [...arrValueQuestion]
        newArrValueQuestion[indexQuestion].name = value
        setArrValueQuestion([
            ...newArrValueQuestion,
        ])
    }

    const handleAddQuestion = () => {
        setArrValueQuestion([
            ...arrValueQuestion,
            {
                name: ''
            }
        ])
        setArrFormAnswer([
            ...arrFormAnswer,
            {
                name: '',
                isCorrect: false
            }
        ])
        setListArrValueAnswer([
            ...listArrValueAnswer,
            []
        ])

        setArrAction([
            ...arrAction,
            'CREATE'
        ])
    }


    const handleChangeValueAnswer = (value: string, indexQuestion: number) => {
        const newArrFormAnswer = [...arrFormAnswer]
        newArrFormAnswer[indexQuestion].name = value
        setArrFormAnswer([
            ...newArrFormAnswer
        ])
    }

    const handleChangeStatus = (value: boolean, indexQuestion: number) => {
        const newArrFormAnswer = [...arrFormAnswer]
        newArrFormAnswer[indexQuestion].isCorrect = value
        setArrFormAnswer([
            ...newArrFormAnswer
        ])
    }

    const handleUpdateAnswer = (indexQuestion: number, indexAnswer: number) => {
        const newArrAction = [...arrAction]
        newArrAction[indexQuestion] = 'UPDATE'
        setArrAction([...newArrAction])

        const newArrFormAnswer = [...arrFormAnswer]
        newArrFormAnswer[indexQuestion].index = indexAnswer;
        newArrFormAnswer[indexQuestion].name = listArrValueAnswer[indexQuestion][indexAnswer].name
        newArrFormAnswer[indexQuestion].isCorrect = listArrValueAnswer[indexQuestion][indexAnswer].isCorrect
        setArrFormAnswer([...newArrFormAnswer])
    }

    const handleCancelUpdateAnswer = (indexQuestion: number) => {
        const newArrAction = [...arrAction]
        newArrAction[indexQuestion] = 'CREATE'
        setArrAction([...newArrAction])

        const newArrFormAnswer = [...arrFormAnswer]
        newArrFormAnswer[indexQuestion].name = ''
        delete newArrFormAnswer[indexQuestion].index
        newArrFormAnswer[indexQuestion].isCorrect = false
        setArrFormAnswer([...newArrFormAnswer])
    }

    const handleDeleteAnswer = (indexQuestion: number, indexAnswer: number) => {
        let newListArrValueAnswer = [...listArrValueAnswer]
        newListArrValueAnswer[indexQuestion] = newListArrValueAnswer[indexQuestion].filter((valAnswer, index) => {
            return indexAnswer !== index
        })
        setListArrValueAnswer(newListArrValueAnswer)

        handleCancelUpdateAnswer(indexQuestion)
    }

    const handleChangeToSetting = () => {
        if (arrValueQuestion.length > 0) {
            for (let i = 0; i < listArrValueAnswer.length; i++) {
                if (listArrValueAnswer[i].length <= 0) {
                    notification.error({
                        message: "Có lỗi xảy ra",
                        description: `Vui lòng thêm đáp án câu ${i + 1}`,
                        duration: 5
                    })
                    return
                }
            }
            setChangeToSetting(true)
        }
        else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: `Vui lòng thêm câu hỏi`,
                duration: 5
            })
        }
    }

    return (
        <div>
            {changeToSetting ? <SettingTest arrValueQuestion={arrValueQuestion} listArrValueAnswer={listArrValueAnswer} /> : <>
                <div className={styles['adding-container']}>
                    <h2 className={styles['heading-title']}>Tạo câu hỏi</h2>
                    <Row gutter={[0, 30]}>
                        {arrValueQuestion.map((valueQuestion, indexQuestion) => (
                            <Col key={indexQuestion} span={24}>
                                <div className={styles['task-item']}>
                                    <div>
                                        <h3>Câu {indexQuestion + 1}:</h3>
                                        <ReactQuill
                                            style={{ marginTop: 10 }}
                                            theme="snow"
                                            value={valueQuestion.name}
                                            onChange={(value) => handleChangeValueQuestion(value, indexQuestion)}
                                        />
                                    </div>
                                    <div style={{ marginTop: 20 }}>
                                        {listArrValueAnswer[indexQuestion].length > 0 && <h3 style={{ marginBottom: 3 }}>Danh sách đáp án</h3>}

                                        <table style={{ width: '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th>Đáp án</th>
                                                    <th>Trạng thái</th>
                                                    <th>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    listArrValueAnswer[indexQuestion].map((valueAnswer, indexAnswer) => (
                                                        <tr key={indexAnswer} >
                                                            <td style={{ display: 'flex', gap: 3, padding: '6px 0' }}>
                                                                <div style={{ fontWeight: 700 }}>{String.fromCharCode(indexAnswer + 65)}.</div>
                                                                <div dangerouslySetInnerHTML={{
                                                                    __html: valueAnswer.name
                                                                }}>

                                                                </div>
                                                            </td>
                                                            <td>
                                                                {valueAnswer.isCorrect ? <CheckOutlined style={{ color: '#23fc5d', fontSize: 20 }} /> : <CloseOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />}
                                                            </td>
                                                            <td style={{ display: 'flex' }}>
                                                                <div onClick={() => handleUpdateAnswer(indexQuestion, indexAnswer)}>
                                                                    <EditOutlined
                                                                        style={{
                                                                            fontSize: 20,
                                                                            color: '#ffa500',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        type=""
                                                                    />
                                                                </div>
                                                                <div onClick={() => handleDeleteAnswer(indexQuestion, indexAnswer)}>
                                                                    <DeleteOutlined
                                                                        style={{
                                                                            fontSize: 20,
                                                                            color: '#ff4d4f',
                                                                            cursor: "pointer",
                                                                            margin: "0 10px"
                                                                        }}
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>

                                    </div>
                                    <div style={{ marginTop: 20 }}>
                                        <Collapse bordered={false} items={[
                                            {
                                                key: '1',
                                                label: `${arrAction[indexQuestion] === 'CREATE' ? 'Thêm mới đáp án' : "Sửa đáp án"}`,
                                                children: (
                                                    <div>
                                                        <ReactQuill
                                                            style={{ background: 'white' }}
                                                            theme="snow"
                                                            value={arrFormAnswer[indexQuestion].name}
                                                            onChange={(value) => handleChangeValueAnswer(value, indexQuestion)}
                                                        />
                                                        <div style={{ marginTop: 8 }}>
                                                            <Checkbox checked={arrFormAnswer[indexQuestion].isCorrect} onChange={(e) => handleChangeStatus(e.target.checked, indexQuestion)}>Đáp án đúng</Checkbox>
                                                            <Button style={{ background: theme }} type='primary' onClick={() => handleSubmitAnswer(indexQuestion)}>{arrAction[indexQuestion] === 'CREATE' ? 'Thêm mới đáp án' : "Lưu đáp án"}</Button>
                                                            {arrAction[indexQuestion] === 'UPDATE' && <Button type='default' style={{ marginLeft: 10 }} onClick={() => handleCancelUpdateAnswer(indexQuestion)}>Hủy</Button>}
                                                        </div>
                                                    </div>),
                                            },
                                        ]} defaultActiveKey={['0']} onChange={onChange} />
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <div className={styles['btn-add-question']}>
                        <Button style={{ background: theme }} type='primary' icon={<PlusOutlined />} onClick={handleAddQuestion}>Thêm câu hỏi mới</Button>
                    </div>
                </div>
                <div style={{ marginTop: 20 }}>
                    <Button type='default' style={{ marginRight: 10 }} >Hủy</Button>
                    <Button type='primary' style={{ background: '#68CC00' }} icon={<PlusOutlined />} onClick={handleChangeToSetting}>Tạo đề</Button>
                </div>
            </>}

        </div >
    )
}

export default AddingTest