import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {userService} from "../Services/UserService";
import {OrdersState} from "@pavo/shared-services-shared/src";
import axiosInstance from "../Auth/AxiosInstance";
import {Card, Col, Row} from "antd";
import {api_url} from "../environment";

class Orders extends Component<unknown, OrdersState> {
    constructor(props: unknown) {
        super(props);

        this.state = {
            orders: null,
            credentials: null,
        };
    }

    async componentDidMount() {
        axiosInstance.get(`/orders/allOrders`).then((response) => {
            this.setState({
                orders: response.data,
                credentials: userService.getCredentials(),
            });
        });
    }

    render() {
        return (
            <div className="orders-page-cards-container">
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
        )
    }
}

export default Orders;
