import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormCheckbox,
    FormGroup, FormInput, FormSelect, FormTextarea
} from "shards-react";
import Axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import PageTitle from "../../components/common/PageTitle";
import { Link } from "react-router-dom";
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
    const requiredWidth = 387;
    const requiredHeight = 257;
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
    const [addNewCategory, setAddNewCategory] = useState();
    const [addSubCategoryName, setAddSubCategoryName] = useState();
    const [addSubCategoryDescription, setAddSubCategoryDescription] = useState();
    const [addNewCategoryImage, setAddNewCategoryImage] = useState();
    const [addNewPropertyType, setAddNewPropertyType] = useState();
    const [newPropertyType, setNewPropertyType] = useState();



    const [addSubCategoryNameError, setAddSubCategoryNameError] = useState(null);
    const [addNewCategoryError, setAddNewCategoryError] = useState(null);
    const [addNewCategoryImageError, setAddNewCategoryImageError] = useState(null);
    const [addNewPropertyTypeError, setAddNewPropertyTypeError] = useState(null);
    const [newPropertyTypeError, setNewPropertyTypeError] = useState(null);
    const [addSubCategoryDescriptionError, setAddSubCategoryDescriptionError] = useState();


    const [subCategoriesError, setSubCategoriesError] = useState();

    const [subCategories, setSubCategories] = useState([]);
    const [requiredItem, setRequiredItem] = useState();
    const [showEditModal, setEditModalShow] = useState(false);
    const [showStatusModal, setshowStatusModal] = useState(false);

    const [addShow, setAddShow] = useState(false);
    const [categoryID, setCategoryID] = useState();
    const [subCategoryID, setSubCategoryID] = useState();
    const [newCategoryName, setNewCategoryName] = useState();
    const [newCategoryDescription, setNewCategoryDescription] = useState();

    const handleAddClose = () => setAddShow(false);
    const handleClose = () => setEditModalShow(false);
    const handleStatusClose = () => setshowStatusModal(false);
    const [categoriesError, setCategoriesError] = useState();
    const [categories, setCategories] = useState([]);
    const [runUseEffect, setRunUseEffect] = useState(false);

    const clearAllErrors = () => {
        setAddSubCategoryNameError('');
        setAddNewCategoryError('');
        setAddNewCategoryImageError('');
        setAddNewPropertyTypeError('');
        setNewPropertyTypeError('');
    }
    const addSubCategoryBtn = () => {
        setAddNewCategoryError(null);
        setAddSubCategoryNameError(null);
        if (addNewCategory === undefined || addSubCategoryName === undefined || addNewCategoryImage === undefined || addNewPropertyType === undefined || addSubCategoryDescription === undefined) {
            setAddNewCategoryError("Please enter valid category!")
            setAddSubCategoryNameError("Please enter a valid sub category name!");
            setAddNewCategoryImageError('Please choose image to display');
            setAddNewPropertyTypeError('Plese select valid property type!');
        }
        else {
            var addSubCategoryURL = Host + Endpoints.addSubCategory;
            Axios.post(addSubCategoryURL, {
                "category_id": addNewCategory,
                "name": addSubCategoryName,
                "image": addNewCategoryImage,
                "type": addNewPropertyType,
                "description": addSubCategoryDescription
            }, {
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


    const updateSubCategory = () => {
        console.log(isImageSelected)


        if (isImageSelected === false) {
            console.log("In if : " + isImageSelected)

            addNewCategoryImage = 0;
        } else {
            console.log(isImageSelected)

        }
        setAddSubCategoryNameError("");
        setAddNewCategoryError("");

        var updateSubCategoryURL = Host + Endpoints.editSubCategory;
        var categoryData = {
            "id": subCategoryID,
            "category_id": categoryID,
            "name": newCategoryName,
            "image": addNewCategoryImage,
            "type": newPropertyType,
            "description": newCategoryDescription
        }

        if (newCategoryName === '' || categoryID === '') {
            setAddSubCategoryNameError("Please enter subcategory name !");
            setAddNewCategoryError("Please select category!");
        } else {
            Axios.post(updateSubCategoryURL, categoryData, {
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
    const getSubCategories = () => {
        var url = Host + Endpoints.getSubCategories;
        Axios.get(url, {
            headers: {
                token: `${getUserToken().token}`,
            }
        }).then(response => {
            if (response.data.error === true) {
                setSubCategoriesError(response.data.title);
            } else {
                setSubCategories(response.data.data.categories);
            }
        });
    };
    const getCategories = () => {
        var getCategoryURL = Host + Endpoints.getCategories;
        Axios.get(getCategoryURL, {
            headers: {
                token: `${getUserToken().token}`,
            }
        }).then(response => {
            if (response.data.error === true) {
                setCategoriesError(response.data.title);
            } else {
                setCategories(response.data.data.categories);
            }
        });
    }
    const updateStatus = (id, status) => {
        var data = {
            id,
            status: status === "active" ? "deactive" : "active"
        };
        var url = Host + Endpoints.editSubCategory;
        Axios.post(url, data, {
            headers: {
                token: `${getUserToken().token}`,
            }
        }).then(response => {
            if (response.data.error === true) {
                errorToast(response.data.title);
            } else {
                setRunUseEffect(!runUseEffect);
                successToast(response.data.title);
                setshowStatusModal(false);
            }
        });
    };

    const changeStatusModal = index => {
        setRequiredItem(index); // set Index
        setshowStatusModal(true); // Open Modal
    };

    const replaceModalItem = (index) => {
        setSubCategoryID(subCategories[index].id);
        setCategoryID(subCategories[index].category_id);
        setNewCategoryName(subCategories[index].name);

        clearAllErrors();

        setRequiredItem(index);
        setEditModalShow(true);
    }

    var modalData = (requiredItem !== null || requiredItem !== undefined) ? subCategories[requiredItem] : '';

    const addCategoryModal = () => {
        setIsImageSelected({
            ...isImageSelected,
            image: '',
        });
        setAddShow(true);
    };
    const [isImageSelected, setIsImageSelected] = useState(false);

    const uploadImage = (e) => {
        const image = e.target.files[0];

        createReader(image, function (width, height) {

            if (width === requiredWidth && height === requiredHeight) {
                setAddNewCategoryImageError('')

                setIsImageSelected({
                    ...isImageSelected,
                    image: `${image.name} has been selected`,
                });
                const base64Image = convertToBase64(image);
                console.log()
                base64Image.then((response) => {
                    setAddNewCategoryImage(response);
                })
            } else {
                setAddNewCategoryImageError(`Image size should be ${requiredWidth}px X ${requiredHeight}px. You uploaded ${width}px X ${height}px`)
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
    const [propertyTypes, setPropertyTypes] = useState();


    const getPropertyTypes = (categoryID = '') => {
        var url = Host + Endpoints.getPropertyTypes + categoryID;
        Axios.get(url).then((response) => {
            if (response.data.error === true) {
                alert("There are some errors!");
            } else {
                setPropertyTypes(response.data.data);
            }
        });
    };
    const handleCategoryChange = (e) => {
        setAddNewCategory(e.target.value)

        getPropertyTypes(e.target.value);


    };
    const openImage = (imageName) => {
        window.open(Host + imageName + ".jpg");
    }
    useEffect(() => {
        getSubCategories();
        getCategories();
        getPropertyTypes();
    }, [runUseEffect]);
    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title="Manage Sub Categories"
                    subtitle="Sub Categories CRUD"
                    className="text-sm-left"
                />
            </Row>
            <ToastContainer />

            <Row>
                <Col>
                    <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">
                                <button type="button" className="btn btn-success" onClick={addCategoryModal}>
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
                                            Sub Category
                                        </th>
                                        <th scope="col" className="border-0">
                                            Category
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

                                    {subCategories.map((value, index) => (
                                        <tr key={value.id}>
                                            <td>{index + 1}</td>
                                            <td>{value.name}</td>
                                            <td>{value.category_name}</td>

                                            <td>
                                                {value.status === "active" ? (
                                                    <span style={{ color: "green" }}>
                                                        {capitalize(value.status)}
                                                    </span>
                                                ) : (
                                                    <span style={errorStyle}>
                                                        {capitalize('Inactive')}
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                <button type="button" className="btn btn-warning mr-1"
                                                    onClick={() => changeStatusModal(index)}
                                                >

                                                    <i className="material-icons">build</i>
                                                </button>
                                                <button type="button" className="btn btn-success" onClick={() => replaceModalItem(index)}>
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

            <Modal show={showStatusModal} onHide={handleStatusClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to <b>{`${modalData && modalData.status === 'active' ? 'Deactivate' : 'Activate'}`}</b> {modalData && modalData.category_name} Sub Category?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleStatusClose}>
                        Close
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => updateStatus(modalData.id, modalData.status)}
                    >
                        {`${modalData && modalData.status === 'active' ? 'Deactivate' : 'Activate'}`}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal size="lg" show={showEditModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Sub Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <label htmlFor="feInputState">Category</label>
                        <FormSelect id="feInputState" onChange={(e) => setCategoryID(e.target.value)} defaultValue={modalData && modalData.category_id ? modalData.category_id : ''} onChange={(e) => handleCategoryChange(e)}>
                            <option>Choose Status</option>
                            {categories.map((value, index) => (
                                <option key={value.id} value={value.id}>{value.name}</option>
                            ))}
                        </FormSelect>
                        <p style={errorStyle}>{addNewCategoryError}</p>
                    </FormGroup>
                    <FormGroup>

                        <label htmlFor="propertyType">Property Type</label>
                        <FormSelect id="propertyType" name="property_type" onChange={(e) => setNewPropertyType(e.target.value)} defaultValue={modalData && modalData.type ? modalData.type : ''}>
                            <option>Choose Property Type</option>
                            {propertyTypes && propertyTypes.map((value, index) => (
                                <option key={value.id} value={value.name}>{capitalize(value.name)}</option>
                            ))}

                        </FormSelect>
                        <p style={errorStyle}>{addNewPropertyTypeError}</p>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="feInputAddress">Sub Category Name</label>
                        <FormInput id="feInputAddress" placeholder="Category Name" onChange={(e) => setNewCategoryName(e.target.value)} defaultValue={modalData && modalData.name !== undefined ? modalData.name : ''} />
                        <input type="hidden" name="categoryID" value={modalData && modalData.id !== undefined ? modalData.id : ''} />
                        <p style={errorStyle}>{addSubCategoryNameError}</p>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="feDescription">Description</label>
                        <FormTextarea name="description" id="feDescription" rows="5" onChange={(e) => setNewCategoryDescription(e.target.value)} defaultValue={modalData && modalData.description !== undefined ? modalData.description : ''} />
                        <p style={errorStyle}>{addSubCategoryDescriptionError}</p>
                    </FormGroup>

                    <div className="custom-file mb-3">
                        <input type="file" className="custom-file-input" id="customFile2" onChange={(e) => uploadImage(e)} />
                        <label className="custom-file-label" htmlFor="customFile2">
                            Choose file...
                        </label>

                        <p style={errorStyle}>{addNewCategoryImageError}</p>
                        <p style={successStyle}>{isImageSelected.image}</p>
                        {
                            isImageSelected === false ?
                                <p style={successStyle}>

                                    <Link style={successStyle} to={"#"} onClick={() => openImage(modalData && modalData.image ? modalData.image : '')}>This image selected as a thumbnail!</Link>
                                </p>
                                : ''
                        }

                    </div>

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
                    <Button variant="primary" onClick={updateSubCategory}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>





            <Modal size="lg" show={addShow} onHide={handleAddClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Sub Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>

                        <label htmlFor="feInputState">Category Name</label>
                        <FormSelect id="feInputState" onChange={(e) => handleCategoryChange(e)}>
                            <option>Choose Category</option>
                            {categories.map((value, index) => (
                                <option key={value.id} value={value.id}>{capitalize(value.name)}</option>
                            ))}

                        </FormSelect>
                        <p style={errorStyle}>{addNewCategoryError}</p>
                    </FormGroup>

                    <FormGroup>

                        <label htmlFor="propertyType">Property Type</label>
                        <FormSelect id="propertyType" name="property_type" onChange={(e) => setAddNewPropertyType(e.target.value)}>
                            <option>Choose Property Type</option>
                            {propertyTypes && propertyTypes.map((value, index) => (
                                <option key={value.id} value={value.id}>{value.name}</option>
                            ))}

                        </FormSelect>
                        <p style={errorStyle}>{addNewPropertyTypeError}</p>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="feInputAddress">Sub Category</label>
                        <FormInput id="feInputAddress" placeholder="Sub Category" onChange={(e) => setAddSubCategoryName(e.target.value)} />
                        <p style={errorStyle}>{addSubCategoryNameError}</p>
                    </FormGroup>
                    <FormGroup>
                        <label htmlFor="feDescription">Description</label>
                        <FormTextarea name="description" id="feDescription" rows="5" onChange={(e) => setAddSubCategoryDescription(e.target.value)} />
                        <p style={errorStyle}>{addSubCategoryDescriptionError}</p>
                    </FormGroup>

                    <div className="custom-file mb-3">
                        <input type="file" className="custom-file-input" id="customFile2" onChange={(e) => { uploadImage(e); }} />
                        <label className="custom-file-label" htmlFor="customFile2">
                            Choose file...
                        </label>
                        <p style={errorStyle}>{addNewCategoryImageError}</p>
                        <p style={successStyle}>{isImageSelected.image}</p>
                    </div>


                    <FormGroup>
                        <div className="custom-file mb-3">
                            <Link to={"#"} onClick={() => window.open("https://www.iloveimg.com/resize-image?utm_source=neprealestate")}>Resize image Online</Link>
                        </div>
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
