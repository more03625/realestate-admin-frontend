import React, { useState } from "react";
import ReactQuill from "react-quill";
import { Card, Container, Row, CardBody, Form, FormInput } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import { ToastContainer } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Axios from "axios";
import { Host, Endpoints, getUserToken, errorToast, successToast } from "../../helper/comman_helpers";
import { useHistory } from "react-router-dom";

const Content = ({ setting, setSetting }) => {
    const [editedData, setEditedData] = useState(setting);
    const [content, setContent] = useState();
    const [loadingButton, setLoadingButton] = useState(false);

    const history = useHistory();

    const handleOnChange = (e) => {
        setSetting({ ...setting, [e.target.name]: e.target.value });
    }

    const contentChange = (e, editor) => {
        setContent(editor.getData())
    }

    const handleSubmit = async (e) => {
        setLoadingButton(true);
        e.preventDefault();

        var finalData = Object.assign(setting, { "content": content });
        console.log(finalData);

        var url = Host + Endpoints.editSettings;
        const result = await Axios.post(url, finalData, {
            headers: {
                token: getUserToken().token
            }
        });
        if (result.data.error === true) {
            errorToast(result.data.title);
        } else {
            successToast(result.data.title);
            setTimeout(function () {
                history.push("/settings-list");
            }, 1000);
        }

        setLoadingButton(false);


    }
    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title={`Update ${setting && setting.title}`}
                    subtitle="Manage Settings"
                    className="text-sm-left"
                />
            </Row>
            <ToastContainer />
            <Card small className="mb-3">
                <CardBody>
                    <Form className="add-new-post">
                        <FormInput size="lg" className="mb-3" placeholder="Please enter a title" name="title" defaultValue={setting && setting.title} onChange={(e) => handleOnChange(e)} />

                        <CKEditor
                            editor={ClassicEditor}
                            data={setting && setting.content}
                            onChange={contentChange}
                        />
                        {/*<ReactQuill className="add-new-post__editor mb-1" value={state.content} defaultValue={settingData && settingData.content} onChange={contentChange} />*/}

                        <button type="button" className="btn btn-primary mr-1 mt-2" onClick={handleSubmit}> Update <i className="material-icons">add</i>
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
    );

}

export default Content;
