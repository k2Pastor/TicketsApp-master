import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {userService} from '../Services/UserService';
import {Menu, Layout, Button} from "antd";
const { Header} = Layout;

class NavBar extends Component<any, any> {
    render() {
        return (
            <Header className="main-header"
                    id="navbar"
            >
                <Menu
                    style={{minWidth: "20vw"}}
                    theme="dark"
                    mode="horizontal">
                    <Menu.Item
                        key="1">
                        <Link to={`/`}
                                className={"navbar-menu-item"}>
                            All Orders
                        </Link>
                    </Menu.Item>
                    {userService.hasRole("Admin") &&
                    <Menu.Item
                        key="2">
                        <Link to={`/products`}
                              className={"navbar-menu-item"}>
                            All Products
                        </Link>
                    </Menu.Item>
                    }
                </Menu>
                <div className="header-button-panel">
                    {!userService.isAuthenticated() &&
                    <Button type="primary" style={{marginRight: "10px"}}>
                        <Link to={`/login`}>
                            <span>Sign In</span>
                        </Link>
                    </Button>
                    }
                    {!userService.isAuthenticated() &&
                    <Button type="primary">
                        <Link to={`/register`}>
                            <span>Sign Up</span>
                        </Link>
                    </Button>
                    }
                    {userService.isAuthenticated() &&
                    <div>
                        <Link to={`/user/${userService.getCredentials()._id}`}>
                            <span>{userService.getCredentials().firstName}</span>
                        </Link>
                        <Button
                            style={{marginLeft: "10px"}}
                            type="primary"
                            onClick={() => {
                                userService.logout();
                            }}
                        >
                            <Link to={`/login`}>
                                <span>Sign Out</span>
                            </Link>
                        </Button>
                    </div>
                    }
                </div>
            </Header>
        );
    }
}

export default withRouter(NavBar);
