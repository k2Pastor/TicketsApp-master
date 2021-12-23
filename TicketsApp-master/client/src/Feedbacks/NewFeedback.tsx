import React, {Component} from 'react';
import axiosInstance from "../Auth/AxiosInstance";
import {Button, Form, FormInstance, Input, Result, Upload} from "antd";
import { InboxOutlined } from '@ant-design/icons';
import {Link, withRouter} from "react-router-dom";
import { SmileOutlined } from '@ant-design/icons';

interface NewFeedbackState {
    disabled: boolean;
    title: string;
    description: string;
    authorId: string;
    fileName: string;
    orderId: string;
    createdSuccessfully: boolean;
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

class NewFeedback extends Component<any, NewFeedbackState> {
    formRef = React.createRef<FormInstance>();

    constructor(props: unknown) {
        super(props);

        this.state = {
            disabled: false,
            title: '',
            description: '',
            authorId: '',
            fileName: "",
            orderId: "",
            createdSuccessfully: false,
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

    handleSubmit(e: NewFeedbackState): void {
        const { match: { params } } = this.props;
        this.setState({
            disabled: true,
            orderId: params.id,
        });
        const request = {...this.state, ...e} as any;
        axiosInstance.post(`/feedbacks/addFeedback`, request).then((_result) => {
            this.setState({
                createdSuccessfully: true,
            });
        });

    }

    render() {
        const {createdSuccessfully} = this.state;
        if (createdSuccessfully) {
            return (
                <Result
                    icon={<SmileOutlined />}
                    title="Great, feedback was successfully submitted!"
                    extra={<Button type="primary">
                        <Link to={`/order/${this.state.orderId}`}>
                            <span> Go Back</span>
                        </Link>
                    </Button>}
                />
            );
        }
        return (
            console.log("this.state.title: " + this.state.title),
            console.log("this.state.description: " + this.state.description),
            <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                <h2 style={{paddingBottom: "15px"}}>New Feedback</h2>
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
                        <Input id={"newFeedbackTitleInput"}/>
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input id={"newFeedbackDescriptionInput"}/>
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
                        <Button type="primary" id={"newFeedbackSubmit"} htmlType="submit">
                            Submit
                        </Button>

                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default withRouter(NewFeedback);
