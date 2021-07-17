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
  errorToast
} from "../helper/comman_helpers";
const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState();
  const [requiredItem, setRequiredItem] = useState();
  //Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [newCategoryName, setNewCategoryName] = useState();
  const [categoryID, setCategoryID] = useState();
  const [newStatus, setNewStatus] = useState();
  //
  const [adddCategoryName, setAddCategoryName] = useState();
  const [adddCategoryNameError, setAddCategoryNameError] = useState();

  const [addShow, setAddShow] = useState(false);

  const handleAddClose = () => setAddShow(false);

  const addCategoryBtn = () => {

    if (adddCategoryName === '' || adddCategoryName === null || adddCategoryName === undefined) {
      setAddCategoryNameError("Please enter a valid category name!");
    } else {
      var addCategoryURL = Host + Endpoints.addCategory;
      Axios.post(addCategoryURL, {
        "name": adddCategoryName
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
  var categoryData = {
    "id": categoryID,
    "name": newCategoryName
  }
  const editCategory = () => {
    var editCategoryURL = Host + Endpoints.editCategory;
    Axios.post(editCategoryURL, categoryData, {
      headers: {
        "token": process.env.REACT_APP_API_KEY
      }
    }).then((response) => {
      console.log(response.data.error);
      if (response.data.error === true) {
        errorToast(response.data.title);
      } else {
        successToast(response.data.title);
      }

    })
    setShow(false);
  }


  const getCategories = () => {
    var url = Host + Endpoints.getCategories;
    Axios.get(url, {
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
  };
  useEffect(() => {
    getCategories();
  }, []);
  const replaceModalItem = (index) => {
    setCategoryID(categories[index].id);
    setNewCategoryName(categories[index].name);
    setNewStatus(categories[index].status);

    setRequiredItem(index);
    setShow(true);
  }

  var modalData = (requiredItem !== null || requiredItem !== undefined) ? categories[requiredItem] : '';

  const addCategoryModal = () => {
    setAddShow(true);
  }
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Manage Category"
          subtitle="Category CRUD"
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
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0">
                      Sr.
                    </th>
                    <th scope="col" className="border-0">
                      Category Name
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
                  {categories.map((value, index) => (
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
                          <span style={{ color: "red" }}>
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

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <FormGroup>
            <label htmlFor="feInputAddress">Category Name</label>
            <FormInput id="feInputAddress" placeholder="Category Name" onChange={(e) => setNewCategoryName(e.target.value)} defaultValue={modalData && modalData.name !== undefined ? modalData.name : ''} />
            <input type="hidden" name="categoryID" value={modalData && modalData.id !== undefined ? modalData.id : ''} />
          </FormGroup>
          <FormGroup>
            {/*
            <label htmlFor="feInputState">State</label>
            <FormSelect id="feInputState" onChange={(e) => setNewStatus(e.target.value)}>
              <option>Choose Status</option>
              <option value="active">Acive</option>
              <option value="deactive">DeAcive</option>
            </FormSelect>
              */}
          </FormGroup>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={editCategory}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/*Add Modal*/}
      <Modal size="lg" show={addShow} onHide={handleAddClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <FormGroup>
            <label htmlFor="feInputAddress">Category Name</label>
            <FormInput id="feInputAddress" placeholder="Category Name" onChange={(e) => setAddCategoryName(e.target.value)} />
          </FormGroup>
          <FormGroup>
            {/*
            <label htmlFor="feInputState">Status</label>
            <FormSelect id="feInputState" onChange={(e) => setNewStatus(e.target.value)}>
              <option>Choose Status</option>
              <option value="active">Acive</option>
              <option value="deactive">DeAcive</option>
            </FormSelect>
          */}
          </FormGroup>
          <FormGroup>
            <p className="text-center justify-content-center" style={{ color: "red" }}>{adddCategoryNameError}</p>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddClose}>
            Close
          </Button>

          <Button variant="primary" onClick={addCategoryBtn}>
            Add Category
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Category;
