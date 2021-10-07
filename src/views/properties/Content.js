import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormGroup, FormSelect
} from "shards-react";

import { Link, useLocation } from "react-router-dom";
import { propertyStatus } from '../../data/select.json'
import PageTitle from "../../components/common/PageTitle";
import { ToastContainer } from 'react-toastify';
import {
    capitalize,
    Host,
    Endpoints,
    successToast,
    errorToast, errorStyle, convertToSlug, FrontEndURL,
    getUserToken, cleanObject, exportToCSV, rowsLimit
} from "../../helper/comman_helpers";
import Axios from 'axios';
import { Modal, Button } from "react-bootstrap";
import PaginationLogic from './PaginationLogic';
import FiltersLogic from './FiltersLogic';

const Content = () => {

    const [requiredItem, setRequiredItem] = useState();
    const [properties, setProperties] = useState([]);
    const [showStatusModal, setshowStatusModal] = useState(false);
    // PAGINATIO & FILTER
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(0) // offset for Ajay
    const [searchOptions, setSearchOptions] = useState();
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(rowsLimit);
    const [runUseEffect, setRunUseEffect] = useState(false);
    const handleStatusClose = () => setshowStatusModal(false);

    const location = useLocation();

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
        var url = Host + Endpoints.getProperties + "?id=1"; // For admin
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

    const redirectToView = (propertySlug, propertyID) => {
        var url = `${FrontEndURL}property/${propertySlug}/${propertyID}?isadmin=1`;
        window.open(url)
    }
    const redirectToEdit = (propertySlug, propertyID) => {
        var url = `${FrontEndURL}edit-property/${propertySlug}/${propertyID}?isadmin=1`;
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
                        <CardHeader className="border-bottom">
                            <FiltersLogic // My custom Package
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
                                                    <td>{limit * currentPage + (index + 1)}</td>
                                                    <td>
                                                        <Link to="#" onClick={(e) => redirectToView(value.title === null ? 'draft' : convertToSlug(value.title), value.id)}>
                                                            {value.title === null ? 'draft' : value.title.slice(0, 46) + "..."}</Link>
                                                    </td>
                                                    {/*onClick={() => changeStatusModal(index)}*/}
                                                    <td>{value.name_for_contact}</td>
                                                    <td>{value.number_for_contact}</td>
                                                    <td style={{ cursor: "pointer" }}>
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
                                                            data-toggle="tooltip" data-placement="top" title={'View property'}
                                                            to="#"
                                                            type="button"
                                                            className="btn btn-info mr-1"
                                                            onClick={(e) => redirectToView(convertToSlug(value.title), value.id)}
                                                        >
                                                            <i className="material-icons">visibility</i>
                                                        </Link>

                                                        <Link
                                                            data-toggle="tooltip" data-placement="top" title={'Edit property'}
                                                            to="#"
                                                            type="button"
                                                            className="btn btn-success mr-1"
                                                            onClick={(e) => redirectToEdit(convertToSlug(value.title), value.id)}
                                                        >
                                                            <i className="material-icons">edit</i>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                                <PaginationLogic // My custom Package
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

            </Container>
        </>
    );
}
export default Content;