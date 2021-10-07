import React from 'react'
import { FormGroup } from "shards-react";
import { Link } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
const PaginationLogic = ({ setCurrentPage, currentPage, totalResults, limit, paginationData, loading }) => {

    const handlePagination = (event) => {
        if (event.target.getAttribute("data-action") === 'next') {
            setCurrentPage(currentPage + 1);
        } else if (event.target.getAttribute("data-action") === 'previous') {
            setCurrentPage(currentPage - 1)
        } else {
            setCurrentPage(Number(event.target.getAttribute("data-page")) - 1)
        }
    }
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalResults / limit); i++) {
        pageNumbers.push(i);
    }
    return (
        <>
            <div className="row">
                {
                    loading === true ? (
                        <div className="col-md-12 d-flex justify-content-center">
                            <Spinner animation="border" role="status"></Spinner>
                        </div>
                    ) : ("")
                }
            </div>
            <div className="row">
                {
                    paginationData && paginationData.length === 0 ? (
                        <div className="col-md-12 d-flex justify-content-center">
                            <p className="no-results mt-5">There are no results. try to modify your filter</p>
                        </div>
                    ) : ("")
                }
            </div>
            <div className="row mr-2 mt-5">
                <div className="col-md-6 col-6">
                    <FormGroup>
                        <p>Showing page {currentPage + 1} With {paginationData && paginationData.length} results. ( Total {totalResults} )</p>
                    </FormGroup>
                </div>
                <div className="col-md-6 col-6">
                    <FormGroup>
                        {
                            pageNumbers.length > 1 ? (
                                <nav aria-label="Page navigation example">
                                    <ul className="float-right pagination">
                                        {/*to show previous page we should be on 1st page*/}
                                        {
                                            currentPage !== 0 ? (
                                                <li className="page-item" onClick={handlePagination} data-page={currentPage - 1} data-action="previous">
                                                    <Link className="page-link" to={'#'} aria-label="Previous" onClick={handlePagination} data-page={currentPage - 1} data-action="previous">
                                                        <span aria-hidden="true" onClick={handlePagination} data-page={currentPage + 1} data-action="next">&laquo;</span>
                                                        <span className="sr-only">Previous</span>
                                                    </Link>
                                                </li>
                                            ) : ("")
                                        }
                                        {
                                            pageNumbers.map((number, index) => {
                                                const activeCondition = currentPage + 1 === number ? "active" : "";
                                                return (
                                                    <li className={`page-item ${activeCondition}`} onClick={handlePagination} data-page={number}>
                                                        <Link className="page-link" to={'#'} onClick={handlePagination} data-page={number}>{number}</Link>
                                                    </li>
                                                )
                                            })
                                        }
                                        {/*To Show next btn we should not be on last page*/}
                                        {
                                            currentPage !== pageNumbers.length - 1 ? ( // because of offset is 0
                                                <li className="page-item" onClick={handlePagination} data-page={currentPage + 1} data-action="next">
                                                    <Link className="page-link" to={"#"} aria-label="Next" onClick={handlePagination} data-page={currentPage + 1} data-action="next">
                                                        <span aria-hidden="true" onClick={handlePagination} data-page={currentPage + 1} data-action="next">&raquo;</span>
                                                        <span className="sr-only">Next</span>
                                                    </Link>
                                                </li>
                                            ) : ("")
                                        }
                                    </ul>
                                </nav>
                            ) : ("")
                        }
                    </FormGroup>
                </div>
            </div>
        </>
    )
}

export default PaginationLogic
