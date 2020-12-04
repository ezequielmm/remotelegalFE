import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { ContainerBackground } from "./Decorators";
import Button from "../components/Button";

import Table from "../components/Table";

const cases = [
    {
        key: "1",
        name: "Korematsu v. United States",
        number: "#000456",
        addedBy: "Justin Hamilton",
    },
    {
        key: "2",
        name: "Gideon v. Wainwright",
        number: "#000267",
        addedBy: "Justin Hamilton",
    },
];

const casesColumns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name - b.name,
    },
    {
        title: "Number",
        dataIndex: "number",
        key: "number",
        sorter: (a, b) => a.number - b.number,
    },
    {
        title: "Added By",
        dataIndex: "addedBy",
        key: "addedBy",
        sorter: (a, b) => a.addedBy - b.addedBy,
    },
];

const depositionsColumns = [
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => a.status - b.status,
        render: (text) => <small>{text}</small>,
    },
    {
        title: "Law Firm",
        dataIndex: "lawFirm",
        key: "lawFirm",
        sorter: (a, b) => a.lawFirm - b.lawFirm,
        render: (text) => (
            <small>
                <b>{text}</b>
            </small>
        ),
    },
    {
        title: "Requested By",
        dataIndex: "requestedBy",
        key: "requestedBy",
        sorter: (a, b) => a.requestedBy - b.requestedBy,
        render: (text) => <small>{text}</small>,
    },
    {
        title: "Case",
        dataIndex: "case",
        key: "case",
        sorter: (a, b) => a.case - b.case,
        render: (text) => (
            <small>
                <a href={text.url}>{text.label}</a>
            </small>
        ),
        width: 120,
        ellipsis: true,
    },
    {
        title: "Date and Time",
        dataIndex: "dateAndTime",
        key: "dateAndTime",
        sorter: (a, b) => a.dateAndTime - b.dateAndTime,
        render: (text) => (
            <>
                <small>{text.date}</small>
                <small>{text.time}</small>
            </>
        ),
    },
    {
        title: "Witness",
        dataIndex: "witness",
        key: "witness",
        sorter: (a, b) => a.witness - b.witness,
        render: (text) => (
            <small>
                <b>{text}</b>
            </small>
        ),
    },
    {
        title: "Court Reporter",
        dataIndex: "courtReporter",
        key: "courtReporter",
        sorter: (a, b) => a.courtReporter - b.courtReporter,
    },
    {
        title: "Job#",
        dataIndex: "jobNumber",
        key: "jobNumber",
        sorter: (a, b) => a.jobNumber - b.jobNumber,
    },
    {
        title: "",
        dataIndex: "status",
        key: "status",
        render: (status) => (
            <Button size="small" disabled={status !== "Confirmed"} type="primary">
                Join
            </Button>
        ),
        width: 80,
    },
];

const depositions = [
    {
        key: "1",
        status: "Pending",
        lawFirm: "The Long Law firm",
        requestedBy: "Corey Jimenez",
        case: {
            label: "Korematsu v. United States of America",
            url: "http://url.com",
        },
        dateAndTime: {
            date: "Tue Nov 02, 2020",
            time: "01:00 to 03:00",
        },
        witness: "Patrick Morgan",
        courtReporter: "Justin Hamilton",
        jobNumber: "#0549",
    },
    {
        key: "2",
        status: "Confirmed",
        lawFirm: "The Long Law firm",
        requestedBy: "Corey Jimenez",
        case: {
            label: "Korematsu v. United States of America",
            url: "http://url.com",
        },
        dateAndTime: {
            date: "Tue Nov 02, 2020",
            time: "01:00 to 03:00",
        },
        witness: "Patrick Morgan",
        courtReporter: "Justin Hamilton",
        jobNumber: "#0549",
    },
];

export default {
    title: "Table",
    component: Table,
    decorators: [
        (Template) => (
            <ContainerBackground>
                <Template />
            </ContainerBackground>
        ),
    ],
} as Meta;

const Template: Story = (args) => <Table {...args} />;

export const CasesTable = Template.bind({});
CasesTable.args = {
    dataSource: cases,
    columns: casesColumns,
    sortDirections: ["descend", "ascend"],
};

export const DepositionsTable = Template.bind({});
DepositionsTable.args = {
    dataSource: depositions,
    columns: depositionsColumns,
    sortDirections: ["descend", "ascend"],
};
