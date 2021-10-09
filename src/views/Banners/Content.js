import React, { useState, useEffect } from 'react'
import { bannerAreas } from '../../data/select.json'
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormCheckbox,
    FormGroup,
    FormInput,
    FormSelect
} from "shards-react";
import Axios from 'axios';
import { Endpoints, errorToast, Host, errorStyle, getUserToken, successToast, capitalize, successStyle, convertToBase64, createReader } from '../../helper/comman_helpers';
import { Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
import PageTitle from '../../components/common/PageTitle';
import { isValid } from 'shortid';
export default function Content() {
    const [banners, setBanners] = useState([]);
    const [bannerData, setBannerData] = useState({});
    const [isImageSelected, setIsImageSelected] = useState(false);
    const [bannerError, setBannerError] = useState({});

    const [show, setShow] = useState(false);
    const [imageInfo, setImageInfo] = useState({});

    const [requiredSizes, setRequiredSizes] = useState({
        home: { width: 1920, height: 1078 },
        buy: { width: 1920, height: 1078 },
        rent: { width: 1920, height: 1078 },
        sold: { width: 1920, height: 1078 },
        share: { width: 1920, height: 1078 },
        findAgent: { width: 1920, height: 1078 },
        login: { width: 1280, height: 1920 },
        register: { width: 1280, height: 1920 },
        forgotPassword: { width: 1280, height: 1920 },
    });

    const handleClose = (modalName) => {
        if (modalName === 'add') {
            setShow(!show)
        } else if (modalName === 'edit') {
            // setShow(false)
        }
    }

    const getBanners = async (category) => {
        var url = Host + Endpoints.getBanners;

        var data = {
            category: category
        }

        const result = await Axios.post(url, data, {
            headers: {
                token: getUserToken().token
            }
        });
        if (result.data.error === true) {
            errorToast(result.data.title);
        } else {
            setBanners(result.data.data);
        }
    }
    const openModal = (modalName, index = '') => {
        if (modalName === 'add') {
            setShow(!show)
        } else if (modalName === 'edit') {
            setBannerData(banners[index]);
            setShow(!show)
        }
    }
    const handleChange = (e) => {
        if (e.target.name === 'category') {
            setImageInfo({ ...imageInfo, size: "Dimensions for " + capitalize(e.target.value) + " Page are " + requiredSizes[e.target.value].width + "px X " + requiredSizes[e.target.value].height + "px" });
        }
        setBannerData({ ...bannerData, [e.target.name]: e.target.value });
    }
    const isValid = () => {
        if (bannerData.category === '' || bannerData.category === undefined) {
            setBannerError({ category: 'Please choose banner page' });
            return false;
        } else if (bannerData.title === '' || bannerData.title === undefined) {
            setBannerError({ title: 'Please add title' });
            return false;
        } else if (bannerData.banner_image === '' || bannerData.banner_image === undefined) {
            setBannerError({ banner_image: 'Please select images' });
            return false;
        } else if (bannerData.status === '' || bannerData.status === undefined) {
            setBannerError({ status: 'Please selete status' });
            return false;
        } else {
            return true;
        }
    }

    const addBannerBtn = async () => {
        if (isValid()) {

            var updatedBannerData = isImageSelected ? bannerData : Object.assign(bannerData, { banner_image: 0 })
            var url = Host + Endpoints.editBanner;
            const result = await Axios.post(url, updatedBannerData, {
                headers: {
                    token: getUserToken().token
                }
            });

            if (result.data.error === true) {
                errorToast(result.data.title)
            } else {
                successToast(result.data.title);
                handleClose("edit")
                setIsImageSelected(false);
                Object.assign(bannerData, { banner_image: 0 }) // resetImageToNormalPosition
            }
        }
    }

    const uploadImage = async (e) => {
        if (bannerData.category !== undefined) {
            const files = e.target.files;
            var validImages = [];
            for (var i = 0; i < files.length; i++) {
                createReader(files[i], function (width, height, file) {
                    if (width === requiredSizes[bannerData.category].width && height === requiredSizes[bannerData.category].height) {
                        setImageInfo({
                            ...imageInfo,
                            banner_image: `${files.length} Images has been selected`,
                            isEveryThingValid: true
                        });
                        setBannerError({ ...bannerError, banner_image: '' });

                        const base64Image = convertToBase64(file);
                        base64Image.then((bsImage) => (
                            validImages.push(bsImage)
                        ))
                    } else {
                        setBannerError({ ...bannerError, banner_image: 'Invalid dimesion! Please check dimensions given below' });
                        setImageInfo({
                            ...imageInfo,
                            banner_image: '',
                            isEveryThingValid: false
                        });
                    }
                });
            }
            setBannerData({ ...bannerData, banner_image: validImages });
            setIsImageSelected(true);
        } else {
            alert('First select Banner Page');
        }
    }

    useEffect(() => {
        getBanners();
    }, [])

    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <ToastContainer />
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title="Manage Banners"
                    subtitle="Manage Banners"
                    className="text-sm-left"
                />
            </Row>
            <Row>
                <Col>
                    <Card small className="mb-4">
                        <CardHeader className="border-bottom">
                            <h6 className="m-0">
                                {/*  <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => openModal('add')}
                                >
                                    Add
                                </button>
                                */}
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
                                            Title
                                        </th>
                                        <th scope="col" className="border-0">
                                            Category
                                        </th>

                                        <th scope="col" className="border-0">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {banners && banners.map((value, index) => (
                                        <tr key={value.id}>
                                            <td>{index + 1}</td>
                                            <td>{value.title}</td>
                                            <td>{value.category}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-success"

                                                    onClick={() => openModal("edit", index)}
                                                >
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
            {/*Add Modal  */}
            <Modal size="lg" show={show} onHide={() => handleClose('add')}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Banner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <label htmlFor="feInputforState">Banner page</label>
                        <FormSelect id="feInputforState" name="category" onChange={(e) => handleChange(e)} value={bannerData.category}>
                            <option value="">Choose Banner page</option>
                            {
                                bannerAreas && bannerAreas.map((value, index) => (
                                    <option value={value}>{capitalize(value)} Page</option>
                                ))
                            }
                        </FormSelect>
                        <p style={errorStyle}>{bannerError.category}</p>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="feInputAddress">Title</label>
                        <FormInput id="feInputAddress" name="title" onChange={(e) => handleChange(e)} defaultValue={bannerData.title} />
                        <p style={errorStyle}>{bannerError.title}</p>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="iconInputAddress">Add Images</label>
                        <div className="custom-file mb-3">
                            <input type="file" className="custom-file-input" id="customFile2" name="banner_image[]" multiple onChange={(e) => { uploadImage(e); }} accept="image/jpeg, image/jpg, image/png, image/webp" />
                            <label className="custom-file-label" htmlFor="customFile2">
                                Choose file...
                            </label>
                            <span>
                                {
                                    /*
                                     bannerData.banner_image && JSON.parse("[" + bannerData.banner_image + "]")[0] && JSON.parse("[" + bannerData.banner_image + "]")[0].map((value, index) => {
                                         return <><a target="_blank" href={Host + value + ".jpg"}><span className="text-success">{`Image ${index + 1}`}</span></a> <br /></>
                                     })
                                    */
                                }
                            </span>
                            <p className="text-muted">{imageInfo.size}</p>
                            <p className="text-danger">{bannerError.banner_image}</p>
                            <p style={successStyle}>{imageInfo.banner_image}</p>
                        </div>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="feInputAddress">Quote</label>
                        <FormInput id="feInputAddress" name="quote" onChange={(e) => handleChange(e)} defaultValue={bannerData.quote} />
                        <p style={errorStyle}>{bannerError.quote}</p>
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="feInputforState">Status</label>
                        <FormSelect id="feInputforState" name="status" onChange={(e) => handleChange(e)} value={bannerData.status}>
                            <option value="">Choose status</option>
                            <option value="active">Active</option>
                            <option value="inactive">In-Active</option>
                        </FormSelect>
                        <p style={errorStyle}>{bannerError.status}</p>
                    </FormGroup>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose('add')}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addBannerBtn}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>

    )
}
