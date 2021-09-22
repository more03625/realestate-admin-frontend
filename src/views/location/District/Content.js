import React, { useState, useEffect } from "react";
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
import Axios from "axios";
import PageTitle from "../../../components/common/PageTitle";
import { Host, Endpoints, errorToast, successToast, errorStyle, getUserToken } from '../../../helper/comman_helpers'
import { ToastContainer } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";

export default function Content() {
    const [districts, setDistricts] = useState([]);
    const [districtsData, setDistrictsData] = useState({});
    const [districtsError, setDistrictsError] = useState({});
    const [states, setStates] = useState([]);

    const [show, setShow] = useState(false);

    // Edit
    const [editShow, setEditShow] = useState(false);
    const [runUseEffect, setRunUseEffect] = useState(false);

    const handleClose = (modalName) => {
        if (modalName === 'add') {
            setShow(false)
        } else if (modalName === 'edit') {
            setEditShow(false)
        }
    }
    const openModal = (modalName, index = '') => {
        setDistrictsData({}) // clear all the data from states when Modal is opend newly
        setDistrictsError({}) // clear all errors

        if (modalName === 'add') {
            setShow(!show)
        } else if (modalName === 'edit') {
            setDistrictsData(districts[index]);
            setEditShow(!editShow);
        }
    }

    const getDistricts = async () => {
        var url = Host + Endpoints.getDistricts;
        const result = await Axios.post(url);
        if (result.data.error === true) {
            errorToast(result.data.title)
        } else {
            setDistricts(result.data.data.districts);
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
    const isValid = () => {
        if (districtsData.state_id === '' || districtsData.state_id === undefined) {
            setDistrictsError({ state_name: 'Please specify state name' });
            return false
        } else if (districtsData.district_name === '' || districtsData.district_name === undefined) {
            setDistrictsError({ district_name: 'Please specify state name' });
        } else {
            setDistrictsError('');
            return true;
        }
    }
    const addDistrictBtn = async (e) => {
        e.preventDefault();
        if (isValid()) {
            var url = Host + Endpoints.addDistrict;
            const result = await Axios.post(url, districtsData, {
                headers: {
                    token: getUserToken().token
                }
            });
            if (result.data.error === true) {
                errorToast(result.data.title);
            } else {
                successToast(result.data.title);
                handleClose('add');
                setRunUseEffect(!runUseEffect);
            }
        }
    }
    const updateDistrictBtn = async (e) => {
        e.preventDefault();
        if (isValid()) {
            var url = Host + Endpoints.editDistrict;
            const result = await Axios.post(url, districtsData, {
                headers: {
                    token: getUserToken().token
                }
            });
            if (result.data.error === true) {
                errorToast(result.data.title);
            } else {
                successToast(result.data.title);
                handleClose('edit');
                setRunUseEffect(!runUseEffect);
            }
        }
    }
    const handleChange = (e) => {
        setDistrictsData({ ...districtsData, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        getDistricts();
        getStates();
    }, [])
    return (
        <>
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle
                        sm="4"
                        title="Manage Districts"
                        subtitle="Manage Districts"
                        className="text-sm-left"
                    />
                </Row>
                <ToastContainer />
                <Row>
                    <Col>
                        <Card small className="mb-4">
                            <CardHeader className="border-bottom">
                                <h6 className="m-0">
                                    <button type="button" className="btn btn-success" onClick={() => openModal('add')}>
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
                                                State
                                            </th>
                                            <th scope="col" className="border-0">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {districts && districts.map((value, index) => (
                                            <tr key={value.id}>
                                                <td>{index + 1}</td>
                                                <td>{value.district_name}</td>
                                                <td>{value.state_name}</td>
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
                        <Modal.Title>Add District</Modal.Title>
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
                            <p style={errorStyle}>{districtsError.state_name}</p>
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="feInputAddress">District name</label>
                            <FormInput id="feInputAddress" name="district_name" onChange={(e) => handleChange(e)} />
                            <p style={errorStyle}>{districtsError.district_name}</p>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose('add')}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={addDistrictBtn}>
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/*Edit States Modal */}
                <Modal size="lg" show={editShow} onHide={() => handleClose('edit')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit State</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <label htmlFor="feInputforState">State</label>
                            <FormSelect id="feInputforState" name="state_id" onChange={(e) => handleChange(e)} value={districtsData.state_id}>
                                <option value="">Choose State</option>
                                {
                                    states && states.map((value, index) => (
                                        <option value={value.id}>{value.state_name}</option>
                                    ))
                                }
                            </FormSelect>
                            <p style={errorStyle}>{districtsError.state_name}</p>
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="feInputAddress">District name</label>
                            <FormInput id="feInputAddress" name="district_name" onChange={(e) => handleChange(e)} defaultValue={districtsData.district_name} />
                            <p style={errorStyle}>{districtsError.district_name}</p>
                        </FormGroup>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose('edit')}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={updateDistrictBtn}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Container>
        </>
    )
}
