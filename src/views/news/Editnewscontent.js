import React, { useState } from "react";
import ReactQuill from "react-quill";
import { Card, Container, Row, CardBody, Form, FormInput, FormGroup } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import { ToastContainer } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { Host, Endpoints, getUserToken, errorToast, successToast } from "../../helper/comman_helpers";
import { isValid } from "shortid";
const Editnewscontent = ({ detailedNews, newsID, setDetailedNews, detailedNewsError, setDetailedNewsError }) => {
    console.log(detailedNews);

    const history = useHistory();
    const errorStyle = {
        color: "red",
        fontSize: "14px",
    };
    const successStyle = {
        color: "#28a745",
        fontSize: "14px",
    };
    const [content, setContent] = useState();
    const [loadingButton, setLoadingButton] = useState(false);
    const [isImageSelected, setIsImageSelected] = useState(false);

    const uploadImage = (e) => {
        const image = e.target.files[0];
        setIsImageSelected({
            ...isImageSelected,
            image: `${image.name} has been selected`,
        });
        const base64Image = convertToBase64(image);
        base64Image.then((response) => {
            setDetailedNews({ ...detailedNews, image: response });
            // console.log(detailedNews);
        })

    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };
    const handleChange = (e) => {
        setDetailedNews({ ...detailedNews, [e.target.name]: e.target.value })
    }
    const openImage = (imageName) => {
        window.open(Host + imageName + ".jpg");
    }
    const handleDescriptionChange = (e, editor) => {
        setContent(editor.getData())
    }
    const isValid = () => {
        if (detailedNews == undefined || detailedNews.title === "" || detailedNews.title === null || detailedNews.title === undefined) {
            errorToast("title is required feild");
            setDetailedNewsError({ title: "title is required feild" });
            return false;
        } else if (newsID === undefined && isImageSelected === false) {
            errorToast("Please add a image!");
            setDetailedNewsError({ image: "Please add a image!" });
        } else if (
            content === "" ||
            content === null ||
            content === undefined
        ) {
            errorToast("description is required feild");
            setDetailedNewsError({ description: "Please add description!" });
            return false;
        } else {
            return true;
        }
    }
    const handleSubmit = async (e) => {
        setLoadingButton(true);
        e.preventDefault();
        console.log(content)
        if (isValid()) {
            if (isImageSelected === false) {
                Object.assign(detailedNews, { image: 0 })
            }
            Object.assign(detailedNews, { description: content })
            var url = newsID > 0 ? Host + Endpoints.editNews : Host + Endpoints.addNews
            const result = await Axios.post(url, detailedNews, {
                headers: {
                    token: getUserToken().token
                }
            });
            if (result.data.error === true) {
                errorToast(result.data.title);
            } else {
                successToast(result.data.title);
                setTimeout(function () {
                    history.push("/news");
                }, 1000);
            }
            setLoadingButton(false);
        } else {
            setLoadingButton(false);
        }
    }

    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title={newsID > 0 ? 'Edit News' : 'Add News'}
                    subtitle={newsID > 0 ? 'Edit News' : 'Add News'}
                    className="text-sm-left"
                />
            </Row>
            <ToastContainer />
            <Card small className="mb-3">
                <CardBody>
                    <Form className="add-new-post">
                        <FormInput size="lg" className="mb-3" placeholder="Please enter a title" name="title" defaultValue={detailedNews && detailedNews.title ? detailedNews.title : ''} onChange={(e) => handleChange(e)} />
                        <p style={errorStyle}>{detailedNewsError && detailedNewsError.title}</p>

                        <FormGroup>
                            <label htmlFor="iconInputAddress">Thumbnail</label>
                            <div className="custom-file mb-3">
                                <input type="file" className="custom-file-input" id="customFile2" name="image" onChange={(e) => { uploadImage(e); }} />
                                <label className="custom-file-label" htmlFor="customFile2">
                                    Choose file...
                                </label>
                                <p style={errorStyle}>{detailedNewsError && detailedNewsError.image}</p>
                                <p style={successStyle}>{isImageSelected && isImageSelected.image}</p>
                                {
                                    isImageSelected === true ?
                                        <p>
                                            <Link style={successStyle} to={"#"}>This image selected as a thumbnail!</Link>
                                        </p>
                                        : newsID > 0 ? <Link to="#" style={successStyle} onClick={() => openImage(detailedNews && detailedNews.image)}>This image selected as a thumbnail!</Link> : ''
                                }
                                <p style={errorStyle}>{detailedNewsError && detailedNewsError.description}</p>
                            </div>
                        </FormGroup>

                        <CKEditor
                            editor={ClassicEditor}
                            data={detailedNews && detailedNews.description}
                            onChange={handleDescriptionChange}
                        />
                        <p style={errorStyle}>{detailedNewsError && detailedNewsError.description}</p>

                        {/*<ReactQuill className="add-new-post__editor mb-1" value={state.content} defaultValue={detailedNewsData && detailedNewsData.content} onChange={contentChange} />*/}

                        <button type="button" className="btn btn-primary mr-1 mt-2" onClick={(e) => handleSubmit(e)}> {newsID > 0 ? 'Update News' : 'Add News'} <i className="material-icons">add</i>
                            {loadingButton === true ?
                                <div className="ml-1 spinner-border spinner-border-sm" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div> : ''
                            }
                        </button>
                    </Form>
                </CardBody>
            </Card>
        </Container>
    )
}
export default Editnewscontent;