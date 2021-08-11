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
    const [costData, setCostData] = useState([]);
    const [costDataError, setCostDataError] = useState([]);
    const [chargesModal, setChargesModal] = useState(false);
    const [runUseEffect, setRunUseEffect] = useState(false);


    const handleStatusClose = () => setshowStatusModal(false);
    const handleAddChargesModalClose = () => setChargesModal(false);
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
    }, [runUseEffect])

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
                setRunUseEffect(!runUseEffect);

                setshowStatusModal(false);
            }
        });
    };

    const changeStatusModal = index => {
        setRequiredItem(index); // set Index
        setshowStatusModal(true); // Open Modal
    };
    var modalData = (requiredItem != undefined && requiredItem !== null) ? properties[requiredItem] : '';
    console.log(modalData);
    const redirectToView = (propertySlug, propertyID) => {
        var url = `${FrontEndURL}property/${propertySlug}/${propertyID}`;
        window.open(url)
    }
    const redirectToEdit = (propertySlug, propertyID) => {
        var url = `${FrontEndURL}edit-property/${propertySlug}/${propertyID}`;
        window.open(url)
    }


    const isValidCharges = () => {
        if (costData.admin_cost === '' || costData.admin_cost === null || costData.admin_cost === undefined) {
            setCostDataError({ 'admin_cost': "Please enter valid amount" })
        } else {
            return true;
        }
    }

    const addCharges = async () => {
        Object.assign(costData, { id: modalData.id });
        if (isValidCharges()) {
            var url = Host + Endpoints.addAdminCost
            const result = await Axios.post(url, costData, {
                headers: {
                    token: `${getUserToken().token}`,
                }
            });
            if (result.data.error === true) {
                errorToast(result.data.title)
            } else {

                successToast(result.data.title);
                setChargesModal(false);
                setRunUseEffect(!runUseEffect);

            }

        } else {
            console.log('There are some errors@')
        }
    }

    const addChargesModal = index => {
        setRequiredItem(index); // set Index
        setChargesModal(true); // Open Modal
    }
    const handleOnChange = (e) => {
        setCostData({ ...costData, [e.target.name]: e.target.value });
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
                                                            className="btn btn-warning mr-1"
                                                            onClick={() => addChargesModal(index)}
                                                        >
                                                            <i className="material-icons">attach_money</i>
                                                        </Link>


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


                <Modal show={chargesModal} onHide={handleAddChargesModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Charges</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <label htmlFor="feInputAddress">Enter Amount</label>
                            <FormInput id="feInputAddress" placeholder="Please enter your charges" name="admin_cost" onChange={(e) => handleOnChange(e)}
                                defaultValue={modalData && modalData.admin_cost != undefined ? modalData.admin_cost : ''} />
                            <p style={errorStyle}>{costDataError.admin_cost}</p>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleAddChargesModalClose}>
                            Close
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => addCharges()}
                        >
                            Add Charges
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        </>
    );
}
export default Content;