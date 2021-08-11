


import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "shards-react";

import Content from "./Content";
import MainSidebar from "../../components/layout/MainSidebar/MainSidebar";
import MainNavbar from "../../components/layout/MainNavbar/MainNavbar";
import MainFooter from "../../components/layout/MainFooter";
import { useParams } from "react-router-dom";
import { Host, Endpoints, getUserToken } from "../../helper/comman_helpers";
import Axios from "axios";
const Settings = () => {
    let { slug } = useParams();
    const [setting, setSetting] = useState([]);


    const getSettingsBySlug = async () => {
        var url = Host + Endpoints.getSettingBySlug
        const result = await Axios.get(url, {
            params: {
                slug: slug
            }
        }, {
            headers: {
                token: getUserToken().token
            }
        });
        console.log(result);
        if (result.data.error === false) {
            setSetting(result.data.data.settings);
        }
    }
    useEffect(() => {
        getSettingsBySlug();
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
                    <Content setting={setting} />
                    {<MainFooter />}
                </Col>
            </Row>
        </Container>
    )
};

export default Settings;
