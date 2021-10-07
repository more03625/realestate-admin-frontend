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
  Tooltip,
  FormInput, FormSelect,
} from "shards-react";
import Axios from "axios";
import PageTitle from "../../components/common/PageTitle";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { ToastContainer } from "react-toastify";
import { userStatus, userTypes } from '../../data/select.json';
import {
  capitalize,
  Host,
  Endpoints,
  successToast,
  errorToast,
  getUserToken, cleanObject, rowsLimit
} from "../../helper/comman_helpers";
import FiltersLogic from '../../views/properties/FiltersLogic';
import PaginationLogic from '../../views/properties/PaginationLogic';

const Content = () => {

  const [show, setShow] = useState(false);
  const [showSeller, setShowSeller] = useState(false);
  const [requiredItem, setRequiredItem] = useState();
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState();
  const [currentPage, setCurrentPage] = useState(0) // offset for Ajay
  const [searchOptions, setSearchOptions] = useState();
  const [runUseEffect, setRunUseEffect] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(rowsLimit);
  const [status, setStatus] = useState();

  const getUsers = async () => {
    if (searchOptions && searchOptions.limit !== undefined) {
      setLimit(parseInt(searchOptions.limit))
    }
    setLoading(true);

    var defaultSearchData = {
      limit: limit,
      offset: currentPage
    }
    var mergedSearchData = Object.assign(defaultSearchData, searchOptions);
    var url = Host + Endpoints.getSellers;
    const result = await Axios.post(url, cleanObject(mergedSearchData), {
      headers: {
        token: `${getUserToken().token}`,
      }
    });
    if (result.data.error === true) {
      setUsersError(result.data.title);
    } else {
      setTotalResults(result.data.data.total);
      setUsers(result.data.data.users);
    }
    setLoading(false);
  };

  const updateUser = (userID, userStatus) => {
    var data = {
      user_id: userID,
      status: status
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

  var modalData = requiredItem !== null || requiredItem !== undefined ? users[requiredItem] : "";

  useEffect(() => {
    getUsers();
  }, [runUseEffect, currentPage]);
  const [toolTip, setToolTip] = useState(false)
  const toggle = () => {
    setToolTip(!toolTip)
  }

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
          <CardHeader className="border-bottom">
            <FiltersLogic // My custom Package
              exportData={users}
              setCurrentPage={setCurrentPage}
              setSearchOptions={setSearchOptions}
              searchOptions={searchOptions}
              setRunUseEffect={setRunUseEffect}
              runUseEffect={runUseEffect}
              status={userStatus}
              userTypes={userTypes}
            />
          </CardHeader>

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
                      <td>{limit * currentPage + (index + 1)}</td>
                      <td>{value.name}</td>
                      <td>{value.email}</td>
                      <td>{value.mobile}</td>
                      <td>{capitalize(value.user_type)}</td>
                      <td style={{ cursor: "pointer" }} onClick={() => replaceModalItem(index)}>
                        {value.status === "active" ? (
                          <span className="badge badge-success">
                            {capitalize(value.status)}
                          </span>
                        ) : (
                          <span className="badge badge-danger">
                            {capitalize(value.status)}
                          </span>
                        )}
                      </td>
                      <td>


                        <Link

                          type="button"
                          className="btn btn-info mr-1"
                          to={`seller/properties/${value.id}`}
                        >
                          <i className="material-icons">home</i>
                        </Link>
                        <button
                          id="viewProperties"
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <FormGroup>
            <FormSelect id="feInputState" name="status" defaultValue={modalData && modalData.status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">property status</option>
              {
                userStatus.map((value, index) => (
                  <option key={index} value={value}>{capitalize(value)}</option>
                ))
              }
            </FormSelect>
          </FormGroup>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => updateUser(modalData.id)}
          >
            Update
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
            <FormInput readOnly={true} defaultValue={modalData && modalData.name !== undefined ? capitalize(modalData.name) : ''} />
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
            <label>User Type</label>
            <FormInput readOnly={true} defaultValue={modalData && modalData.user_type !== undefined ? capitalize(modalData.user_type) : ''} />
          </FormGroup>

          <FormGroup>
            <label>Status</label>
            <FormInput readOnly={true} defaultValue={modalData && modalData.status !== undefined ? capitalize(modalData.status) : ''} />
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
