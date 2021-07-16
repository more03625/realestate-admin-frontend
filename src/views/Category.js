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
import PageTitle from "../components/common/PageTitle";
import {
  capitalize,
  Host,
  Endpoints,
  successToast,
  errorToast
} from "../helper/comman_helpers";
const Category = () => {
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState();
  const [active, setActive] = useState();

  var url = Host + Endpoints.getCategories;

  const getCategories = () => {
    Axios.get(url, null, {
      headers: {
        token: process.env.REACT_APP_API_KEY
      }
    }).then(response => {
      if (response.data.error === true) {
        setUsersError(response.data.title);
      } else {
        setUsers(response.data.data.users);
      }
    });
  };
  useEffect(() => {
    getCategories();
    console.log(active);
  }, [active]);
  function testfu(e) {
    console.log(e);
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

      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">List of all categories!</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0">
                      Sr.
                    </th>
                    <th scope="col" className="border-0">
                      Category Name
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
                      <td>
                        <button type="button" class="btn btn-success">
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
    </Container>
  );
};

export default Category;
