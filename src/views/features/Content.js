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
import { Link } from "react-router-dom";

const Content = () => {
    const requiredWidth = 48;
    const requiredHeight = 48;
    const errorStyle = {
        color: "red",
        fontSize: "14px",
    };
    const successStyle = {
        color: "#28a745",
        fontSize: "14px",
    };
    $(document).ready(function () {
        setTimeout(function () {
            $("#subCategoryTable").DataTable();
        }, 1000);
    });
    const [features, setFeatures] = useState([]);
    const [featuresError, setFeaturesError] = useState();

    const [requiredItem, setRequiredItem] = useState();
    const [showEditModal, setEditModalShow] = useState(false);

    const [addShow, setAddShow] = useState(false);

    const [showStatusModal, setshowStatusModal] = useState(false);
    const handleAddClose = () => setAddShow(false);
    const handleClose = () => setEditModalShow(false);
    const handleStatusClose = () => setshowStatusModal(false);
    // const [states, setStates] = useState([]);
    // const [statesError, setStatesError] = useState();





    const [runUseEffect, setRunUseEffect] = useState(false);

    const [featuresData, setFeaturesData] = useState([]);
    const [featuresDataError, setFeaturesDataError] = useState([]);
    const handleOnChange = (e) => {
        setFeaturesData({ ...featuresData, [e.target.name]: e.target.value });
    }
    const clearErrors = () => {
        setFeaturesDataError('')

    }
    const isValid = () => {
        console.log(featuresData.icon);
        console.log(featuresData);
        if (featuresData.type === '' || featuresData.type === null || featuresData.type === undefined) {
            setFeaturesDataError({ type: "Please select feature type!" });
        } else if (featuresData.feature === '' || featuresData.feature === null || featuresData.feature === undefined) {
            setFeaturesDataError({ feature: "Please enter feature name!" });
        } else if (featuresData.icon === '' || featuresData.icon === null || featuresData.icon === undefined) {
            setFeaturesDataError({ icon: `Image size should be ${requiredWidth}px X ${requiredHeight}px` });
        } else {
            return true;
        }
    }

    const addFeatureBtn = () => {

        if (isValid()) {
            var addFeatureURL = Host + Endpoints.addfeatures;
            Axios.post(addFeatureURL, featuresData, {
                headers: {
                    token: `${getUserToken().token}`,
                }
            }).then((response) => {
                if (response.data.error === true) {
                    errorToast(response.data.title);
                } else {
                    setRunUseEffect(!runUseEffect);
                    successToast(response.data.title);
                }
            })
            setAddShow(false);
        }

    }

    const [isImageSelected, setIsImageSelected] = useState(false);

    const uploadImage = (e) => {
        const image = e.target.files[0];

        createReader(image, function (width, height) {

            if (width === requiredWidth && height === requiredHeight) {
                setIsImageSelected({
                    ...isImageSelected,
                    image: `${image.name} has been selected`,
                });
                const base64Image = convertToBase64(image);
                console.log()
                base64Image.then((response) => {
                    setFeaturesData({ ...featuresData, icon: response });
                    console.log(featuresData);
                })
            } else {
                setFeaturesDataError({ icon: `Image size should be ${requiredWidth}px X ${requiredHeight}px. You uploaded ${width}px X ${height}px` });
            }
        });
    };
    function createReader(file, whenReady) {
        var reader = new FileReader;
        reader.onload = function (evt) {
            var image = new Image();
            image.onload = function (evt) {
                var width = this.width;
                var height = this.height;
                if (whenReady) whenReady(width, height);
            };
            image.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    }
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const updateFeature = () => {
        console.log(isImageSelected)
        if (isImageSelected === false) {
            Object.assign(featuresData, { icon: 0 });
        }

        var editFeaturesURL = Host + Endpoints.editFeatures;

        if (isValid()) {
            Axios.post(editFeaturesURL, featuresData, {
                headers: {
                    token: `${getUserToken().token}`,
                }
            }).then((response) => {
                if (response.data.error === true) {
                    errorToast(response.data.title);
                } else {
                    setRunUseEffect(!runUseEffect);

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

    useEffect(() => {
        getFeatures();
        // getStates();
    }, [runUseEffect]);

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
        clearErrors();
        setFeaturesData({ id: features[index].id, type: features[index].type, feature: features[index].feature, icon: features[index].icon });
        setRequiredItem(index);
        setEditModalShow(true);
    }

    var modalData = (requiredItem !== null || requiredItem !== undefined) ? features[requiredItem] : '';
    console.log(modalData);
    const openAddFeaturesModal = () => {
        setIsImageSelected('');
        clearErrors();
        setAddShow(true);
    }
    const openImage = (imageName) => {
        window.open(Host + imageName + ".jpg");
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
                                        {/*
                                        <th scope="col" className="border-0">
                                            Icon
                                        </th>
                                        */}
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
                                            {/*<td>{value.icon}</td>*/}
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
                                                    <i className="material-icons">edit</i>
                                                </button>
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

                    Are you sure you want to <b>{`${modalData && modalData.status === true ? 'Deactivate' : 'Activate'}`}</b> <b>{`${modalData && modalData.feature}`}</b> Feature?</Modal.Body>
                <Modal.Footer>

                    <Button variant="secondary" onClick={handleStatusClose}>
                        Close
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => updateStatus(modalData.id, modalData.status)}
                    >
                        <b>{`${modalData && modalData.status === true ? 'Deactivate' : 'Activate'}`}</b>
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
                        <FormSelect id="feInputState" name="type" onChange={(e) => handleOnChange(e)} defaultValue={modalData && modalData.type != undefined ? modalData.type : ''}>
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
                        <p style={errorStyle}>{featuresDataError.type}</p>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="feInputAddress">Feature Name</label>
                        <FormInput id="feInputAddress" placeholder="Enter Feature Name" name="feature" onChange={(e) => handleOnChange(e)} defaultValue={modalData && modalData.feature != undefined ? modalData.feature : ''} />
                        <p style={errorStyle}>{featuresDataError.feature}</p>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="iconInputAddress">Icon Name</label>
                        <div className="custom-file mb-3">
                            <input type="file" className="custom-file-input" id="customFile2" name="icon" onChange={(e) => { uploadImage(e); }} />
                            <label className="custom-file-label" htmlFor="customFile2">
                                Choose file...
                            </label>
                            <p style={errorStyle}>{featuresDataError.icon}</p>
                            <p style={successStyle}>{isImageSelected.image}</p>
                            {
                                isImageSelected === false ?
                                    <p style={successStyle}>

                                        <Link style={successStyle} to={"#"} onClick={() => openImage(modalData && modalData.icon ? modalData.icon : '')}>This image selected as a thumbnail!</Link>
                                    </p>
                                    : ''
                            }
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <div className="custom-file mb-3">
                            <Link to={"#"} onClick={() => window.open("https://www.iloveimg.com/resize-image")}>Resize image Online</Link>
                        </div>
                    </FormGroup>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateFeature}>
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
                        <FormSelect id="feInputState" name="type" onChange={(e) => handleOnChange(e)}>
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
                        <p style={errorStyle}>{featuresDataError.type}</p>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="feInputAddress">Feature Name</label>
                        <FormInput id="feInputAddress" placeholder="Enter Feature Name" name="feature" onChange={(e) => handleOnChange(e)} />
                        <p style={errorStyle}>{featuresDataError.feature}</p>

                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="iconInputAddress">Icon Name</label>
                        <div className="custom-file mb-3">
                            <input type="file" className="custom-file-input" id="customFile2" name="icon" onChange={(e) => { uploadImage(e); }} />
                            <label className="custom-file-label" htmlFor="customFile2">
                                Choose file...
                            </label>
                            <p style={errorStyle}>{featuresDataError.icon}</p>
                            <p style={successStyle}>{isImageSelected.image}</p>
                        </div>
                    </FormGroup>


                    <FormGroup>
                        <div className="custom-file mb-3">
                            <Link to={"#"} onClick={() => window.open("https://www.iloveimg.com/resize-image")}>Resize image Online</Link>
                        </div>
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
