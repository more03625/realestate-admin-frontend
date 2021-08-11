import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,

} from "shards-react";
import MainNavbar from "../../components/layout/MainNavbar/MainNavbar";
import MainSidebar from "../../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../../components/layout/MainFooter";
import Content from './Content';
import Axios from "axios";
import { Endpoints, getUserToken, Host } from "../../helper/comman_helpers";

const SettingsList = () => {
    const [allSettings, setSettings] = useState([]);
    const getSettings = async () => {
        var url = Host + Endpoints.getAllSettings
        const result = await Axios.get(url, {
            headers: {
                token: getUserToken().token
            }
        });
        if (result.data.error === false) {
            setSettings(result.data.data.settings);
        }
    }
    useEffect(() => {
        getSettings();
    }, []);
    return (
        <Container fluid>
            <Row>
                <MainSidebar />
                <Col
                    className="main-content p-0"
                    lg={{ size: 10, offset: 2 }}
                    md={{ size: 9, offset: 3 }}
                    sm="12"
                    tag="main"
                >
                    {<MainNavbar />}
                    <Content allSettings={allSettings} />
                    {<MainFooter />}
                </Col>
            </Row>
        </Container>
    )
};

export default SettingsList;