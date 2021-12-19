import React, {ReactElement} from 'react';
import {userService} from '../Services/UserService';
import {DetailedUserModel, RegistrationPageModel} from "@pavo/shared-services-shared/src";
import {Button, Form, FormInstance, Input, InputNumber} from "antd";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export class RegistrationForm extends React.Component<any, RegistrationPageModel> {
    formRef = React.createRef<FormInstance>();

    constructor(props: unknown) {
        super(props);

        userService.logout();

        this.state = {
            password: "",
            firstName: "",
            lastName: "",
            phone: 0,
            email: '',
            submitted: false,
            loading: false,
            error: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e: DetailedUserModel): void {
        this.setState({ ...e, ...{submitted: true } });

        this.setState({ loading: true });
        userService.register(this.state)
        .then(() => {
            this.props.history.push("/")
        });
    }

    render(): ReactElement {
        return (
            <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                <h2 style={{paddingBottom: "15px"}}>Register</h2>
                <Form {...layout}
                      ref={this.formRef}
                      name="control-ref"
                      className="login-form"
                      style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "40%",
                          paddingRight: "10%"
                      }}
                      onFinish={this.handleSubmit}>
                    <Form.Item name="email" label="E-mail" rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: "Please, input your E-mail!"
                        }]}>
                        <Input id={"registerEmail"}/>
                    </Form.Item>
                    <Form.Item name="firstName" label="First Name" rules={[
                        {
                            required: true,
                            message: "Please, input your First Name!"
                        }]}>
                        <Input id={"registerFirstName"}/>
                    </Form.Item>
                    <Form.Item name="lastName" label="Last Name" rules={[
                        {
                            required: true,
                            message: "Please, input your Last Name!"
                        }]}>
                        <Input id={"registerLastName"}/>
                    </Form.Item>
                    <Form.Item name="phone" label="Phone" rules={[
                        {
                            required: true,
                            message: "Please, input your phone!"
                        }]}>
                        <InputNumber id={"registerPhone"} style={{width: "100%"}} />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[
                        {
                            required: true,
                            message: "Please, input your password!"
                        }]}>
                        <Input.Password id={"registerPassword"}/>
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" id={"registerSubmit"} htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

