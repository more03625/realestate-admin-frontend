import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col, Card, CardHeader, CardBody

} from "shards-react";
import { capitalize, errorStyle, FrontEndURL, errorToast, successToast, convertToSlug, Endpoints, getUserToken } from '../../helper/comman_helpers';
import PageTitle from "../../components/common/PageTitle";
import { ToastContainer } from 'react-toastify';
import $ from "jquery";

import { Link } from 'react-router-dom';
import { scaleService } from 'chart.js';
import { Modal, Button } from "react-bootstrap";
import Axios from 'axios';
import { Host } from '../../helper/comman_helpers';
const Content = ({ allNews, setIsUpdated, isUpdated }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleStatusClose = () => setShowDeleteModal(false);
    const [requiredItem, setRequiredItem] = useState();

    $(document).ready(function () {
        setTimeout(function () {
            $("#newsTable").DataTable();
        }, 1000);
    });
    const deleteModal = (index) => {
        setRequiredItem(index); // set Index
        setShowDeleteModal(true); // Open Modal
    }
    const deleteBtn = async (delNewsID) => {
        var url = Host + Endpoints.deleteNews + delNewsID
        const result = await Axios.get(url, {
            headers: {
                token: getUserToken().token
            }
        });

        if (result.data.error === true) {
            errorToast()
        } else {
            setIsUpdated(!isUpdated);
            successToast();
            setShowDeleteModal(false);
        }
    }
    var modalData = (requiredItem !== null || requiredItem !== undefined) ? allNews[requiredItem] : '';

    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title="Manage News"
                    subtitle="News CRUD"
                    className="text-sm-left"
                />
            </Row>
            <ToastContainer />
            <Row>
                <Col>
                    <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">
                                <Link to={`/news/add-news`} type="button" className="btn btn-success">
                                    Add
                                </Link>
                            </h6>
                        </CardHeader>
                        <CardBody className="p-0 pb-3 m-2">
                            <table id="newsTable" className="table mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th scope="col" className="border-0">
                                            Sr.
                                        </th>
                                        <th scope="col" className="border-0">
                                            Name
                                        </th>

                                        <th scope="col" className="border-0">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allNews && allNews.map((value, index) => (
                                        <tr key={value.id}>
                                            <td>{index + 1}</td>

                                            <td>
                                                <Link target="_blank" to="#" onClick={() => window.open(`${FrontEndURL + "read/news/" + convertToSlug(value.title) + "/" + value.id}`)}>{value.title.slice(0, 70) + "..."}</Link>
                                            </td>

                                            <td>
                                                <button type="button" className="btn btn-danger mr-1" onClick={() => deleteModal(index)}>
                                                    <i className="material-icons">delete</i>
                                                </button>
                                                <Link to={`news/edit/${convertToSlug(value.title)}/${value.id}`} type="button" className="btn btn-success">
                                                    <i className="material-icons">edit</i>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>


                </Col>
            </Row>
            <Modal show={showDeleteModal} onHide={handleStatusClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete News</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Are you sure you want to delete this News?</p>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleStatusClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={() => deleteBtn(modalData && modalData.id)}>
                        Delete
                    </Button>
                </Modal.Footer>

            </Modal>
        </Container>

    )
}
export default Content;