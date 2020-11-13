import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

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

const columns = [
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

export default {
    title: "Table",
    component: Table,
} as Meta;

const Template: Story = () => <Table dataSource={cases} columns={columns} sortDirections={["descend", "ascend"]} />;

export const StyledTable = Template.bind({});
