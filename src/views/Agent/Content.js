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
  FormCheckbox
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
  const [requiredItem, setRequiredItem] = useState();
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState();
  const [active, setActive] = useState();

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

  var modalData =
    requiredItem !== null || requiredItem !== undefined
      ? users[requiredItem]
      : "";

  var url = Host + Endpoints.agentList;

  useEffect(() => {
    getUsers();
  }, [active]);

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Manage Agents"
          subtitle="Agents CRUD"
          className="text-sm-left"
        />
      </Row>

      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">List of all Agents!</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3 m-2">
              <table id="example" className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0">
                      Sr.
                    </th>
                    <th scope="col" className="border-0">
                      Agent Name
                    </th>
                    <th scope="col" className="border-0">
                      Email
                    </th>
                    <th scope="col" className="border-0">
                      Phone
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
                          <i className="material-icons">edit</i>
                        </button>
                        <Link
                          to="#"
                          target="_blank"
                          type="button"
                          className="btn btn-info mr-1"
                        >
                          <i className="material-icons">visibility</i>
                        </Link>

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
        <Modal.Body>Are you sure you want to Update this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => updateUser(modalData.id, modalData.status)}
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Content;
