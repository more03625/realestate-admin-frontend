import React, { useState, useEffect } from 'react'
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormCheckbox,
    FormGroup,
    FormInput,
    FormSelect
} from "shards-react";
import Axios from 'axios';
import { Endpoints, errorToast, Host, errorStyle, getUserToken, successToast } from '../../../helper/comman_helpers';

import { ToastContainer } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
import PageTitle from '../../../components/common/PageTitle';

export default function Content() {
    const [areaAddress, setAreaAddress] = useState([]);
    const [areaAddressData, setAreaAddressData] = useState([]);
    const [areaAddressError, setAreaAddressError] = useState([]);
    const [show, setShow] = useState(false);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [cities, setCities] = useState([]);

    // Edit
    const [editShow, setEditShow] = useState(false);
    // Pagination
    const [runUseEffect, setRunUseEffect] = useState(false);
    const [currentPage, setCurrentPage] = useState(0) // offset for Ajay
    const [searchOptions, setSearchOptions] = useState();
    const [totalResults, setTotalResults] = useState(0);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(false);

    const openModal = (modalName, index = '') => {
        setAreaAddressData({}) // clear all the data from states when Modal is opend newly
        setAreaAddressError({}) // clear all errors

        if (modalName === 'add') {
            setShow(!show)
        } else if (modalName === 'edit') {
            setAreaAddressData(areaAddress[index]);
            getDistricts(areaAddress[index].state_id);
            getCities(areaAddress[index].district_id);
            setEditShow(!editShow);
        }
    }
    const handleClose = (modalName) => {
        if (modalName === 'add') {
            setShow(false)
        } else if (modalName === 'edit') {
            setEditShow(false)
        }
    }
    const getArea = async () => {
        var url = Host + Endpoints.getAreaAddresses;
        var data = {
            limit: limit,
            offset: currentPage,
        }
        const result = await Axios.post(url, data);
        if (result.data.error === true) {
            errorToast(result.data.title)
        } else {
            console.log(result.data.data.areaAddresses);
            setAreaAddress(result.data.data.areaAddresses);
        }
    }
    const getStates = async () => {
        var url = Host + Endpoints.getStates;
        const result = await Axios.get(url);
        if (result.data.error === true) {
            errorToast(result.data.title)
        } else {
            setStates(result.data.data);
        }
    }
    const getDistricts = async (stateID) => {
        var url = Host + Endpoints.getDistricts;
        var data = {
            state_id: stateID
        }
        const result = await Axios.post(url, data);
        if (result.data.error === true) {
            errorToast(result.data.title)
        } else {
            setDistricts(result.data.data.districts);
        }
    }
    const getCities = async (districtID) => {
        var url = Host + Endpoints.getCities;
        var defaultData = {
            limit: limit,
            offset: currentPage,
            district_id: districtID
        }
        const result = await Axios.post(url, defaultData);
        if (result.data.error === true) {
            errorToast(result.data.title);
        } else {
            setCities(result.data.data.cities);
        }
    }
    const isValid = () => {
        if (areaAddressData.state_id === '' || areaAddressData.state_id === undefined) {
            setAreaAddressError({ state_id: "Please select state" });
            return false;
        } else if (areaAddressData.district_id === '' || areaAddressData.district_id === undefined) {
            setAreaAddressError({ district_id: "Please select district" });
            return false;
        } else if (areaAddressData.city_id === '' || areaAddressData.city_id === undefined) {
            setAreaAddressError({ city_id: "Please select city" });
            return false;
        } else if (areaAddressData.name === '' || areaAddressData.name === undefined) {
            setAreaAddressError({ name: "Please enter area name!" });
            return false;
        } else {
            return true;
        }
    }
    const addAreaAddressBtn = async (e) => {
        e.preventDefault();
        if (isValid()) {
            setAreaAddressError({});
            var url = Host + Endpoints.addAreaAddress;
            const result = await Axios.post(url, areaAddressData, {
                headers: {
                    token: getUserToken().token
                }
            });
            if (result.data.error === true) {
                errorToast(result.data.title)
            } else {
                successToast(result.data.title);
                handleClose('add');
                setRunUseEffect(!runUseEffect);
            }

        }
    }
    const editAreaAddressBtn = async (e) => {
        e.preventDefault();
        if (isValid()) {
            setAreaAddressError({});
            var url = Host + Endpoints.editAreaAddress;
            const result = await Axios.post(url, areaAddressData, {
                headers: {
                    token: getUserToken().token
                }
            });
            if (result.data.error === true) {
                errorToast(result.data.title)
            } else {
                successToast(result.data.title);
                handleClose('edit');
                setRunUseEffect(!runUseEffect);
            }
        }
    }

    const handleChange = (e) => {
        if (e.target.name === 'state_id') {
            getDistricts(e.target.value)
        } else if (e.target.name === 'district_id') {
            getCities(e.target.value)
        } else {
            console.log('city drop')
        }
        setAreaAddressData({ ...areaAddressData, [e.target.name]: e.target.value });
    }
    useEffect(() => {
        getArea();
    }, [runUseEffect]);
    useEffect(() => {
        getStates();
    }, []);
    return (
        <>
            <Container fluid className="main-content-container px-4">
                {/* Page Header */}
                <Row noGutters className="page-header py-4">
                    <PageTitle
                        sm="4"
                        title="Manage Area"
                        subtitle="Manage Area"
                        className="text-sm-left"
                    />
                </Row>
                <ToastContainer />
                <Row>
                    <Col>
                        <Card small className="mb-4">
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() => openModal('add')}
                                    >
                                        Add
                                    </button>
                                </h6>
                            </CardHeader>
                            <CardBody className="p-0 pb-3 m-2">
                                <table id="subCategoryTable" className="table mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th scope="col" className="border-0">
                                                Sr.
                                            </th>
                                            <th scope="col" className="border-0">
                                                Area name
                                            </th>
                                            <th scope="col" className="border-0">
                                                District Name
                                            </th>

                                            <th scope="col" className="border-0">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {areaAddress && areaAddress.map((value, index) => (
                                            <tr key={value.id}>
                                                <td>{index + 1}</td>
                                                <td>{value.name}</td>
                                                <td>{value.district_name}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        onClick={() => openModal('edit', index)}
                                                    >
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

                {/*Add Modal  */}
                <Modal size="lg" show={show} onHide={() => handleClose('add')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Area</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <label htmlFor="feInputforState">State</label>
                            <FormSelect id="feInputforState" name="state_id" onChange={(e) => handleChange(e)}>
                                <option value="">Choose State</option>
                                {
                                    states && states.map((value, index) => (
                                        <option value={value.id}>{value.state_name}</option>
                                    ))
                                }
                            </FormSelect>
                            <p style={errorStyle}>{areaAddressError.state_id}</p>
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="feInputforDistrict">District</label>
                            <FormSelect id="feInputforDistrict" name="district_id" onChange={(e) => handleChange(e)}>
                                <option value="">Choose District</option>
                                {
                                    districts && districts.map((value, index) => (
                                        <option value={value.id}>{value.district_name}</option>
                                    ))
                                }
                            </FormSelect>
                            <p style={errorStyle}>{areaAddressError.district_id}</p>

                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="feInputforCity">City</label>
                            <FormSelect id="feInputforCity" name="city_id" onChange={(e) => handleChange(e)}>
                                <option value="">Choose City</option>
                                {
                                    cities && cities.map((value, index) => (
                                        <option value={value.id}>{value.city_name}</option>
                                    ))
                                }
                            </FormSelect>
                            <p style={errorStyle}>{areaAddressError.city_id}</p>
                        </FormGroup>

                        <FormGroup>
                            <FormGroup>
                                <label htmlFor="feInputAddress">Area name</label>
                                <FormInput id="feInputAddress" name="name" onChange={(e) => handleChange(e)} />
                                <p style={errorStyle}>{areaAddressError.name}</p>
                            </FormGroup>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose('add')}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={addAreaAddressBtn}>
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/*Edit Modal*/}

                <Modal size="lg" show={editShow} onHide={() => handleClose('edit')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Area</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <label htmlFor="feInputforState">State</label>
                            <FormSelect id="feInputforState" name="state_id" onChange={(e) => handleChange(e)} value={areaAddressData.state_id}>
                                <option value="">Choose State</option>
                                {
                                    states && states.map((value, index) => (
                                        <option value={value.id}>{value.state_name}</option>
                                    ))
                                }
                            </FormSelect>
                            <p style={errorStyle}>{areaAddressError.state_id}</p>
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="feInputforDistrict">District</label>
                            <FormSelect id="feInputforDistrict" name="district_id" onChange={(e) => handleChange(e)} value={areaAddressData.district_id}>
                                <option value="">Choose District</option>
                                {
                                    districts && districts.map((value, index) => (
                                        <option value={value.id}>{value.district_name}</option>
                                    ))
                                }
                            </FormSelect>
                            <p style={errorStyle}>{areaAddressError.district_id}</p>

                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="feInputforCity">City</label>
                            <FormSelect id="feInputforCity" name="city_id" onChange={(e) => handleChange(e)} value={areaAddressData.city_id}>
                                <option value="">Choose City</option>
                                {
                                    cities && cities.map((value, index) => (
                                        <option value={value.id}>{value.city_name}</option>
                                    ))
                                }
                            </FormSelect>
                            <p style={errorStyle}>{areaAddressError.city_id}</p>
                        </FormGroup>

                        <FormGroup>
                            <FormGroup>
                                <label htmlFor="feInputAddress">Area name</label>
                                <FormInput id="feInputAddress" name="name" onChange={(e) => handleChange(e)} defaultValue={areaAddressData.name} />
                                <p style={errorStyle}>{areaAddressError.name}</p>
                            </FormGroup>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose('add')}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={editAreaAddressBtn}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    )
}
