import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";

import LoginForm from "./LoginForm";

const Login = () => {
    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4">
                <PageTitle title="User Profile" subtitle="Overview" md="12" className="ml-sm-auto mr-sm-auto" />
            </Row>
            <Row>
                <Col lg="2">

                </Col>
                <Col lg="8">
                    <LoginForm />
                </Col>
                <Col lg="2">

                </Col>
            </Row>
        </Container>
    );
}
export default Login;