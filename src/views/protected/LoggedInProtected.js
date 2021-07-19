import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const LoggedInProtected = (props) => {
    const history = useHistory();

    let Component = props.component;

    const isLoggedIn = () => {
        if (!localStorage.getItem('token')) {
            console.log("Token Absent");
            history.push("/login");
        } else {
            if (window.location.pathname === '/admin/login') {
                history.push("/dashboard");
            }
        }
    }
    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <>
            <Component />
        </>
    );
}

export default LoggedInProtected;