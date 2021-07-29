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
const ForgotPassForm = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

    const [loginStatus, setLoginStatus] = useState(false);

    const isValid = () => {
        var emailValidator = new RegExp(
            /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g
        ).test(email);

        if (!emailValidator) {
            setEmailError("Please enter a valid email address!");
        } else {
            return true;
        }
    };

    const submit = (e) => {
        e.preventDefault();
        setEmailError("");
        if (isValid()) {
            let url = Host + Endpoints.ForgotPassword;
            var data = {
                email: email,
                type: "admin",
            }
            Axios.post(url, data, {
                headers: {
                    "Access-Control-Allow-Origin": "http://localhost:3000/"
                }
            }).then((response) => {
                if (response.data.error === true) {
                    errorToast(response.data.title);
                } else {
                    successToast();
                    setTimeout(function () {
                        setLoginStatus(true);
                    }, 1000);
                    
                }
            });
        }
    };


    return (
        <Card small className="mb-4">
            {loginStatus === true && <Redirect to="/login" />}
            <CardHeader className="border-bottom">
                <h6 className="m-0"><img id="main-logo" className="" src={require("../../images/logo/favicon.jpg")} alt="Shards Dashboard" /> Forgot Password!</h6>
            </CardHeader>
            <ListGroup flush>
                <ListGroupItem className="p-3">
                    <Row>
                        <Col>
                            <Form>
                                <Row form>
                                    {/* First Name */}
                                    <Col md="12" className="form-group">
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
                                </Row>
                                <Button theme="accent" onClick={submit}>Forgot Password</Button>
                                <p class="d-inline float-right"><a href="login">Back to Login</a> </p>
                            </Form>
                        </Col>
                    </Row>
                </ListGroupItem>
            </ListGroup>
            <ToastContainer />
        </Card>
    );
}


export default ForgotPassForm;