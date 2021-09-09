import React from "react";
import {
    Container,
    Row,
    Col,

} from "shards-react";
import MainNavbar from "../../components/layout/MainNavbar/MainNavbar";
import MainSidebar from "../../components/layout/MainSidebar/MainSidebar";
import MainFooter from "../../components/layout/MainFooter";
import Content from './Content';
import ContentDemo from './ContentDemo';
import { ExportCSV } from "./Export";
import DataList from "./Datalist";
import FullRemote from "./FullRemote";
const Subcategory = () => {
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
                    <Content />

                    {/*<DataList />*/}
                    {/*<FullRemote />*/}
                    {/*<ContentDemo />*/}
                    {<MainFooter />}
                </Col>
            </Row>
        </Container>
    )
};

export default Subcategory;