import React, {Component} from 'react';
import axiosInstance from "../Auth/AxiosInstance";
import {Button, Form, FormInstance, Input, Upload} from "antd";
import { InboxOutlined } from '@ant-design/icons';
import {withRouter} from "react-router-dom";

interface NewCompanyState {
    disabled: boolean;
    title: string;
    description: string;
    //price: number;
    //participantsAmount: number;
    fileName: string;
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

class NewCompany extends Component<any, NewCompanyState> {
    formRef = React.createRef<FormInstance>();

    constructor(props: unknown) {
        super(props);

        this.state = {
            disabled: false,
            title: '',
            description: '',
            fileName: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    normFile(e: any): any {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    uploadImage(options: any): void {
        const {onSuccess, onError, file, onProgress} = options;

        const fmData = new FormData();
        const config = {
            headers: {"content-type": "multipart/form-data"},
            onUploadProgress: (event: { loaded: number; total: number; }) => {
                onProgress({percent: (event.loaded / event.total) * 100});
            }
        };
        fmData.append("file", file);
        try {
            axiosInstance.post(
                "/upload/img",
                fmData,
                config
            ).then((response) => {
                this.setState({fileName: response.data.fileName});
                onSuccess("Ok");
            }, (error) => {
                onError({error});
            });
        } catch (err) {
            onError({err});
        }
    };

    handleSubmit(e: NewCompanyState): void {
        this.setState({
            disabled: true,
        });
        const request = {...this.state, ...e};
        axiosInstance.post(`/companies/addCompany`, request).then((_result) => {
            this.props.history.push('/companies');
        });
    }

    render() {
        return (
            <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                <h2 style={{paddingBottom: "15px"}}>New Company</h2>
                <Form {...layout}
                      ref={this.formRef}
                      name="control-ref"
                      className="login-form"
                      style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "50%",
                          paddingRight: "12%"
                      }}
                      onFinish={this.handleSubmit}>
                    <Form.Item name="title" label="Title" rules={[
                        {
                            required: true,
                            message: "Please, input title!"
                        }]}>
                        <Input id={"newCompanyTitleInput"}/>
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input id={"newCompanyDescriptionInput"}/>
                    </Form.Item>
                    <Form.Item label="Image">
                        <Form.Item name="image" valuePropName="fileList" getValueFromEvent={this.normFile} noStyle>
                            <Upload.Dragger name="files"
                                            accept={".img,.jpg,.png,.jpeg"}
                                            multiple={false}
                                            listType={"picture-card"}
                                            customRequest={this.uploadImage}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" id={"newCompanySubmit"} htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default withRouter(NewCompany);
