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
import { Endpoints, errorToast, Host, errorStyle, getUserToken, successToast, rowsLimit } from '../../helper/comman_helpers'
import PageTitle from '../../components/common/PageTitle';
import { ToastContainer } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";

export default function Content() {
    const [cities, setCities] = useState([]);
    const [citiesData, setCitiesData] = useState({});
    const [citiesError, setCitiesError] = useState({});
    const [show, setShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);

    // Pagination
    const [runUseEffect, setRunUseEffect] = useState(false);
    const [currentPage, setCurrentPage] = useState(0) // offset for Ajay
    const [searchOptions, setSearchOptions] = useState();
    const [totalResults, setTotalResults] = useState(0);
    const [limit, setLimit] = useState(rowsLimit);
    const [loading, setLoading] = useState(false);

    const handleClose = (modalName) => {
        if (modalName === 'add') {
            setShow(false)
        } else if (modalName === 'edit') {
            setEditShow(false)
        }
    }
    const openModal = (modalName, index = '') => {
        setCitiesData({}) // clear all the data from states when Modal is opend newly
        setCitiesError({}) // clear all errors

        if (modalName === 'add') {
            setShow(!show)
        } else if (modalName === 'edit') {

            getDistricts(cities[index].state_id)

            setCitiesData(cities[index]);
            setEditShow(!editShow);
        }
    }
    const handleChange = (e) => {
        if (e.target.name === 'state_id') {
            getDistricts(e.target.value)
        }
        setCitiesData({ ...citiesData, [e.target.name]: e.target.value });
    }
    const getCities = async () => {
        var url = Host + Endpoints.getCities;
        var defaultData = {
            limit: limit,
            offset: currentPage,
        }
        const result = await Axios.post(url, defaultData);
        if (result.data.error === true) {
            errorToast(result.data.title);
        } else {
            setCities(result.data.data.cities);
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
        var data = {
            state_id: stateID,
            limit: limit,
            offset: currentPage
        }
        var url = Host + Endpoints.getDistricts;
        const result = await Axios.post(url, data);
        if (result.data.error === true) {
            errorToast(result.data.title)
        } else {
            setDistricts(result.data.data.districts);
        }
    }
    const isValid = () => {
        if (citiesData.state_id === '' || citiesData.state_id === undefined) {
            setCitiesError({ 'state_id': 'State name is required' });
            return false;
        } else if (citiesData.district_id === '' || citiesData.district_id === undefined) {
            setCitiesError({ 'district_id': 'District name is required' });
            return false;
        } else if (citiesData.city_name === '' || citiesData.city_name === undefined) {
            setCitiesError({ 'city_name': 'City name is required' });
            return false;
        } else {
            setCitiesError({});
            return true;
        }
    }
    const addCityBtn = async (e) => {
        e.preventDefault();
        if (isValid()) {
            var url = Host + Endpoints.addCity;
            const result = await Axios.post(url, citiesData, {
                headers: {
                    token: getUserToken().token
                }
            });
            if (result.data.error === true) {
                errorToast(result.data.title);
                return
            } else {
                successToast(result.data.title);
                handleClose('add');
                setRunUseEffect(!runUseEffect);
            }
        }

    }
    const updateCitBtn = async (e) => {
        e.preventDefault();
        if (isValid()) {
            var url = Host + Endpoints.editCity;
            console.log("Send this data ===> ", citiesData);
            const result = await Axios.post(url, citiesData, {
                headers: {
                    token: getUserToken().token
                }
            });
            if (result.data.error === true) {
                errorToast(result.data.title);
                return
            } else {
                successToast(result.data.title);
                handleClose('edit');
                setRunUseEffect(!runUseEffect);
            }
        }
    }
    useEffect(() => {
        getCities();
    }, [runUseEffect]);

    useEffect(() => {
        getStates();
        getDistricts();
    }, [])
    return (
        <>
            <Container fluid className="main-content-container px-4">
                {/* Page Header */}
                <Row noGutters className="page-header py-4">
                    <PageTitle
                        sm="4"
                        title="Manage Cities"
                        subtitle="Manage Cities"
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
                                                City
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
                                        {cities.map((value, index) => (
                                            <tr key={value.id}>
                                                <td>{index + 1}</td>
                                                <td>{value.city_name}</td>
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
                        <Modal.Title>Add City</Modal.Title>
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
                            <p style={errorStyle}>{citiesError.state_id}</p>
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
                            <p style={errorStyle}>{citiesError.district_id}</p>
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="feInputAddress">City name</label>
                            <FormInput id="feInputAddress" name="city_name" onChange={(e) => handleChange(e)} />
                            <p style={errorStyle}>{citiesError.city_name}</p>
                        </FormGroup>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose('add')}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={addCityBtn}>
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/*Edit Modal  */}

                <Modal size="lg" show={editShow} onHide={() => handleClose('edit')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit City</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <FormGroup>
                            <label htmlFor="feInputforState">State</label>
                            <FormSelect id="feInputforState" name="state_id" onChange={(e) => handleChange(e)} value={citiesData.state_id}>
                                <option value="">Choose State</option>
                                {
                                    states && states.map((value, index) => (
                                        <option value={value.id}>{value.state_name}</option>
                                    ))
                                }
                            </FormSelect>
                            <p style={errorStyle}>{citiesError.state_id}</p>
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="feInputforDistrict">District</label>
                            <FormSelect id="feInputforDistrict" name="district_id" onChange={(e) => handleChange(e)} value={citiesData.district_id}>
                                <option value="">Choose District</option>
                                {
                                    districts && districts.map((value, index) => (
                                        <option value={value.id}>{value.district_name}</option>
                                    ))
                                }
                            </FormSelect>
                            <p style={errorStyle}>{citiesError.district_id}</p>
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="feInputAddress">City name</label>
                            <FormInput id="feInputAddress" name="city_name" onChange={(e) => handleChange(e)} defaultValue={citiesData.city_name} />
                            <p style={errorStyle}>{citiesError.city_name}</p>
                        </FormGroup>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose('edit')}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={updateCitBtn}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    )
}
