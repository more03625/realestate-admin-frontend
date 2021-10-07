import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getUserToken } from '../../helper/comman_helpers'

const LoggedInProtected = (props) => {
    const history = useHistory();

    let Component = props.component;

    const isLoggedIn = () => {
        if (!localStorage.getItem('token')) {
            history.push("/login");
        } else {
            if (getUserToken().data.type === 'admin') {
                if (window.location.pathname === '/admin/login') {
                    history.push("/dashboard")
                }
            } else {
                history.push("/login");
            }
        }
    }
    useEffect(() => {
        isLoggedIn();
    }, []); // onChange

    return (
        <>
            <Component />
        </>
    );
}

export default LoggedInProtected;