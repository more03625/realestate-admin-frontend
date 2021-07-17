
import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
} from "shards-react";
import PageTitle from "../components/common/PageTitle";



const Dashboard = () => {

    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title="Dashboard"
                    subtitle="Dashboard"
                    className="text-sm-left"
                />
            </Row>

            <Row>
                <Col>
                    <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">dashboard</h6>
                        </CardHeader>

                    </Card>
                </Col>
            </Row>

        </Container>
    );
};

export default Dashboard;
