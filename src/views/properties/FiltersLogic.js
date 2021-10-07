import React from 'react'
import {
    FormGroup, FormInput, FormSelect
} from "shards-react";
import { propertyStatus, paginationLimit } from '../../data/select.json'
import {
    exportToCSV, capitalize
} from "../../helper/comman_helpers";
const FiltersLogic = ({ exportData, setCurrentPage, setSearchOptions, searchOptions, setRunUseEffect, runUseEffect, status, userTypes }) => {
    const exportCSV = () => {
        exportToCSV(exportData);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setCurrentPage(0)
        setRunUseEffect(!runUseEffect)
    }
    const handleChange = (e) => {
        setSearchOptions({ ...searchOptions, [e.target.name]: e.target.value });
    }
    const reset = () => {
        setSearchOptions('')
        setRunUseEffect(!runUseEffect)
    }
    return (
        <>
            {/*
            <div className="row">
                <div className="col-md-1 col-6">
                    <FormGroup>
                        <button type="button" className="btn btn-success" onClick={exportCSV}>
                            Export
                        </button>
                    </FormGroup>
                </div>
            </div>
            */}
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 col-6">
                        <FormGroup>
                            <FormInput placeholder="Search..." name="search" onChange={(e) => handleChange(e)} />
                        </FormGroup>
                    </div>

                    {
                        status !== undefined &&
                        <div className="col-md-6 col-6">
                            <FormGroup>
                                <FormSelect id="feInputState" name="status" onChange={(e) => handleChange(e)}>
                                    <option value="">status</option>
                                    {
                                        status.map((value, index) => (
                                            <option key={value} value={value}>{capitalize(value)}</option>
                                        ))
                                    }
                                </FormSelect>
                            </FormGroup>
                        </div>
                    }
                    {
                        userTypes !== undefined &&
                        <div className="col-md-6 col-6">
                            <FormGroup>
                                <FormSelect id="feInputState" name="user_type" onChange={(e) => handleChange(e)}>
                                    <option value="">User type</option>
                                    {
                                        userTypes.map((value, index) => (
                                            <option key={value} value={value}>{capitalize(value)}</option>
                                        ))
                                    }
                                </FormSelect>
                            </FormGroup>
                        </div>
                    }


                    <div className="col-md-6 col-6">
                        <FormGroup>
                            <FormSelect id="feInputState" name="limit" onChange={(e) => handleChange(e)}>
                                <option value="">Number of rows</option>
                                {
                                    paginationLimit.map((value, index) => (
                                        <option key={value} value={value}>{value}</option>
                                    ))
                                }
                            </FormSelect>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-6">
                        <FormGroup>
                            <button type="submit" className="btn btn-success" >
                                Search
                            </button>
                            <button type="reset" className="ml-2 btn btn-primary" onClick={() => reset()}>
                                Reset
                            </button>
                        </FormGroup>
                    </div>
                </div>
            </form>
        </>
    )
}

export default FiltersLogic
