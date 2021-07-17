import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  FormCheckbox,
  FormGroup, FormInput, FormSelect
} from "shards-react";
import Axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import PageTitle from "../components/common/PageTitle";
import {
  capitalize,
  Host,
  Endpoints,
  successToast,
  errorToast, errorStyle
} from "../helper/comman_helpers";
import $ from "jquery";

const SubCategory = () => {

  $(document).ready(function () {
    setTimeout(function () {
      $("#subCategoryTable").DataTable();
    }, 1000);

  });

  const [addSubCategoryNameError, setAddSubCategoryNameError] = useState(null);
  const [subCategoriesError, setSubCategoriesError] = useState();
  const [addNewCategoryError, setAddNewCategoryError] = useState(null);

  const [subCategories, setSubCategories] = useState([]);
  const [requiredItem, setRequiredItem] = useState();
  const [showEditModal, setEditModalShow] = useState(false);
  const [addNewCategory, setAddNewCategory] = useState();
  const [addSubCategoryName, setAddSubCategoryName] = useState();
  const [addShow, setAddShow] = useState(false);
  const [categoryID, setCategoryID] = useState();
  const [subCategoryID, setSubCategoryID] = useState();
  const [newCategoryName, setNewCategoryName] = useState();

  const handleAddClose = () => setAddShow(false);
  const handleClose = () => setEditModalShow(false);

  const [categoriesError, setCategoriesError] = useState();
  const [categories, setCategories] = useState([]);

  const addSubCategoryBtn = () => {
    setAddNewCategoryError(null);
    setAddSubCategoryNameError(null);
    if (addNewCategory === undefined || addSubCategoryName === undefined) {
      setAddNewCategoryError("Please enter valid category!")
      setAddSubCategoryNameError("Please enter a valid sub category name!");
    }
    else {
      var addSubCategoryURL = Host + Endpoints.addSubCategory;
      Axios.post(addSubCategoryURL, {
        "category_id": addNewCategory,
        "name": addSubCategoryName
      }, {
        headers: {
          token: process.env.REACT_APP_API_KEY
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

  const updateSubCategory = () => {
    setAddSubCategoryNameError("");
    setAddNewCategoryError("");

    var updateSubCategoryURL = Host + Endpoints.editSubCategory;
    var categoryData = {
      "id": subCategoryID,
      "category_id": categoryID,
      "name": newCategoryName
    }

    if (newCategoryName === '' || categoryID === '') {
      setAddSubCategoryNameError("Please enter subcategory name !");
      setAddNewCategoryError("Please select category!");
    } else {
      Axios.post(updateSubCategoryURL, categoryData, {
        headers: {
          "token": process.env.REACT_APP_API_KEY
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
  const getSubCategories = () => {
    var url = Host + Endpoints.getSubCategories;
    Axios.get(url, {
      headers: {
        'token': process.env.REACT_APP_API_KEY,
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
        'token': process.env.REACT_APP_API_KEY,
      }
    }).then(response => {
      if (response.data.error === true) {
        setCategoriesError(response.data.title);
      } else {
        setCategories(response.data.data.categories);
      }
    });
  }
  useEffect(() => {
    getSubCategories();
    getCategories();
  }, []);
  const replaceModalItem = (index) => {
    setSubCategoryID(subCategories[index].id);
    setCategoryID(subCategories[index].category_id);
    setNewCategoryName(subCategories[index].name);

    setRequiredItem(index);
    setEditModalShow(true);
  }

  var modalData = (requiredItem !== null || requiredItem !== undefined) ? subCategories[requiredItem] : '';

  const addCategoryModal = () => setAddShow(true);
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
                    {/*
                    <th scope="col" className="border-0">
                      Status
                    </th>
                    */}
                    <th scope="col" className="border-0">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>

                  {subCategories.map((value, index) => (
                    <tr key={value.id}>
                      <td>{value.id}</td>
                      <td>{value.name}</td>
                      {/*
                      <td>
                        {value.status === "active" ? (
                          <span style={{ color: "green" }}>
                            {capitalize(value.status)}
                          </span>
                        ) : (
                          <span style={errorStyle}>
                            {capitalize(value.status)}
                          </span>
                        )}
                      </td>
                    */}
                      <td>
                        <button type="button" className="btn btn-success" onClick={() => replaceModalItem(index)}>
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
            <label htmlFor="feInputState">Category</label>
            {console.log(modalData)}
            <FormSelect id="feInputState" onChange={(e) => setCategoryID(e.target.value)} value={modalData && modalData.category_id ? modalData.category_id : ''}>
              <option>Choose Status</option>
              {categories.map((value, index) => (
                <option key={value.id} value={value.id}>{value.name}</option>
              ))}
            </FormSelect>
            <p style={errorStyle}>{addNewCategoryError}</p>
          </FormGroup>

          <FormGroup>
            <label htmlFor="feInputAddress">Category Name</label>
            <FormInput id="feInputAddress" placeholder="Category Name" onChange={(e) => setNewCategoryName(e.target.value)} defaultValue={modalData && modalData.name !== undefined ? modalData.name : ''} />
            <input type="hidden" name="categoryID" value={modalData && modalData.id !== undefined ? modalData.id : ''} />
            <p style={errorStyle}>{addSubCategoryNameError}</p>
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
            <FormSelect id="feInputState" onChange={(e) => setAddNewCategory(e.target.value)}>
              <option>Choose Category</option>
              {categories.map((value, index) => (
                <option key={value.id} value={value.id}>{value.name}</option>
              ))}

            </FormSelect>
            <p style={errorStyle}>{addNewCategoryError}</p>
          </FormGroup>
          <FormGroup>
            <label htmlFor="feInputAddress">Sub Category</label>
            <FormInput id="feInputAddress" placeholder="Sub Category" onChange={(e) => setAddSubCategoryName(e.target.value)} />
            <p style={errorStyle}>{addSubCategoryNameError}</p>
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

export default SubCategory;
