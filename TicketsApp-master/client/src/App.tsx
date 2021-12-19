import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import NavBar from './NavBar/NavBar';
import OrdersListPage from './Orders/OrdersListPage';
import OrderDetailsPage from './OrderDetails/OrderDetailsPage';
import LoginPage from './LoginPage/LoginPage'
import { PrivateRoute } from './Auth/PrivateRoute';
import UserPage from './UserPage/UserPage'
import MyOrders from './Orders/MyOrders'
import {RegistrationForm} from "./Registration/RegistrationForm";
import ProductsListPage from "./Products/ProductsListPage";
import NewProduct from "./Products/NewProduct";
import {Layout} from "antd";

const {Content, Footer} = Layout;

class App extends Component {
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <NavBar/>
        <Content style={{ padding: '30px 50px 0px 50px', overflow: "auto" }}>
            <PrivateRoute path='/myTickets' component={MyOrders}/>
            <Route exact path='/' component={OrdersListPage}/>
            <Route exact path='/order/:id' component={OrderDetailsPage}/>
            <Route path="/login" component={LoginPage} />
            <PrivateRoute path='/newProduct' component={NewProduct} />
            <PrivateRoute path='/user/:id' component={UserPage}/>
            <PrivateRoute path='/products' component={ProductsListPage}/>
            <Route path="/register" component={RegistrationForm} />
            {/* <Route exact path='/user' component={User}/> */}
        </Content>
        <Footer style={{ textAlign: 'center' }}>Together Cheaper ©2021</Footer>
      </Layout>
    );
  }
}

export default App;
