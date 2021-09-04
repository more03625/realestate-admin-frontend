import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormCheckbox,
    FormGroup, FormInput, FormSelect, Alert, NavItem, object
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
    getUserToken, cleanObject, exportToCSV
} from "../../helper/comman_helpers";
import Axios from 'axios';
import { Modal, Button, Spinner } from "react-bootstrap";


const Content = () => {

    const [requiredItem, setRequiredItem] = useState();
    const [properties, setProperties] = useState([]);
    const [showStatusModal, setshowStatusModal] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0) // offset for Ajay
    const [searchOptions, setSearchOptions] = useState();
    const [loading, setLoading] = useState(false);

    const handleStatusClose = () => setshowStatusModal(false);
    const location = useLocation();


    const exportCSV = () => {
        exportToCSV(properties)
    }
    const getProperties = async () => {
        if (searchOptions && searchOptions.limit !== undefined) {
            setLimit(searchOptions.limit)
        }
        setLoading(true);

        var defaultSearchData = {
            limit: limit,
            offset: currentPage
        }
        var mergedSearchData = Object.assign(defaultSearchData, searchOptions);
        var url = Host + Endpoints.getProperties;
        const result = await Axios.post(url, cleanObject(mergedSearchData));
        setProperties(result.data.data.properties);
        setTotalResults(result.data.data.total);
        setLoading(false);
    }

    useEffect(() => {
        getProperties();
    }, [currentPage])
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

    const redirectToView = (propertySlug, propertyID) => {
        var url = `${FrontEndURL}property/${propertySlug}/${propertyID}`;
        window.open(url)
    }
    const redirectToEdit = (propertySlug, propertyID) => {
        var url = `${FrontEndURL}edit-property/${propertySlug}/${propertyID}`;
        window.open(url)
    }
    const handleChange = (e) => {
        setSearchOptions({ ...searchOptions, [e.target.name]: e.target.value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        getProperties();
    }
    const handlePagination = (event) => {
        if (event.target.getAttribute("data-action") === 'next') {
            setCurrentPage(currentPage + 1);
        } else if (event.target.getAttribute("data-action") === 'previous') {
            setCurrentPage(currentPage - 1)
        } else {
            setCurrentPage(Number(event.target.getAttribute("data-page")) - 1)
        }
    }
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalResults / limit); i++) {
        pageNumbers.push(i);
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
                            <h6 className="m-0">
                                <div className="row">
                                    <div className="col-md-1 col-6">
                                        <FormGroup>
                                            <button type="button" className="btn btn-success" onClick={exportCSV}>
                                                Export
                                            </button>
                                        </FormGroup>
                                    </div>

                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 col-6">
                                            <FormGroup>
                                                <FormInput placeholder="Search by property name..." name="search" onChange={(e) => handleChange(e)} />
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-6 col-6">
                                            <FormGroup>
                                                <FormSelect id="feInputState" name="status" onChange={(e) => handleChange(e)}>
                                                    <option value="">property status</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="sold">Sold</option>
                                                    <option value="rented">Rented</option>
                                                </FormSelect>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-6 col-6">
                                            <FormGroup>
                                                <FormSelect id="feInputState" name="limit" onChange={(e) => handleChange(e)}>
                                                    <option value="">Number of rows</option>
                                                    <option value="25">25</option>
                                                    <option value="50">50</option>
                                                    <option value="100">100</option>
                                                    <option value="250">250</option>
                                                    <option value="500">500</option>
                                                </FormSelect>
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 col-6">
                                            <FormGroup>
                                                <button type="submit" className="btn btn-success" >
                                                    Search
                                                </button>
                                                <button type="reset" className="ml-2 btn btn-primary" onClick={() => setSearchOptions('')}>
                                                    Reset
                                                </button>
                                            </FormGroup>
                                        </div>
                                    </div>
                                </form>
                            </h6>
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
                                                    <td>
                                                        {value.status === 'active' ? (
                                                            <span style={{ color: "green" }}>
                                                                {capitalize(value.status)}
                                                            </span>
                                                        ) : (
                                                            <span style={errorStyle}>
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

                                                        <button type="button" className="btn btn-warning mr-1" onClick={() => changeStatusModal(index)}
                                                        ><i className="material-icons">build</i></button>
                                                    </td>
                                                </tr>
                                            ))}

                                    </tbody>

                                </table>
                                <div className="row">
                                    {
                                        loading === true ? (
                                            <div className="col-md-12 d-flex justify-content-center">
                                                <Spinner animation="border" role="status"></Spinner>
                                            </div>
                                        ) : ("")
                                    }
                                </div>
                                <div className="row">
                                    {
                                        properties && properties.length === 0 ? (
                                            <div className="col-md-12 d-flex justify-content-center">
                                                <p className="no-results mt-5">There are no results. try to modify your filter</p>
                                            </div>
                                        ) : ("")
                                    }
                                </div>

                                <div className="row mr-2 mt-5">
                                    <div className="col-md-6 col-6">
                                        <FormGroup>
                                            <p>Showing page {currentPage + 1} With {properties && properties.length} results. ( Total {totalResults} )</p>
                                        </FormGroup>

                                    </div>
                                    <div className="col-md-6 col-6">
                                        <FormGroup>
                                            {
                                                pageNumbers.length > 1 ? (
                                                    <nav aria-label="Page navigation example">
                                                        <ul className="float-right pagination">
                                                            {/*to show previous page we should be on 1st page*/}
                                                            {
                                                                currentPage !== 0 ? (
                                                                    <li className="page-item" onClick={handlePagination} data-page={currentPage - 1} data-action="previous">
                                                                        <Link className="page-link" to={'#'} aria-label="Previous" onClick={handlePagination} data-page={currentPage - 1} data-action="previous">
                                                                            <span aria-hidden="true">&laquo;</span>
                                                                            <span className="sr-only">Previous</span>
                                                                        </Link>
                                                                    </li>
                                                                ) : ("")
                                                            }
                                                            {
                                                                pageNumbers.map((number, index) => {
                                                                    const activeCondition = currentPage + 1 === number ? "active" : "";
                                                                    return (
                                                                        <li className={`page-item ${activeCondition}`} onClick={handlePagination} data-page={number}>
                                                                            <Link className="page-link" to={'#'} onClick={handlePagination} data-page={number}>{number}</Link>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                            {/*To Show next btn we should not be on last page*/}
                                                            {
                                                                currentPage !== pageNumbers.length - 1 ? ( // because of offset is 0
                                                                    <li className="page-item" onClick={handlePagination} data-page={currentPage + 1} data-action="next">
                                                                        <Link className="page-link" to={"#"} aria-label="Next" onClick={handlePagination} data-page={currentPage + 1} data-action="next">
                                                                            <span aria-hidden="true">&raquo;</span>
                                                                            <span className="sr-only">Next</span>
                                                                        </Link>
                                                                    </li>
                                                                ) : ("")
                                                            }
                                                        </ul>
                                                    </nav>
                                                ) : ("")
                                            }
                                        </FormGroup>
                                    </div>
                                </div>
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
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="sold">Sold</option>
                                <option value="rented">Rented</option>
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

            </Container>
        </>
    );
}
export default Content;