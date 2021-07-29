import React from "react";
import { Container, Row, Col } from "shards-react";
import ForgotPassForm from "./ForgotPassForm";

const Content = () => {
    return (
        <Container fluid className="main-content-container px-4">
            <Row noGutters className="page-header py-4 mt-5">
            </Row>
            <Row>
                <Col lg="4">

                </Col>
                <Col lg="4">
                    <ForgotPassForm />
                </Col>
                <Col lg="4">

                </Col>
            </Row>

        </Container>
    );
}
export default Content;