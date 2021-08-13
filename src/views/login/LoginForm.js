import React, { useState, useEffect } from "react";

import {
    Card,
    CardHeader,
    ListGroup,
    ListGroupItem,
    Row,
    Col,
    Form,

    FormInput,

    Button
} from "shards-react";
import {
    capitalize,
    Host,
    Endpoints,
    successToast,
    errorToast,
    errorStyle
} from "../../helper/comman_helpers";
import Axios from 'axios';
import { ToastContainer } from "react-toastify";
import { Redirect } from "react-router-dom";
const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");


    const [loginStatus, setLoginStatus] = useState(false);
    const [loginButtonStatus, setLoginButtonStatus] = useState(false);

    const isValid = () => {
        var emailValidator = new RegExp(
            /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g
        ).test(email);

        if (!emailValidator && password === "") {
            setEmailError("Please enter a valid email address!");
            setPasswordError("Please enter your password!");

        } else if (!emailValidator) {
            setEmailError("Please enter a valid email address!");
        } else if (password === "") {
            setPasswordError("Please enter your password!");
        } else {
            return true;
        }
    };

    const login = (e) => {
        e.preventDefault();

        setEmailError("");
        setPasswordError("");

        if (isValid()) {
            let url = Host + Endpoints.Login;
            var data = {
                email: email,
                password: password,

                type: "admin",
            }
            Axios.post(url, data, {
                headers: {
                    "Access-Control-Allow-Origin": "http://localhost:3000/"
                }
            }).then((response) => {
                if (response.data.error === true) {
                    errorToast(response.data.title);
                    setLoginButtonStatus(true);
                    setTimeout(function () {
                        setLoginButtonStatus(false);
                        setLoginStatus(response.data.title);
                    }, 3000);
                } else {
                    successToast();
                    setTimeout(function () {
                        setLoginStatus(true);
                    }, 1000);
                    localStorage.setItem("token", JSON.stringify(response.data));
                }
            });
        }
    };


    return (
        <Card small className="mb-4">
            {loginStatus === true && <Redirect to="/dashboard" />}

            <CardHeader className="border-bottom">
                <h6 className="m-0"><img id="main-logo" style={{height:70}} className="" src={require("../../images/logo/logo.png")} alt="Shards Dashboard" /> Login To Neprealestate!</h6>
            </CardHeader>
            <ListGroup flush>
                <ListGroupItem className="p-3">
                    <Row>
                        <Col>
                            <Form>
                                <Row form>
                                    {/* First Name */}
                                    <Col md="12" style={{marginBottom:0 }} className="form-group">
                                        <label htmlFor="feEmail">Email</label>
                                        <FormInput
                                            type="email"
                                            name="email"
                                            id="feEmail"
                                            placeholder="Email Address"
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                        />
                                        <p style={errorStyle}>{emailError}</p>


                                    </Col>
                                    {/* Password */}
                                    <Col md="12" className="form-group">
                                        <label htmlFor="fePassword">Password</label>
                                        <FormInput
                                            type="password"
                                            name="password"
                                            id="fePassword"
                                            placeholder="Password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                        />
                                        <p style={errorStyle}>{passwordError}</p>

                                    </Col>
                                </Row>
                                <Button theme="accent" onClick={login}>Login</Button>
                                <p class="d-inline float-right"><a href="forgot-password">Forgot Password?</a> </p>
                            </Form>
                        </Col>
                    </Row>
                </ListGroupItem>
            </ListGroup>
            <ToastContainer />
        </Card>
    );
}

// LoginForm.propTypes = {
//     /**
//      * The component's title.
//      */
//     title: PropTypes.string
// };

// LoginForm.defaultProps = {
//     title: "Login To Neprealestate!"
// };

export default LoginForm;
