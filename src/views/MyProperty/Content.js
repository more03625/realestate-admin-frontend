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
    errorToast, errorStyle, convertToSlug, FrontEndURL, cleanObject,
    getUserToken
} from "../../helper/comman_helpers";
import Axios from 'axios';
import { Modal, Button } from "react-bootstrap";
import { propertyStatus } from '../../data/select.json'
import FiltersLogic from '../properties/FiltersLogic';
import PaginationLogic from '../properties/PaginationLogic';
const Content = () => {

    const [requiredItem, setRequiredItem] = useState();
    const [properties, setProperties] = useState();
    const [showStatusModal, setshowStatusModal] = useState(false);
    const [costData, setCostData] = useState([]);
    const [costDataError, setCostDataError] = useState([]);
    const [chargesModal, setChargesModal] = useState(false);

    const [runUseEffect, setRunUseEffect] = useState(false);
    const [currentPage, setCurrentPage] = useState(0) // offset for Ajay
    const [searchOptions, setSearchOptions] = useState();
    const [totalResults, setTotalResults] = useState(0);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);

    const handleStatusClose = () => setshowStatusModal(false);
    const handleAddChargesModalClose = () => setChargesModal(false);
    const location = useLocation();

    const getProperties = async () => {
        setLoading(true);
        if (searchOptions && searchOptions.limit !== undefined) {
            setLimit(searchOptions.limit)
        }


        var defaultSearchData = {
            limit: limit,
            offset: currentPage
        }
        var mergedSearchData = Object.assign(defaultSearchData, searchOptions);
        var url = Host + Endpoints.getProperties + '?myproperty=' + getUserToken().data.id; // For admin
        const result = await Axios.post(url, cleanObject(mergedSearchData));
        setProperties(result.data.data.properties);
        setTotalResults(result.data.data.total);
        setLoading(false);
    }

    useEffect(() => {
        getProperties();
    }, [currentPage, runUseEffect])
    const [status, setStatus] = useState();

    const updateStatus = (id) => {
        var data = {
            id,
            status: status
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
            console.log('There are some errors@');
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
                        <CardHeader className="border-bottom">
                            <FiltersLogic
                                exportData={properties}
                                setCurrentPage={setCurrentPage}
                                setSearchOptions={setSearchOptions}
                                searchOptions={searchOptions}
                                setRunUseEffect={setRunUseEffect}
                                runUseEffect={runUseEffect}
                                status={propertyStatus}
                            />
                        </CardHeader>
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
                                                    <td>
                                                        <Link to="#" onClick={(e) => redirectToView(convertToSlug(value.title), value.id)}>{value.title.slice(0, 46) + "..."}</Link>
                                                    </td>

                                                    <td>{value.name_for_contact}</td>
                                                    <td>{value.number_for_contact}</td>
                                                    <td onClick={() => changeStatusModal(index)} style={{ cursor: "pointer" }}>
                                                        {value.status === 'active' ? (
                                                            <span className="badge badge-success">
                                                                {capitalize(value.status)}
                                                            </span>
                                                        ) : (
                                                            <span className="badge badge-danger">
                                                                {capitalize(value.status)}
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


                                                        {
                                                            getUserToken().data.id !== value.user_id ?

                                                                <Link
                                                                    to="#"
                                                                    type="button"
                                                                    className="btn btn-warning mr-1"
                                                                    onClick={() => addChargesModal(index)}
                                                                >
                                                                    <i className="material-icons">attach_money</i>
                                                                </Link> : ''
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                <PaginationLogic
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    totalResults={totalResults}
                                    limit={limit}
                                    paginationData={properties}
                                    loading={loading}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Modal show={showStatusModal} onHide={handleStatusClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <FormSelect id="feInputState" name="status" defaultValue={modalData && modalData.status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">property status</option>

                                {
                                    propertyStatus.map((value, index) => (
                                        <option value={value}>{capitalize(value)}</option>
                                    ))
                                }

                            </FormSelect>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleStatusClose}>
                            Close
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => updateStatus(modalData.id)}
                        >
                            Update
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