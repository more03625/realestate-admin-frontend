import React from 'react'
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormCheckbox,
    FormGroup, FormInput, FormSelect, Alert, NavItem, object
} from "shards-react";
function PaginationLogic() {
    return (
        <>

            <div className="row mr-2 mt-5">
                <div className="col-md-6 col-6">
                    <FormGroup>
                        <p>Showing page {currentPage + 1} With {properties && properties.length} results. ( Total {totalResults} )</p>
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
                                                        <span aria-hidden="true">&laquo;</span>
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
                                                        <span aria-hidden="true">&raquo;</span>
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
