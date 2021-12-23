import React, {Component} from 'react';
import {userService} from "../Services/UserService";
import axiosInstance from "../Auth/AxiosInstance";
import {OrderModel} from "@pavo/shared-services-shared/src";
import {Card, Col, Row} from "antd";
import {Link} from "react-router-dom";
import {api_url} from "../environment";


class UserPage extends Component<any, {user: any, orders: OrderModel[]}> {
    constructor(props: unknown) {
        super(props);
        this.state = {
          user: null,
            orders: null,
        };
    }

    async componentDidMount() {
        const { match: { params } } = this.props;
        const user = (await axiosInstance.post(`/user/getUser`, {
          id: params.id,
        }, {
          headers: { 'Authorization':  userService.getCredentials().token}
        })).data;
        this.setState({
            user,
        });
        const orders = (await axiosInstance.get(`/orders/getMyOrders`, {
            headers: { 'Authorization': userService.getCredentials().token}
        })).data;
        this.setState({
            orders,
        });
        console.log(orders);
    }

    render() {
        const {user} = this.state;
        if(user === null) return <p>Loading ...</p>;
        return (
          <div className="container">
          <div className="row">
            <div className="jumbotron col-12">
              <h1 className="display-3">{user.firstName} {user.lastName}</h1>
              <p className="lead">Phone: {user.phone}</p>
              <p className="lead">Email: {user.email}</p>
              <p className="lead">Role: {user.role}</p>
            </div>
          </div>
              <div className="orders-page-cards-container">
                  <h3 className="lead">User orders</h3>
                  <Row gutter={16}>
                      {this.state.orders === null && <p>Loading orders... </p>}
                      {
                          this.state.orders && this.state.orders.map(order => (
                              <Col span={6}
                                   style={{paddingBottom: "10px"}}
                                   key={order._id}
                              >
                                  <Card title={order.product?.title}
                                        extra={<Link to={`/order/${order._id}`}>More</Link>}
                                        cover={
                                            order.product?.fileName &&
                                            <img
                                                style={{maxWidth: "100%", maxHeight: "100%", padding: "10px"}}
                                                alt=""
                                                src={`${api_url}/static/${order.product?.fileName}`}
                                            />
                                        }
                                        style={{ width: 300 }}>
                                      <p>{order.product?.description}</p>
                                      <b>Price: {order.product?.price}</b>
                                  </Card>
                              </Col>
                          ))
                      }
                  </Row>
              </div>
        </div>
        )
    }
}

export default UserPage;
