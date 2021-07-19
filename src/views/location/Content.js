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
import { Modal, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import PageTitle from "../../components/common/PageTitle";
import {
    capitalize,
    Host,
    Endpoints,
    successToast,
    errorToast,
    errorStyle
} from "../../helper/comman_helpers";
import $ from "jquery";

const Content = () => {
    $(document).ready(function () {
        setTimeout(function () {
            $("#subCategoryTable").DataTable();
        }, 1000);
    });

    const [citiesError, setCitiesError] = useState();
    const [cities, setCities] = useState([]);
    const [requiredItem, setRequiredItem] = useState();
    const [showEditModal, setEditModalShow] = useState(false);
    const [stateAddNewCity, setStateAddNewCity] = useState();
    const [stateAddNewCityError, setStateAddNewCityError] = useState();
    const [addNewCityName, setAddNewCityName] = useState();
    const [addNewCityError, setAddNewCityError] = useState(null);
    const [addShow, setAddShow] = useState(false);
    const [cityIdToEdit, setCityIdToEdit] = useState();
    const [cityNameToEdit, setCityNameToEdit] = useState();
    const [stateIdToEdit, setStateIdToEdit] = useState();
    const handleAddClose = () => setAddShow(false);
    const handleClose = () => setEditModalShow(false);
    const [states, setStates] = useState([]);
    const [statesError, setStatesError] = useState();

    const clearError = () => {
        setStateAddNewCityError("");
        setAddNewCityError("");
    };
    const addSubCategoryBtn = () => {
        clearError();

        if (addNewCityName === undefined || stateAddNewCity === undefined) {
            setAddNewCityError("Please enter valid city!");
            setStateAddNewCityError("Please select State");
        } else {
            var addCityURL = Host + Endpoints.addCity;
            Axios.post(
                addCityURL,
                {
                    city_name: addNewCityName,
                    state_id: stateAddNewCity
                },
                {
                    headers: {
                        token: process.env.REACT_APP_API_KEY
                    }
                }
            ).then(response => {
                if (response.data.error === true) {
                    errorToast(response.data.title);
                } else {
                    successToast(response.data.title);
                }
            });
            setAddShow(false);
        }
    };

    const updateCity = () => {
        clearError();

        var updateCityURL = Host + Endpoints.editCity;
        var cityData = {
            id: cityIdToEdit,
            city_name: cityNameToEdit,
            state_id: stateIdToEdit
        };

        if (cityNameToEdit === "" || stateIdToEdit === "") {
            setStateAddNewCityError("Please select state !");
            setAddNewCityError("Please Enter City Name!");
        } else {
            Axios.post(updateCityURL, cityData, {
                headers: {
                    token: process.env.REACT_APP_API_KEY
                }
            }).then(response => {
                if (response.data.error === true) {
                    errorToast(response.data.title);
                } else {
                    successToast(response.data.title);
                }
                setEditModalShow(false);
            });
        }
    };
    const getCities = () => {
        var url = Host + Endpoints.getCities;
        Axios.post(
            url,
            {
                limit: 200
            },
            {
                headers: {
                    token: process.env.REACT_APP_API_KEY
                }
            }
        ).then(response => {
            if (response.data.error === true) {
                setCitiesError(response.data.title);
            } else {
                setCities(response.data.data.cities);
            }
        });
    };
    const getStates = () => {
        var url = Host + Endpoints.getStates;
        Axios.get(url).then(response => {
            if (response.data.error === true) {
                setStatesError(response.data.title);
            } else {
                setStates(response.data.data);
            }
        });
    };
    useEffect(() => {
        getCities();
        getStates();
    }, []);
    const replaceModalItem = index => {
        clearError();

        setCityIdToEdit(cities[index].id);
        setCityNameToEdit(cities[index].city_name);
        setStateIdToEdit(cities[index].state_id);

        setRequiredItem(index);
        setEditModalShow(true);
    };

    var modalData =
        requiredItem !== null || requiredItem !== undefined
            ? cities[requiredItem]
            : "";
    console.log(states);
    const addCityModal = () => {
        clearError();
        setAddShow(true);
    };
    return (
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
                                    onClick={addCityModal}
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
                                        {/*  <th scope="col" className="border-0">
                                            Status
                                        </th>
                                        */}
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
                                            {/*  <td>
                                                {value.flag === 1 ? (
                                                    <span style={{ color: "green" }}>Active</span>
                                                ) : (
                                                    <span style={errorStyle}>InActive</span>
                                                )}
                                            </td>
                                        */}
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-success"
                                                    onClick={() => replaceModalItem(index)}
                                                >
                                                    Edit
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

            <Modal size="lg" show={showEditModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Sub Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <label htmlFor="feInputAddress">City Name</label>
                        <FormInput
                            id="feInputAddress"
                            placeholder="City Name"
                            onChange={e => setCityNameToEdit(e.target.value)}
                            defaultValue={
                                modalData && modalData.city_name !== undefined
                                    ? modalData.city_name
                                    : ""
                            }
                        />
                        <input
                            type="hidden"
                            name="cityID"
                            value={
                                modalData && modalData.id !== undefined ? modalData.id : ""
                            }
                        />
                        <p style={errorStyle}>{addNewCityError}</p>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="feInputState">State</label>
                        <FormSelect
                            id="feInputState"
                            onChange={e => setStateIdToEdit(e.target.value)}
                            defaultValue={
                                modalData && modalData.state_id ? modalData.state_id : ""
                            }
                        >
                            <option>Choose State</option>
                            {states.map((value, index) => (
                                <option key={value.id} value={value.id}>
                                    {value.state_name}
                                </option>
                            ))}
                        </FormSelect>
                        <p style={errorStyle}>{addNewCityError}</p>
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
                    <Modal.Title>Add City</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <label htmlFor="feInputState">State</label>
                        <FormSelect
                            id="feInputState"
                            onChange={e => setStateAddNewCity(e.target.value)}
                        >
                            <option>Choose State</option>
                            {states.map((value, index) => (
                                <option key={value.id} value={value.id}>
                                    {value.state_name}
                                </option>
                            ))}
                        </FormSelect>
                        <p style={errorStyle}>{stateAddNewCityError}</p>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="feInputAddress">City Name</label>
                        <FormInput
                            id="feInputAddress"
                            placeholder="Enter city Name"
                            onChange={e => setAddNewCityName(e.target.value)}
                        />
                        <p style={errorStyle}>{addNewCityError}</p>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addSubCategoryBtn}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Content;
