import React, { useState } from 'react';
import 'antd/dist/antd.css';
import {Form, Input, Button} from 'antd';
import ImageUpload from "./ImageUpload";
import './style.css'

const InputProject = (props) => {
    const { projectNameValue, onChange } = props;

    return (
        <Input value={projectNameValue} onChange={onChange} />
    )
}
const InputDesc = (props) => {
    const { descValue, onChange } = props;

    return (
        <Input value={descValue} onChange={onChange} />
    )
}

const AddProjectForm = (props) => {
    const [form] = Form.useForm();
    const { onSubmit } = props;
    const [ projectNameValue, setProjectNameValue ] = useState('');
    // const [ iconLinkValue, setIconLinkValue ] = useState('');
    const [ descValue, setDescValue ] = useState('');

    const postData = (values, url) => {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader("Content-type", "application/json");
        httpRequest.send(JSON.stringify(values));
        return httpRequest;
    }

    const addProject = (values) => {
        const httpRequest = postData(values, 'http://localhost:3000/api/base');

        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4 && httpRequest.status === 200) {
                console.log('成功')
            } else {
                console.log('失败')
            }
        };

        console.log(httpRequest);
    }

    const onFinish = (values) => {
        // const data = {
        //     name: projectNameValue,
        //     desc: descValue
        // }
        // const json = JSON.stringify(data);

        // const httpRequest = new XMLHttpRequest();
        // httpRequest.open('POST', "http://192.168.31.179:3000/api/base", true);
        // httpRequest.setRequestHeader("Content-type", "application/json");
        // httpRequest.send(json);
        // console.log("over");
        //
        // httpRequest.onreadystatechange = () => {
        //     if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        //         console.log("项目上传成功！");
        //     } else {
        //         console.log("项目上传失败！");
        //     }
        // };
        // fetch('http://localhost:8080/api/base', {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(data)})

        addProject(values);
        onCancel();
    };

    const onCancel = () => {
        onSubmit();
        // form.resetFields();
        // setProjectNameValue('');
        // // setIconLinkValue('');
        // setDescValue('');
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onProjectChange = (e) => {
        setProjectNameValue(e.target.value);
    }
    const onIconChange = (info) => {
        // setIconLinkValue(info.file.originFileObj);
    }
    const onDescChange = (e) => {
        setDescValue(e.target.value);
    }

    return (
        <div className="form-container">
            <div className="form-title">
                创建项目
            </div>
            <Form
                className="form-form"
                name="basic"
                form={form}
                labelCol={{
                    span: 5,
                }}
                wrapperCol={{
                    span: 16,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    className="form-item"
                    label="项目名称"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: '请输入项目名称',
                        },
                    ]}
                >
                    <InputProject projectNameValue={projectNameValue} onChange={onProjectChange}/>
                </Form.Item>

                <Form.Item
                    className="form-item"
                    label="项目简介"
                    name="desc"
                    rules={[
                        {
                            required: true,
                            message: '请输入项目简介',
                        },
                    ]}
                >
                    <InputDesc descValue={descValue} onChange={onDescChange} />
                </Form.Item>

                <Form.Item
                    className="form-item"
                    label="封面图片"
                    name="icon"
                    rules={[
                        {
                            required: true,
                            message: '请上传图片',
                        }
                    ]}
                >
                    {/*<InputIcon iconLinkValue={iconLinkValue} onChange={onIconChange} />*/}
                    <ImageUpload onChange={onIconChange} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                    <Button  htmlType="button" onClick={onCancel}>
                        取消
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddProjectForm;