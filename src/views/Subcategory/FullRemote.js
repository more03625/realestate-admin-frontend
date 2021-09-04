import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import Axios from 'axios';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
const FullRemote = () => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    const loadData = async () => {
        const result = await Axios.get(`https://dummyapi.io/data/v1/post?limit=${pageSize}&page=${pageNumber}`, {
            headers: {
                'app-id': '612db5222430a71605f59647'
            }
        });
        setProducts(result.data.data);
        setTotal(result.data.total);
    }
    const { SearchBar } = Search;

    const options = {
        custom: true,
        paginationSize: 4,
        pageStartIndex: 1,
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        showTotal: true,
        totalSize: total
    };
    console.log(products)
    const columns = [
        { dataField: 'id', text: 'My Id', sort: true },
        { dataField: 'likes', text: 'My Name', sort: true },
        { dataField: 'text', text: 'Text', sort: true },

    ];
    const contentTable = ({ paginationProps, paginationTableProps }) => (
        <div>
            <button className="btn btn-default" onClick={loadData}>Load Another Data</button>
            <PaginationListStandalone {...paginationProps} />
            <ToolkitProvider
                keyField="id"
                columns={columns}
                data={products}
                search
            >
                {
                    toolkitprops => (
                        <div>
                            <SearchBar {...toolkitprops.searchProps} />
                            <BootstrapTable
                                striped
                                hover
                                {...toolkitprops.baseProps}
                                {...paginationTableProps}
                            />
                        </div>
                    )
                }
            </ToolkitProvider>
            <PaginationListStandalone {...paginationProps} />
        </div>
    );
    useEffect(() => {
        loadData();
    }, [])
    return (
        <div>
            <h2>PaginationProvider will care the data size change. You dont do anything</h2>
            <PaginationProvider
                pagination={
                    paginationFactory(options)
                }
            >
                {contentTable}
            </PaginationProvider>
            {/*<Code>{sourceCode}</Code>*/}
        </div >
    );
}
export default FullRemote;