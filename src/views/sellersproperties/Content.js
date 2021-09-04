import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,

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
    getUserToken, convertToSlug, FrontEndURL
} from "../../helper/comman_helpers";
import $ from "jquery";
import { useParams } from "react-router-dom";

const Content = () => {
    $(document).ready(function () {
        setTimeout(function () {
            $("#propertiesTable").DataTable();
        }, 1000);

    });

    const handleStatusClose = () => setshowStatusModal(false);
    const [requiredItem, setRequiredItem] = useState();
    const [showStatusModal, setshowStatusModal] = useState(false);
    const [runUseEffect, setRunUseEffect] = useState(false);
    const { sellerID } = useParams()
    const [sellerProperties, setSellerProperties] = useState([]);

    const getSellerProperties = async () => {
        var url = Host + Endpoints.getPropertiesBySellerID
        const result = await Axios.post(url, { id: sellerID });
        if (result.data.error === false) {
            setSellerProperties(result.data.data.users);

        }
    }
    const redirectToView = (title, id, type) => {
        if (type == 'view') {
            var url = `${FrontEndURL}property/${title}/${id}`;
        } else {
            var url = `${FrontEndURL}edit-property/${title}/${id}`;
        }
        window.open(url)
    }
    const changeStatusModal = index => {
        setRequiredItem(index); // set Index
        setshowStatusModal(true); // Open Modal
    };

    const updateStatus = (id, status) => {
        var data = {
            id,
            status: status === "active" ? "inactive" : "active"
        };
        var url = Host + Endpoints.updatePropertyStatus;
        Axios.post(url, data, {
            headers: {
                token: `${getUserToken().token}`,
            }
        }).then(response => {
            if (response.data.error === true) {
                errorToast(response.data.title);
            } else {
                successToast(response.data.title);
                setRunUseEffect(!runUseEffect);

                setshowStatusModal(false);
            }
        });
    };
    var modalData = (requiredItem != undefined && requiredItem !== null) ? sellerProperties[requiredItem] : '';

    useEffect(() => {
        getSellerProperties();
    }, [runUseEffect]);
    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title={`Total ${sellerProperties.length} Properties`}
                    subtitle="The use has posted"
                    className="text-sm-left"
                />
            </Row>
            <ToastContainer />

            <Row>
                <Col>
                    <Card small className="mb-4">

                        <CardBody className="p-0 pb-3 m-2">
                            <table id="propertiesTable" className="table mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th scope="col" className="border-0">
                                            Sr.
                                        </th>

                                        <th scope="col" className="border-0">
                                            Title
                                        </th>
                                        <th scope="col" className="border-0">
                                            Contact Name
                                        </th>
                                        <th scope="col" className="border-0">
                                            Contact Number
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

                                    {sellerProperties && sellerProperties.map((value, index) => (
                                        <tr key={value.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Link to="#" onClick={(e) => redirectToView(convertToSlug(value.title), value.id, "view")}>{value.title.slice(0, 46) + "..."}</Link>
                                            </td>
                                            <td>{value.name_for_contact}</td>
                                            <td>{value.number_for_contact}</td>

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

                                                <Link
                                                    to="#"
                                                    type="button"
                                                    className="btn btn-info mr-1"
                                                    onClick={(e) => redirectToView(convertToSlug(value.title), value.id, "view")}
                                                >
                                                    <i className="material-icons">visibility</i>

                                                </Link>

                                                <Link
                                                    to="#"
                                                    type="button"
                                                    className="btn btn-success mr-1"
                                                    onClick={(e) => redirectToView(convertToSlug(value.title), value.id, "edit")}
                                                >
                                                    <i className="material-icons">edit</i>
                                                </Link>

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
                    Are you sure you want to <b>{`${modalData && modalData.status === 'active' ? 'Deactivate' : 'Activate'}`}</b> this property?
                </Modal.Body>
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



        </Container>
    );
}
export default Content;