import React from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
    if (localStorage.getItem("nep-admin-token") !== null) {
        localStorage.removeItem('nep-admin-token');
        return <Redirect to="/login" />
    } else {
        return <Redirect to="/login" />
    }
}
export default Logout;