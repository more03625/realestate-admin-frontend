import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormCheckbox,
    FormGroup, FormInput, FormSelect, Alert, NavItem
} from "shards-react";
import { Link, useLocation } from "react-router-dom";

import PageTitle from "../../components/common/PageTitle";
import { ToastContainer } from 'react-toastify';
import {
    capitalize,
    Host,
    Endpoints,
    successToast,
    errorToast, errorStyle, convertToSlug, FrontEndURL,
    getUserToken
} from "../../helper/comman_helpers";
import Axios from 'axios';
import { Modal, Button } from "react-bootstrap";
import $ from "jquery";



const Content = () => {
    $(document).ready(function () {
        setTimeout(function () {
            $("#propertiesTable").DataTable();
        }, 1000);

    });
    const [requiredItem, setRequiredItem] = useState();
    const [properties, setProperties] = useState();
    const [showStatusModal, setshowStatusModal] = useState(false);
    const handleStatusClose = () => setshowStatusModal(false);
    const location = useLocation();

    const getProperties = async () => {
        var url = Host + Endpoints.getProperties;
        if (location.pathname == '/my-properties') {
            var url = Host + Endpoints.getProperties + '&myproperty=' + getUserToken().data.id;
        }
        var result = await Axios.post(url);
        setProperties(result.data.data.properties);
    }
    useEffect(() => {
        getProperties();
    }, [])

    const updateStatus = (id, status) => {
        var data = {
            id,
            status: status === "active" ? "inactive" : "active"
        };
        var url = Host + Endpoints.updatePropertyStatus;
        Axios.post(url, data, {
            headers: {
                token: `${getUserToken().token}`,
            }
        }).then(response => {
            if (response.data.error === true) {
                errorToast(response.data.title);
            } else {
                successToast(response.data.title);
                getProperties();
                setshowStatusModal(false);
            }
        });
    };

    const changeStatusModal = index => {
        setRequiredItem(index); // set Index
        setshowStatusModal(true); // Open Modal
    };
    var modalData = (requiredItem != undefined && requiredItem !== null) ? properties[requiredItem] : '';

    const redirectToView = (propertySlug, propertyID) => {
        var url = `${FrontEndURL}property/${propertySlug}/${propertyID}`;
        window.open(url)
    }
    const redirectToEdit = (propertySlug, propertyID) => {
        var url = `${FrontEndURL}edit-property/${propertySlug}/${propertyID}`;
        window.open(url)

    }
    return (
        <>
            <Container fluid className="main-content-container px-4">
                {/* Page Header */}
                <Row noGutters className="page-header py-4">
                    <PageTitle
                        sm="4"
                        title="Manage Properties"
                        subtitle="Manage Properties"
                        className="text-sm-left"
                    />
                </Row>
                <ToastContainer />

                <Row>
                    <Col>
                        <Card small className="mb-4">

                            <CardBody className="p-0 pb-3 m-2">
                                <table id="propertiesTable" className="table mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th scope="col" className="border-0">
                                                Sr.
                                            </th>

                                            <th scope="col" className="border-0">
                                                Title
                                            </th>
                                            <th scope="col" className="border-0">
                                                Contact Name
                                            </th>
                                            <th scope="col" className="border-0">
                                                Contact Number
                                            </th>
                                            <th scope="col" className="border-0">
                                                Status
                                            </th>
                                            <th scope="col" className="border-0">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {properties &&
                                            properties.map((value, index) => (
                                                <tr key={value.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{value.title}</td>

                                                    <td>{value.name_for_contact}</td>
                                                    <td>{value.number_for_contact}</td>
                                                    <td>
                                                        {value.status === 'active' ? (
                                                            <span style={{ color: "green" }}>
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span style={errorStyle}>
                                                                InActive
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>


                                                        <Link
                                                            to="#"
                                                            type="button"
                                                            className="btn btn-info mr-1"
                                                            onClick={(e) => redirectToView(convertToSlug(value.title), value.id)}
                                                        >
                                                            <i className="material-icons">visibility</i>
                                                        </Link>

                                                        <Link
                                                            to="#"
                                                            type="button"
                                                            className="btn btn-success mr-1"
                                                            onClick={(e) => redirectToEdit(convertToSlug(value.title), value.id)}
                                                        >
                                                            <i className="material-icons">edit</i>
                                                        </Link>

                                                        <button type="button" className="btn btn-warning mr-1" onClick={() => changeStatusModal(index)}
                                                        ><i className="material-icons">build</i></button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Modal show={showStatusModal} onHide={handleStatusClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to <b>{`${modalData && modalData.status === 'active' ? 'Deactivate' : 'Activate'}`}</b> this property?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleStatusClose}>
                            Close
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => updateStatus(modalData.id, modalData.status)}
                        >
                            {`${modalData && modalData.status === 'active' ? 'Deactivate' : 'Activate'}`}
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        </>
    );
}
export default Content;