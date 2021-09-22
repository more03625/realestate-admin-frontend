import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  FormInput
} from "shards-react";
import Axios from "axios";
import PageTitle from "../../components/common/PageTitle";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer } from 'react-toastify';

import {
  capitalize,
  Host,
  Endpoints,
  successToast,
  errorToast,
  getUserToken
} from "../../helper/comman_helpers";
import FiltersLogic from '../properties/FiltersLogic'
import PaginationLogic from '../properties/PaginationLogic'
import { userStatus } from '../../data/select.json'
const Content = () => {

  const [show, setShow] = useState(false);
  const [requiredItem, setRequiredItem] = useState();
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState();
  const [active, setActive] = useState();
  // PAGINATIO & FILTER

  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(0) // offset for Ajay
  const [searchOptions, setSearchOptions] = useState();
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [runUseEffect, setRunUseEffect] = useState(false);

  const getUsers = async () => {

    if (searchOptions && searchOptions.limit !== undefined) {
      setLimit(searchOptions.limit)
    }
    setLoading(true);

    var defaultSearchData = {
      limit: limit,
      offset: currentPage
    }
    var mergedSearchData = Object.assign(defaultSearchData, searchOptions);

    var url = Host + Endpoints.getSubscribers;

    const result = await Axios.post(url, mergedSearchData, {
      headers: {
        token: `${getUserToken().token}`,
      }
    })
    if (result.data.error === true) {
      setUsersError(result.data.title);
    } else {
      setUsers(result.data.data.users);
      setTotalResults(result.data.data.total);
    }
    setLoading(false);

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


  useEffect(() => {
    getUsers();
  }, [runUseEffect, currentPage]);

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Manage Subscriber"
          subtitle="Subscriber CRUD"
          className="text-sm-left"
        />
      </Row>
      <Row>
        <Col>
          <CardHeader className="border-bottom">
            <FiltersLogic // My custom Package
              exportData={users}
              setCurrentPage={setCurrentPage}
              setSearchOptions={setSearchOptions}
              searchOptions={searchOptions}
              setRunUseEffect={setRunUseEffect}
              runUseEffect={runUseEffect}
              status={userStatus}
            />
          </CardHeader>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">List of all Sunscribers!</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3 m-2">
              <table id="example" className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0">
                      Sr.
                    </th>
                    <th scope="col" className="border-0">
                      Subscriber Name
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
                          className="btn btn-info mr-1"
                          onClick={() => replaceModalItem(index)}
                        >
                          <i className="material-icons">visibility</i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <PaginationLogic // My custom Package
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalResults={totalResults}
                limit={limit}
                paginationData={users}
                loading={loading}
              />
              <ToastContainer />
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/*Are you sure you want to deactive this user?*/}
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Subscriber Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <label>Subscriber Name</label>
            <FormInput readOnly={true} defaultValue={modalData && modalData.name !== undefined ? modalData.name : ''} />
          </FormGroup>

          <FormGroup>
            <label> Email </label>
            <FormInput readOnly={true} defaultValue={modalData && modalData.email !== undefined ? modalData.email : ''} />
          </FormGroup>

          <FormGroup>
            <label>Mobile</label>
            <FormInput readOnly={true} defaultValue={modalData && modalData.mobile !== undefined ? modalData.mobile : ''} />
          </FormGroup>

          <FormGroup>
            <label>Category</label>
            <FormInput readOnly={true} defaultValue={modalData && modalData.category_name !== undefined ? modalData.category_name : ''} />
          </FormGroup>

          <FormGroup>
            <label>Sub Category</label>
            <FormInput readOnly={true} defaultValue={modalData && modalData.sub_category_name !== undefined ? modalData.sub_category_name : ''} />
          </FormGroup>

          <FormGroup>
            <label>Minimum Price</label>
            <FormInput readOnly={true} defaultValue={modalData && modalData.min_price !== undefined ? modalData.min_price : ''} />
          </FormGroup>

          <FormGroup>
            <label>Maximum Price</label>
            <FormInput readOnly={true} defaultValue={modalData && modalData.max_price !== undefined ? modalData.max_price : ''} />
          </FormGroup>

          <FormGroup>
            <label>City</label>
            <FormInput readOnly={true} defaultValue={modalData && modalData.city_name !== undefined ? modalData.city_name : ''} />
          </FormGroup>

          <FormGroup>
            <label>State</label>
            <FormInput readOnly={true} defaultValue={modalData && modalData.state_name !== undefined ? modalData.state_name : ''} />
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


    </Container>
  );
};

export default Content;
