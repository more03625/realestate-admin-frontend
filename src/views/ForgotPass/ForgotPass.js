import React from "react";
import {
    Container,
    Row,
    Col,

} from "shards-react";
import MainFooter from "../../components/layout/MainFooter";
import Content from './Content';

const Login = () => {
    return (
        <Container fluid>
            <Row>

                <Col
                    className="main-content p-0"
                    lg={{ size: 12, offset: 0 }}
                    md={{ size: 12, offset: 0 }}
                    sm="12"
                    tag="main"
                >

                    <Content />
                    {<MainFooter />}
                </Col>
            </Row>
        </Container>

    )
};

export default Login;