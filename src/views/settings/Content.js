import React, { useState } from "react";
import ReactQuill from "react-quill";
import { Card, Container, Row, CardBody, Form, FormInput } from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import { ToastContainer } from "react-toastify";
import "react-quill/dist/quill.snow.css";
import "../../assets/quill.css";

const Content = ({ setting }) => {
    const [settingsData, setSettingsData] = useState([]);
    const [state, setState] = useState({ content: null });
    var settingData = setting[0];
    const handleOnChange = (e) => {
        setSettingsData({ ...settingData, [e.target.name]: e.target.value });
    }
    const contentChange = (content) => {
        setState({ content });
        console.log(state)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(settingsData)
    }
    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title={`Update ${settingData && settingData.title}`}
                    subtitle="Manage Settings"
                    className="text-sm-left"
                />
            </Row>
            <ToastContainer />
            <Card small className="mb-3">
                <CardBody>
                    <Form className="add-new-post">
                        <FormInput size="lg" className="mb-3" placeholder="Please enter a title" name="Pagetitle" defaultValue={settingData && settingData.title} onChange={(e) => handleOnChange(e)} />

                        <ReactQuill className="add-new-post__editor mb-1" value={state.content} defaultValue={settingData && settingData.content} onChange={contentChange} />

                        <button type="button" className="btn btn-primary mr-1" onClick={handleSubmit}> Update <i className="material-icons">add</i></button>
                    </Form>
                </CardBody>
            </Card>
        </Container>
    );

}

export default Content;
