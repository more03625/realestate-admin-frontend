import React, { useEffect, useState } from 'react';
import { Container, Row, Nav, NavItem, NavLink, Button } from "shards-react";
import data from './sampleMovieData'
import Axios from 'axios';
import DataTable, { defaultThemes } from 'react-data-table-component';
export const ExportCSV = () => {
    // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
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

    // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
    function downloadCSV(array) {
        console.log(array)
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
    }


    const Export = ({ onExport }) => <Button onClick={e => onExport(e.target.value)}>Export Me</Button>;

    const columns = [
        {
            name: 'Title',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Director',
            selector: row => row.last_name,
            sortable: true,
        },
        {
            name: 'Year',
            selector: row => row.email,
            sortable: true,
        },
    ];


    const actionsMemo = React.useMemo(() => <Export onExport={() => downloadCSV(data)} />, []);

    return <DataTable title="Movie List" columns={columns} data={data} actions={actionsMemo} />;
};

export default {
    title: 'Examples/Export CSV',
    component: ExportCSV,
};