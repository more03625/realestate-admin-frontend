import React, { useEffect, useMemo, useState, useCallback } from 'react';
import DataTable, { defaultThemes } from 'react-data-table-component';
import { Container, Row, Nav, NavItem, NavLink, Button } from "shards-react";
import PageTitle from '../../components/common/PageTitle';
import { ToastContainer } from 'react-toastify';
// import data from './sampleMovieData'
import { Host, Endpoints, getUserToken, capitalize } from '../../helper/comman_helpers';
import Axios from 'axios';
import styled from 'styled-components';

import { Modal } from 'react-bootstrap';



const ContentDemo = () => {
    const handleClose = () => setShow(false);

    const handleButtonClick = () => {
        setShow(true)
        console.log('clicked');
    };
    const [show, setShow] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const handleChange = useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: defaultThemes.default.divider.default,
            },
        },
        headCells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: defaultThemes.default.divider.default,
                },
            },
        },
        cells: {
            style: {
                '&:not(:last-of-type)': {
                    borderRightStyle: 'solid',
                    borderRightWidth: '1px',
                    borderRightColor: defaultThemes.default.divider.default,
                },
            },
        },
    };
    const rowStyle = [
        {
            when: row => row.status == 'active',
            style: {

                color: 'green',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },
        {
            when: row => row.status == 'deactive',
            style: {

                color: 'red',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        }
    ]
    const [subCategoriesError, setSubCategoriesError] = useState();
    const [subCategories, setSubCategories] = useState([]);
    const columns = [

        {
            cell: () => <button className="btn btn-success" onClick={handleButtonClick}><i className="material-icons">edit</i></button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            cell: () => <button className="btn btn-success" onClick={handleButtonClick}><i className="material-icons">edit</i></button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: 'Category Name',
            selector: row => row.first_name,
            sortable: true,
        },
        {

            name: 'Status',

            selector: row => capitalize(row.last_name),
            sortable: true,
        },
    ];


    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const fetchUsers = async (page) => {
        setLoading(true);
        const response = await Axios.get(`https://reqres.in/api/users?page=${page}&per_page=${perPage}&delay=1`);
        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
    };




    function convertArrayOfObjectsToCSV(array) {
        let result;

        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];

                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    function downloadCSV(array) {
        console.log(array)
        if (array.length !== 0) {
            const link = document.createElement('a');
            let csv = convertArrayOfObjectsToCSV(array);
            if (csv == null) return;

            const filename = 'export.csv';

            if (!csv.match(/^data:text\/csv/i)) {
                csv = `data:text/csv;charset=utf-8,${csv}`;
            }

            link.setAttribute('href', encodeURI(csv));
            link.setAttribute('download', filename);
            link.click();
        } else {
            console.log("Array lenght is 0");
        }
    }

    const Export = ({ onExport }) => <Button onClick={e => onExport(e.target.value)}>Export</Button>;

    const handlePageChange = (page) => {
        fetchUsers(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLoading(true);
        const response = await Axios.get(`https://reqres.in/api/users?page=${page}&per_page=${newPerPage}&delay=1`);
        setData(response.data.data);
        setPerPage(newPerPage);
        setLoading(false);
    };



    useEffect(() => {
        fetchUsers(1);
        console.log('state', selectedRows);
    }, [selectedRows]);


    const actionsMemo = <Export onExport={() => downloadCSV(data)} />;

    return (
        <Container fluid className="main-content-container px-4">
            {/* Page Header */}
            <Row noGutters className="page-header py-4">
                <PageTitle
                    sm="4"
                    title="Manage Sub Categories"
                    subtitle="Sub Categories CRUD"
                    className="text-sm-left"
                />
            </Row>
            <ToastContainer />

            <Row>
                {
                    <DataTable
                        title="Subcategories"
                        columns={columns}
                        data={data}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                        actions={actionsMemo}
                        onSelectedRowsChange={handleChange}
                        selectableRows
                    />
                }
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>

    )
}
export default ContentDemo;