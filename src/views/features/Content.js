import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormCheckbox,
    FormGroup, FormInput, FormSelect, Alert
} from "shards-react";
import Axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import PageTitle from "../../components/common/PageTitle";
import {
    capitalize,
    Host,
    Endpoints,
    successToast,
    errorToast, errorStyle,
    getUserToken
} from "../../helper/comman_helpers";
import $ from "jquery";

const Content = () => {

    $(document).ready(function () {
        setTimeout(function () {
            $("#subCategoryTable").DataTable();
        }, 1000);
    });
    const [features, setFeatures] = useState([]);
    const [featuresError, setFeaturesError] = useState();

    const [requiredItem, setRequiredItem] = useState();
    const [showEditModal, setEditModalShow] = useState(false);
    // const [stateAddNewCity, setStateAddNewCity] = useState();
    // const [stateAddNewCityError, setStateAddNewCityError] = useState();
    // const [addNewCityName, setAddNewCityName] = useState();
    // const [addNewCityError, setAddNewCityError] = useState(null);
    const [addShow, setAddShow] = useState(false);
    // const [cityIdToEdit, setCityIdToEdit] = useState();
    // const [cityNameToEdit, setCityNameToEdit] = useState();
    // const [stateIdToEdit, setStateIdToEdit] = useState();
    const [showStatusModal, setshowStatusModal] = useState(false);
    const handleAddClose = () => setAddShow(false);
    const handleClose = () => setEditModalShow(false);
    const handleStatusClose = () => setshowStatusModal(false);
    // const [states, setStates] = useState([]);
    // const [statesError, setStatesError] = useState();
    const [featureTypeToAdd, setFeatureTypeToAdd] = useState();
    const [featureToAdd, setFeatureToAdd] = useState();
    const [iconToAdd, setIconToAdd] = useState();

    const [featureTypeToAddError, setFeatureTypeToAddError] = useState();
    const [featureToAddError, setFeatureToAddError] = useState();
    const [iconToAddError, setIconToAddError] = useState();
    
    const clearError = () => {
        setFeatureTypeToAddError("");
        setFeatureToAddError("");
        setIconToAddError("");
    }
    const [featureIdToEdit, setFeatureIdToEdit] = useState();
    const [featureTypeToEdit, setFeatureTypeToEdit] = useState();
    const [featureToEdit, setFeatureToEdit] = useState();
    const [iconToEdit, setIconToEdit] = useState();

    const addFeatureBtn = () => {
        clearError();

        if (featureTypeToAdd === '' || featureToAdd === '' || featureTypeToAdd === undefined || featureToAdd === undefined || iconToAdd === '' || iconToAdd === undefined) {
            setFeatureTypeToAddError("Please select feature type!")
            setFeatureToAddError("Please Enter Feature");
            setIconToAddError("Please Enter Icon");
        }
        else {
            var addFeatureURL = Host + Endpoints.addfeatures;
            Axios.post(addFeatureURL, {
                "feature": featureToAdd,
                "type": featureTypeToAdd,
                "icon": iconToAdd
            }, {
                headers: {
                    token: `${getUserToken().token}`,
                }
            }).then((response) => {
                if (response.data.error === true) {
                    errorToast(response.data.title);
                } else {
                    successToast(response.data.title);
                }
            })
            setAddShow(false);
        }
    }

    const updateCity = () => {
        clearError();

        var editFeaturesURL = Host + Endpoints.editFeatures;
        var featuresData = {
            "id": featureIdToEdit,
            "type": featureTypeToEdit,
            "feature": featureToEdit,
            "icon": iconToEdit
        }

        if (featureTypeToEdit === '' || featureToEdit === '' || iconToEdit === '') {

            setFeatureTypeToAddError("Please select feature type!")
            setFeatureToAddError("Please Enter Feature");
            setIconToAddError("Please Enter Icon");
        }
        else {
            Axios.post(editFeaturesURL, featuresData, {
                headers: {
                    token: `${getUserToken().token}`,
                }
            }).then((response) => {
                if (response.data.error === true) {
                    errorToast(response.data.title);
                } else {
                    successToast(response.data.title);
                }
                setEditModalShow(false);
            })
        }
    }
    const getFeatures = () => {
        var url = Host + Endpoints.getFeatures;
        Axios.get(url, {
            headers: {
                token: `${getUserToken().token}`,
            }
        }).then(response => {
            if (response.data.error === true) {
                setFeaturesError(response.data.title);
            } else {
                setFeatures(response.data.data.features);
            }
        });
    };
    // const getStates = () => {
    //     var url = Host + Endpoints.getStates;
    //     Axios.get(url).then((response) => {
    //         if (response.data.error === true) {
    //             setStatesError(response.data.title);
    //         } else {
    //             setStates(response.data.data);
    //         }
    //     })
    // }
    useEffect(() => {
        getFeatures();
        // getStates();
    }, []);

    const updateStatus = (id, status) => {
        var data = {
          id,
          status: status == true ? false : true
        };
        var url = Host + Endpoints.editFeatures;
        Axios.post(url, data, {
          headers: {
            token: `${getUserToken().token}`,
        }
        }).then(response => {
            if (response.data.error === true) {
                errorToast(response.data.title);
            } else {
                successToast(response.data.title);
                getFeatures(); 
                setshowStatusModal(false);
            }
        });
    };

    const changeStatusModal = index => {
        setRequiredItem(index); // set Index
        setshowStatusModal(true); // Open Modal
    };

    const replaceModalItem = (index) => {
        clearError();

        setFeatureIdToEdit(features[index].id);
        setFeatureTypeToEdit(features[index].type);
        setFeatureToEdit(features[index].feature);
        setIconToEdit(features[index].icon);

        setRequiredItem(index);
        setEditModalShow(true);
    }

    var modalData = (requiredItem !== null || requiredItem !== undefined) ? features[requiredItem] : '';

    const openAddFeaturesModal = () => {
        clearError();
        setAddShow(true)
    }
    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title="Manage Features"
                    subtitle="Manage Features"
                    className="text-sm-left"
                />
            </Row>
            <ToastContainer />

            <Row>
                <Col>
                    <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">
                                <button type="button" className="btn btn-success" onClick={openAddFeaturesModal}>
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
                                            feature
                                        </th>

                                        <th scope="col" className="border-0">
                                            Type
                                        </th>
                                        <th scope="col" className="border-0">
                                            Icon
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
                                    {features.map((value, index) => (
                                        <tr key={value.id}>
                                            <td>{index + 1}</td>
                                            <td>{value.feature}</td>
                                            <td>{value.type}</td>
                                            <td>{value.icon}</td>
                                            <td>
                                                {value.status === true ? (
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
                                                <button type="button" className="btn btn-success mr-1" onClick={() => replaceModalItem(index)}>
                                                    Edit
                                                </button>
                                                <button type="button" className="btn btn-warning mr-1" onClick={() => changeStatusModal(index)}
                                                ><i className="material-icons">edit</i></button>
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
                <Modal.Body>Are you sure you want to update this Feature?</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleStatusClose}>
                    Close
                </Button>
                <Button
                    variant="danger"
                    onClick={() => updateStatus(modalData.id, modalData.status)}
                >
                    Update
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal size="lg" show={showEditModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Feature</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <label htmlFor="feInputState">Feature type</label>
                        <FormSelect id="feInputState" onChange={(e) => setFeatureTypeToEdit(e.target.value)} defaultValue={modalData && modalData.type != undefined ? modalData.type : ''}>
                            <option>Choose Feature type</option>
                            <option value="Outdoor Features">Outdoor Features</option>
                            <option value="Indoor Features">Indoor Features</option>
                            <option value="Climate Control & Energy">Climet Control & Energy</option>
                            <option value="Property Requirements">Property Requirements</option>
                            {/* {states.map((value, index) => (
                        <option key={value.id} value={value.id}>{value.state_name}</option>
                    ))}
                    */}
                        </FormSelect>
                        <p style={errorStyle}>{featureTypeToAddError}</p>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="feInputAddress">Feature Name</label>
                        <FormInput id="feInputAddress" placeholder="Enter Feature Name" onChange={(e) => setFeatureToEdit(e.target.value)} defaultValue={modalData && modalData.feature != undefined ? modalData.feature : ''} />
                        <p style={errorStyle}>{featureToAddError}</p>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="feInputIcon">Icon Name</label>
                        <FormInput id="feInputIcon" placeholder="Enter Icon Name" onChange={(e) => setIconToEdit(e.target.value)} defaultValue={modalData && modalData.icon != undefined ? modalData.icon : ''} />
                        <p style={errorStyle}>{iconToAddError}</p>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateCity}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal size="lg" show={addShow} onHide={handleAddClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Features</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <FormGroup>
                        <label htmlFor="feInputState">Feature type</label>
                        <FormSelect id="feInputState" onChange={(e) => setFeatureTypeToAdd(e.target.value)}>
                            <option>Choose Feature type</option>
                            <option value="Outdoor Features">Outdoor Features</option>
                            <option value="Indoor Features">Indoor Features</option>
                            <option value="Climate Control & Energy">Climet Control & Energy</option>
                            <option value="Property Requirements">Property Requirements</option>
                            {/* {states.map((value, index) => (
                                <option key={value.id} value={value.id}>{value.state_name}</option>
                            ))}
                            */}
                        </FormSelect>
                        <p style={errorStyle}>{featureTypeToAddError}</p>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="feInputAddress">Feature Name</label>
                        <FormInput id="feInputAddress" placeholder="Enter Feature Name" onChange={(e) => setFeatureToAdd(e.target.value)} />
                        <p style={errorStyle}>{featureToAddError}</p>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="iconInputAddress">Icon Name</label>
                        <FormInput id="iconInputAddress" placeholder="Enter Icon Name" onChange={(e) => setIconToAdd(e.target.value)} />
                        <p style={errorStyle}>{iconToAddError}</p>
                    </FormGroup>
                    

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addFeatureBtn}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
}

export default Content;
