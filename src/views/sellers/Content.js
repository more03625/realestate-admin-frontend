import "jquery/dist/jquery.min.js";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";
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
  FormInput
} from "shards-react";
import Axios from "axios";
import PageTitle from "../../components/common/PageTitle";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { ToastContainer } from "react-toastify";

import {
  capitalize,
  Host,
  Endpoints,
  successToast,
  errorToast,
  getUserToken
} from "../../helper/comman_helpers";

const Content = () => {
  $(document).ready(function () {
    setTimeout(function () {
      $("#example").DataTable();
    }, 1000);

  });

  const [show, setShow] = useState(false);
  const [showSeller, setShowSeller] = useState(false);
  const [requiredItem, setRequiredItem] = useState();
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState();

  const [runUseEffect, setRunUseEffect] = useState(false);

  const getUsers = () => {
    Axios.post(url, {
      "limit": 200
    }, {
      headers: {
        token: `${getUserToken().token}`,
      }
    }).then(response => {
      if (response.data.error === true) {
        setUsersError(response.data.title);
      } else {
        setUsers(response.data.data.users);
      }
    });
  };

  const updateUser = (userID, userStatus) => {
    var data = {
      user_id: userID,
      status: userStatus === "blocked" ? "active" : "blocked"
    };
    var url = Host + Endpoints.changeUserStatus;
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
      }
    });
    getUsers();
    setShow(false);
  };
  const handleClose = () => {
    setShow(false);
  };
  const replaceModalItem = index => {
    setRequiredItem(index); // set Index
    setShow(true); // Open Modal
  };

  const handleCloseSeller = () => {
    setShowSeller(false);
  };
  const replaceSellerModalItem = index => {
    setRequiredItem(index); // set Index
    setShowSeller(true); // Open Modal
  };

  var modalData =
    requiredItem !== null || requiredItem !== undefined
      ? users[requiredItem]
      : "";

  var url = Host + Endpoints.getSellers;

  useEffect(() => {
    getUsers();
  }, [runUseEffect]);

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Manage Sellers"
          subtitle="Sellers CRUD"
          className="text-sm-left"
        />
      </Row>

      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">List of all Sellers!</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3 m-2">
              <table id="example" className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0">
                      Sr.
                    </th>
                    <th scope="col" className="border-0">
                      Name
                    </th>
                    <th scope="col" className="border-0">
                      Email
                    </th>
                    <th scope="col" className="border-0">
                      Phone
                    </th>
                    <th scope="col" className="border-0">
                      User Type
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
                  {users.map((value, index) => (
                    <tr key={value.id}>
                      <td>{value.id}</td>
                      <td>{value.name}</td>
                      <td>{value.email}</td>
                      <td>{value.mobile}</td>
                      <td>{capitalize(value.user_type)}</td>
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
                      <td>
                        <button
                          type="button"
                          className="btn btn-warning mr-1"
                          onClick={() => replaceModalItem(index)}
                        >
                          <i className="material-icons">build</i>
                        </button>
                        <Link
                          type="button"
                          className="btn btn-info mr-1"
                          to={`seller/properties/${value.id}`}
                        >
                          <i className="material-icons">home</i>
                        </Link>
                        <button
                          type="button"
                          className="btn btn-info mr-1"
                          onClick={() => replaceSellerModalItem(index)}
                        >
                          <i className="material-icons">visibility</i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ToastContainer />
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/*Are you sure you want to deactive this user?*/}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {`${modalData && modalData.status === 'active' ? 'Deactivate' : 'Activate'}`} this user ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => updateUser(modalData.id, modalData.status)}
          >
            {`${modalData && modalData.status === 'active' ? 'Deactivate' : 'Activate'}`}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size="lg" show={showSeller} onHide={handleCloseSeller}>
        <Modal.Header closeButton>
            <Modal.Title>Seller Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormGroup>
                <label>Name</label>
                <FormInput readOnly= {true}  defaultValue={modalData && modalData.name !== undefined ? capitalize(modalData.name) : ''} />
            </FormGroup>

            <FormGroup>
                <label> Email </label>
                <FormInput readOnly= {true}  defaultValue={modalData && modalData.email !== undefined ? modalData.email : ''} />
            </FormGroup>

            <FormGroup>
                <label>Mobile</label>
                <FormInput readOnly= {true}  defaultValue={modalData && modalData.mobile !== undefined ? modalData.mobile : ''} />
            </FormGroup>

            <FormGroup>
                <label>User Type</label>
                <FormInput readOnly= {true}  defaultValue={modalData && modalData.user_type !== undefined ? capitalize(modalData.user_type) : ''} />
            </FormGroup>

            <FormGroup>
                <label>Status</label>
                <FormInput readOnly= {true}  defaultValue={modalData && modalData.status !== undefined ? capitalize(modalData.status) : ''} />
            </FormGroup>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseSeller}>
                Close
            </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Content;
