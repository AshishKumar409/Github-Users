import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const PrivateRoute = ({children,...rest}) => {
  let {isAuthenticated,user} = useAuth0()
  let isUser = isAuthenticated && user
  return <Route {...rest} render={()=>{
    return isUser ? children : <Redirect to="/login"/>
  }} ></Route>;
};
export default PrivateRoute;
