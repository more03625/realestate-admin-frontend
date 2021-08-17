import React, { useEffect, Fragment, useState, useRef } from 'react';
import Editnewscontent from './Editnewscontent';
import {
    Container,
    Row,
    Col,

} from "shards-react";
import MainNavbar from '../../components/layout/MainNavbar/MainNavbar';
import MainSidebar from '../../components/layout/MainSidebar/MainSidebar';
import MainFooter from '../../components/layout/MainFooter';
import { useParams } from 'react-router-dom';
import { Host, Endpoints } from "../../helper/comman_helpers";
import Axios from "axios";
const Editnews = () => {
    const { slug, newsID } = useParams();
    console.log(slug)
    console.log(newsID)
    const [detailedNewsError, setDetailedNewsError] = useState();
    const [detailedNews, setDetailedNews] = useState();

    const getNewsDetails = () => {
        if (newsID > 0) {
            var url = Host + Endpoints.getNewsDetails + newsID;
            Axios.get(url).then((response) => {
                if (response.data.error === false) {
                    console.log(response.data.data)
                    setDetailedNews(response.data.data);
                } else {
                    setDetailedNews(false);
                    setDetailedNewsError(response.data.title);
                }
            });
        }
    };

    console.log(detailedNews)
    useEffect(() => {
        window.scrollTo(0, 0);
        getNewsDetails();
    }, [newsID]);
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
                    <Editnewscontent detailedNews={detailedNews} newsID={newsID} setDetailedNews={setDetailedNews} detailedNewsError={detailedNewsError} setDetailedNewsError={setDetailedNewsError} />
                    {<MainFooter />}
                </Col>
            </Row>
        </Container>


    )
}
export default Editnews;