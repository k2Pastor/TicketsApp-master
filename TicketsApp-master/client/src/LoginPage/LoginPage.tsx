import React, {ReactElement} from 'react';
import {userService} from '../Services/UserService';
import {LoginPageState} from "@pavo/shared-services-shared/src";
import {Button, Form, FormInstance, Input} from "antd";
import {withRouter} from "react-router-dom";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

class LoginPage extends React.Component<any, LoginPageState> {
    formRef = React.createRef<FormInstance>();

    constructor(props: unknown) {
        super(props);
        userService.logout();
        this.state = {
            email: '',
            password: '',
            submitted: false,
            loading: false,
            error: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleSubmit(e: LoginPageState): void {
        // this.setState({ submitted: true });
        const { email, password } = e;
    
        // stop here if form is invalid
        if (!(email && password)) {
            return;
        }

        // this.setState({ loading: true });
        userService.login(email, password)
            .then(
                () => {
                    this.props.history.push('/');
                },
                error => this.setState({ error, loading: false })
            );
    }
    
    render(): ReactElement {
        return (
            <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                <h2 style={{paddingBottom: "15px"}}>Login</h2>
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
                        <Input id="loginEmail" />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[
                        {
                            required: true,
                            message: "Please, input your password!"
                        }]}>
                        <Input.Password id="loginPassword" />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit" id="loginSubmit">
                            Log In
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            );
        }
    }
    
export default withRouter(LoginPage);
