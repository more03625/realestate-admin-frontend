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

    const [states, setStates] = useState([]);
    const [statesData, setStatesData] = useState({});
    const [statesDataError, setStatesDataError] = useState({});
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
        setStatesData({}) // clear all the data from states when Modal is opend newly
        setStatesDataError({}) // clear all errors

        if (modalName === 'add') {
            setShow(!show)
        } else if (modalName === 'edit') {
            setStatesData(states[index]);
            setEditShow(!editShow);
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
        if (statesData.state_name === '' || statesData.state_name === undefined) {
            setStatesDataError({ state_name: 'Please specify state name' });
            return false
        } else {
            setStatesDataError('');
            return true;
        }
    }

    const addStateBtn = async (e) => {
        e.preventDefault();
        if (isValid()) {
            var url = Host + Endpoints.addState;
            const result = await Axios.post(url, statesData, {
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
    const updateStateBtn = async (e) => {
        e.preventDefault();
        if (isValid()) {
            var url = Host + Endpoints.editState;
            const result = await Axios.post(url, statesData, {
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
        setStatesData({ ...statesData, [e.target.name]: e.target.value })
    }
    useEffect(() => {
        getStates();
    }, [runUseEffect])
    return (
        <>
            <Container fluid className="main-content-container px-4">
                <Row noGutters className="page-header py-4">
                    <PageTitle
                        sm="4"
                        title="Manage States"
                        subtitle="Manage States"
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
                                        {states && states.map((value, index) => (
                                            <tr key={value.id}>
                                                <td>{index + 1}</td>
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
                {/*Add Modal*/}
                <Modal size="lg" show={show} onHide={() => handleClose('add')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add State</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup>
                            <label htmlFor="feInputAddress">State name</label>
                            <FormInput id="feInputAddress" name="state_name" onChange={(e) => handleChange(e)} />
                            <p style={errorStyle}>{statesDataError.state_name}</p>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose('add')}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={addStateBtn}>
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/*Edit States Modal*/}
                <Modal size="lg" show={editShow} onHide={() => handleClose('edit')}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit State</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {console.log(statesData)}
                        <FormGroup>
                            <label htmlFor="feInputAddress">State name</label>
                            <FormInput id="feInputAddress" name="state_name" onChange={(e) => handleChange(e)}
                                defaultValue={statesData.state_name}
                            />
                            <FormInput id="feInputAddress" type="hidden" name="state_name" onChange={(e) => handleChange(e)}
                                defaultValue={statesData.id}
                            />
                            <p style={errorStyle}>{statesDataError.state_name}</p>
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose('edit')}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={updateStateBtn}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    )
}
