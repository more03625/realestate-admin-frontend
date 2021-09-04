import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody
} from "shards-react";
import PageTitle from "../../components/common/PageTitle";
import { ToastContainer } from 'react-toastify';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';
import { Spinner } from 'react-bootstrap';
const DataList = () => {
    const { SearchBar } = Search;
    const selectOptions = {
        0: 'good',
        1: 'Bad',
        2: 'unknown'
    };
    const spinnerStyle = {
        display: "block",
        position: "fixed",
        top: "50%",
        right: "40%", /* or: left: 50%; */
    }
    const [userList, setUserList] = useState([]);
    const { ExportCSVButton } = CSVExport;
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const MyExportCSV = (props) => {

        const handleClick = () => {
            props.onExport();
        };
        return (
            <button className="btn btn-success mb-2 mr-2" onClick={handleClick}>Export</button>
        )
    }

    const getUser = async (currentPage = currentPage, perPage = perPage) => {
        setLoading(true);
        const result = await Axios.get(`https://dummyapi.io/data/v1/post?page=${currentPage}&limit=${perPage}`, {
            headers: {
                'app-id': '612db5222430a71605f59647'
            }
        });
        setTotal(result.data.total); // number
        setUserList(result.data.data);
        setLoading(false);
    }
    const columns = [
        { dataField: 'id', text: 'id', sort: true, filter: textFilter() },
        { dataField: 'owner.lastName', text: 'Name', sort: true, filter: textFilter() },
        { dataField: 'text', text: 'text', sort: true, filter: textFilter() },

    ];
    console.log(total)
    const pagination = paginationFactory({
        page: currentPage,
        sizePerPage: perPage,
        totalSize: total,
        lastPageText: '>>',
        firstPageText: '<<',
        nextPageText: '>',
        prePageText: '<',
        showTotal: true,
        alwaysShowAllBtns: true,


        onPageChange: function (page, sizePerPage) {
            console.log("page =======> ", page)
            console.log("sizePerPage OR LIMIT A =======> ", sizePerPage)
            getUser(page, sizePerPage);

            setCurrentPage(page);
            setPerPage(sizePerPage)
        },
        onSizePerPageChange: (sizePerPage, page) => {
            getUser(page, sizePerPage);
            console.log("sizePerPage OR LIMIT B=======> ", sizePerPage)
            console.log(sizePerPage)
        },

    });
    const onTableChange = (type, newState) => {

        console.log("type ===> ", type)
        console.log("newState ===> ", newState)
        console.log(newState)
        var data = newState.data;

        var search = newState.searchText
        var sizePerPage = newState.sizePerPage;
        var sortField = newState.sortField;
        var sortOrder = newState.sortOrder;
        var filters = newState.filters;

        console.log("filters  =======> ", filters);
        console.log()


        console.log("filters  =======> ", filters.length);
        setTimeout(() => {
            let result;
            if (sortOrder !== undefined) {
                if (sortOrder === 'asc') {
                    result = data.sort((a, b) => {
                        if (a[sortField] > b[sortField]) {
                            return 1;
                        } else if (b[sortField] > a[sortField]) {
                            return -1;
                        }
                        return 0;
                    });
                } else {
                    result = data.sort((a, b) => {
                        if (a[sortField] > b[sortField]) {
                            return -1;
                        } else if (b[sortField] > a[sortField]) {
                            return 1;
                        }
                        return 0;
                    });
                }

                console.log(result)
                setUserList(result)
            } else if (Object.keys(filters).length !== 0) {
                const result = userList.filter((row) => {
                    let valid = true;
                    for (const dataField in filters) {
                        console.log(filters)
                        const { filterVal, filterType, comparator } = filters[dataField];
                        console.log("filterVal =====> ", filterVal)
                        console.log("filterType =====> ", filterType)
                        console.log("comparator =====> ", comparator)
                        if (filterType === 'TEXT') {
                            if (comparator === 'LIKE') {
                                console.log(row)
                                console.log(dataField)
                                console.log(row.dataField)
                                console.log(row[dataField])
                                console.log(row.owner)
                                console.log(row.owner.lastName)

                                // valid = row.dataField.toString().indexOf(filterVal) > -1;
                            } else {
                                valid = row.dataField === filterVal;
                            }
                        }
                        if (!valid) break;
                    }
                    return valid;
                });
                console.log(result)
                setUserList(result)
            } else {
                console.log('I am in else');
            }


        }, 2000);
    }
    useEffect(() => {
        getUser(currentPage, perPage);
    }, []);
    return (
        <>
            <Container fluid className="main-content-container px-4">
                {/* Page Header */}
                <Row noGutters className="page-header py-4">
                    <PageTitle
                        sm="4"
                        title="Manage Properties"
                        subtitle="Manage Properties"
                        className="text-sm-left"
                    />
                </Row>
                <ToastContainer />
                <Row>
                    <Col>
                        <Card small className="mb-4">

                            <CardBody className="p-0 pb-3 m-2">
                                <button className="btn btn-success mb-2 mr-2">Add</button>

                                {
                                    loading === false ? (

                                        <ToolkitProvider bootstrap4 keyField='id' data={userList} columns={columns} search exportCSV>
                                            {
                                                props => (
                                                    <>
                                                        <MyExportCSV {...props.csvProps} className="ml-auto" />
                                                        <BootstrapTable
                                                            remote={{
                                                                filter: true,
                                                                pagination: true,
                                                                sort: true,
                                                                // search: true
                                                            }}
                                                            pagination={pagination}
                                                            filter={filterFactory()}
                                                            {...props.baseProps}
                                                            onTableChange={onTableChange}
                                                        />
                                                    </>
                                                )
                                            }

                                        </ToolkitProvider>
                                    ) : (
                                        <Spinner style={spinnerStyle} className="text-center" animation="border" role="status">
                                            <span className="visually-hidden"></span>
                                        </Spinner>
                                    )
                                }



                                {/*<table className="table mb-0">
                                    <tr>
                                        <th>Id</th>
                                        <th>Name</th>
                                        <th>User Name</th>
                                        <th>Email</th>
                                    </tr>
                                    {userList && userList.map((value, index) => (
                                        <tr key={index}>
                                            <td>{value.id}</td>
                                            <td>{value.name}</td>
                                            <td>{value.username}</td>
                                            <td>{value.email}</td>
                                        </tr>
                                    ))

                                    }

                                </table>*/}

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>

        </>
    )
}
export default DataList;