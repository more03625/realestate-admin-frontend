import React from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
    if (localStorage.getItem("token") !== null) {
        localStorage.removeItem('token');
        return <Redirect to="/login" />
    } else {
        return <Redirect to="/login" />
    }
}
export default Logout;