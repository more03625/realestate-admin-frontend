import React from 'react';
import {
    Container,
    Row,
    Col, Card, CardHeader, CardBody

} from "shards-react";
import { capitalize, errorStyle, FrontEndURL, errorToast, successToast } from '../../helper/comman_helpers';
import PageTitle from "../../components/common/PageTitle";
import { ToastContainer } from 'react-toastify';

import { Link } from 'react-router-dom';
const Content = ({ allSettings }) => {
    console.log(allSettings)


    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title="Manage Settings"
                    subtitle="Settings CRUD"
                    className="text-sm-left"
                />
            </Row>
            <ToastContainer />

            <Row>
                <Col>
                    <Card small className="mb-4">

                        <CardBody className="p-0 pb-3 m-2">
                            <table id="subCategoryTable" className="table mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th scope="col" className="border-0">
                                            Sr.
                                        </th>
                                        <th scope="col" className="border-0">
                                            Name
                                        </th>
                                        {
                                            /*
                                             <th scope="col" className="border-0">
                                            Status
                                        </th>
                                            */
                                        }
                                        <th scope="col" className="border-0">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allSettings && allSettings.map((value, index) => (
                                        <tr key={value.id}>
                                            <td>{index + 1}</td>

                                            <td><Link target="_blank" to="#" onClick={() => window.open(`${FrontEndURL + value.slug}`)}>{value.title}</Link></td>
                                            {/*

                                            <td>
                                                {value.status === "active" ? (
                                                    <span style={{ color: "green" }}>
                                                        {capitalize(value.status)}
                                                    </span>
                                                ) : (
                                                    <span style={errorStyle}>
                                                        {capitalize('Inactive')}
                                                    </span>
                                                )}
                                            </td>
                                                */}

                                            <td>
                                                {/*
<button type="button" className="btn btn-warning mr-1">
                                                    <i className="material-icons">build</i>
                                                </button>
                                                */}
                                                <button type="button" className="btn btn-success" onClick={() => window.location.href = `settings/${value.slug}`}>
                                                    <i className="material-icons">edit</i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
export default Content;