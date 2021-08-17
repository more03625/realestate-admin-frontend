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

const News = () => {
    const [allNews, setAllNews] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);

    const getNews = async () => {
        var url = Host + Endpoints.getNews
        const result = await Axios.post(url);
        if (result.data.error === false) {
            setAllNews(result.data.data);
        }
    }

    useEffect(() => {
        getNews();
    }, [isUpdated]);

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
                    <Content allNews={allNews} setIsUpdated={setIsUpdated} isUpdated={isUpdated} />
                    {<MainFooter />}
                </Col>
            </Row>
        </Container>
    )
};

export default News;