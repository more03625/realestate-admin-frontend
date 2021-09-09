import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const LoggedInProtected = (props) => {
    const history = useHistory();

    let Component = props.component;

    const isLoggedIn = () => {
        if (!localStorage.getItem('nep-admin-token')) {
            console.log("Token Absent");
            history.push("/login");
        } else {
            console.log(localStorage.getItem('nep-admin-token'))
            if (window.location.pathname === '/admin/login') {
                history.push("/dashboard");
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