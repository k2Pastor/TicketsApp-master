import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {userService} from "../Services/UserService";

export const PrivateRoute = ({component, isAuthenticated, ...rest}: any) => {
    const routeComponent = (props: any) => (
        userService.isAuthenticated()
            ? React.createElement(component, props)
            : <Redirect to={{pathname: '/login'}}/>
    );
    return <Route {...rest} render={routeComponent}/>;
};
