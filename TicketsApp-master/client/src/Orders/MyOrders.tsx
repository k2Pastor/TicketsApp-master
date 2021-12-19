import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {userService} from "../Services/UserService";
import {OrdersState} from "@pavo/shared-services-shared/src";
import {api_url} from "../environment";
import axiosInstance from "../Auth/AxiosInstance";

class MyOrders extends Component<unknown, OrdersState> {
    constructor(props: unknown) {
        super(props);

        this.state = {
            orders: null,
            credentials: null,
        };
    }

    async componentDidMount() {
        if (userService.hasRole("User")) {
        const orders = (await axios.post(`${api_url}/orders/getMyOrders`, {
             id : userService.getCredentials()._id,
        }, {
          headers: { 'Authorization':  userService.getCredentials().token}
        })).data;

        this.setState({
            orders,
            credentials: userService.getCredentials(),
        });
        }

        else {
            const orders = (await axiosInstance.post(`/orders/getUnassignedUnresolved`, {
                id : userService.getCredentials()._id,
            })).data;

            this.setState({
                orders,
                credentials: userService.getCredentials(),
            });
        }
    }

    render() {
        return (
            <div className="container">
                 { this.state.credentials && this.state.credentials && this.state.credentials.role === 'User' &&
                    <div className= "float-right"> 
                    <Link to='/newTicket'>
                            <button type="button" className="btn btn-primary btn-lg">New ticket</button>
                    </Link>
                    </div>
                }
                <div className="row">
                    {this.state.orders === null && <p>Loading orders... </p>}
                    {
                        this.state.orders && this.state.orders.map(order => (
                            <div key={order._id} className="col-sm-12 col-md-4 col-lg-3">
                            <Link to={`/order/${order._id}`}>
                             <div className={"card text-white bg-success mb-3"}>
                                 <div className="card-header">{order.product.title}</div>
                                 <div className="card-body">
                                     <h2 className="card-title">{order.product.description}</h2>
                                     <h4 className="card-text">{order.product.price}</h4>
                                 </div>
                            </div>
                            </Link>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default MyOrders;
