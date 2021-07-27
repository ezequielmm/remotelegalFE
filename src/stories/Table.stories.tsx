// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";
import { Menu, Dropdown } from "antd";
import Button from "prp-components-library/src/components/Button";
import Space from "prp-components-library/src/components/Space";
import Table from "prp-components-library/src/components/Table";
import Text from "prp-components-library/src/components/Text";
import { FilePdfOutlined, MoreOutlined } from "@ant-design/icons";
import { ContainerBackground } from "./Decorators";

import { theme } from "../constants/styles/theme";
import { ThemeMode } from "../types/ThemeType";

const menu = (
    <Menu>
        <Menu.Item>
            <span>Rename</span>
        </Menu.Item>
        <Menu.Item>
            <span>Delete</span>
        </Menu.Item>
    </Menu>
);

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
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
    },
    {
        title: "Number",
        dataIndex: "number",
        key: "number",
        sorter: (a, b) => a.number - b.number,
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
    },
    {
        title: "Added By",
        dataIndex: "addedBy",
        key: "addedBy",
        sorter: (a, b) => a.addedBy - b.addedBy,
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
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

const depositionsColumns = [
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        sorter: (a, b) => a.status - b.status,
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
        fixed: "left",
    },
    {
        title: "Law Firm",
        dataIndex: "lawFirm",
        key: "lawFirm",
        sorter: (a, b) => a.lawFirm - b.lawFirm,
        ellipsis: true,
        render: (record) => <Text weight="bold">{record}</Text>,
    },
    {
        title: "Requested By",
        dataIndex: "requestedBy",
        key: "requestedBy",
        sorter: (a, b) => a.requestedBy - b.requestedBy,
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
    },
    {
        title: "Case",
        dataIndex: "case",
        key: "case",
        sorter: (a, b) => a.case - b.case,
        ellipsis: true,
        render: (record) => (
            <Text>
                <a href={record.url}>{record.label}</a>
            </Text>
        ),
        width: 120,
    },
    {
        title: "Date and Time",
        dataIndex: "dateAndTime",
        key: "dateAndTime",
        sorter: (a, b) => a.dateAndTime - b.dateAndTime,
        ellipsis: true,
        render: (record) => (
            <Text>
                <>
                    {record.date}
                    <br />
                    {record.time}
                </>
            </Text>
        ),
    },
    {
        title: "Witness",
        dataIndex: "witness",
        key: "witness",
        sorter: (a, b) => a.witness - b.witness,
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
    },
    {
        title: "Court Reporter",
        dataIndex: "courtReporter",
        key: "courtReporter",
        sorter: (a, b) => a.courtReporter - b.courtReporter,
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
    },
    {
        title: "Job#",
        dataIndex: "jobNumber",
        key: "jobNumber",
        sorter: (a, b) => a.jobNumber - b.jobNumber,
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
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
        width: 90,
        fixed: "right",
    },
];

const exhibits = [
    {
        key: "1",
        file: "Certificate of examination.pdf",
        fileSize: "90 Kb",
    },
    {
        key: "2",
        file: "Employment certificate.pdf",
        fileSize: "432 Kb",
    },
    {
        key: "3",
        file: "Driver’s license.jpg",
        fileSize: "2 Mb",
    },
    {
        key: "4",
        file: "Subway photo.pdf",
        fileSize: "148 Kb",
    },
];

const exhibitsColumns = [
    {
        title: "",
        dataIndex: "fileIcon",
        key: "fileIcon",
        render: () => <FilePdfOutlined />,
        width: theme.default.baseUnit * theme.default.spaces[12],
    },
    {
        title: "File",
        dataIndex: "file",
        key: "file",
        sorter: (a, b) => a.file - b.file,
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
    },
    {
        title: "File size",
        dataIndex: "fileSize",
        key: "fileSize",
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
    },
    {
        title: "",
        dataIndex: "actions",
        key: "actions",
        render: () => (
            <Space align="center" size="large">
                <Button size="small" type="link">
                    VIEW
                </Button>
                <Button size="small" type="ghost">
                    Share
                </Button>
            </Space>
        ),
        width: theme.default.baseUnit * theme.default.spaces[6] * 10,
    },
    {
        title: "",
        dataIndex: "shareAction",
        key: "shareAction",
        render: () => (
            <Dropdown overlay={menu}>
                <MoreOutlined onClick={(e) => e.preventDefault()} />
            </Dropdown>
        ),
        width: theme.default.baseUnit * theme.default.spaces[6] * 3,
    },
];

const pagination = {
    currentPage: 1,
    pageSize: 2,
};

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

const Template: Story = (args) => <Table hscroll={1500} pagination={pagination} {...args} />;
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

export const DefaultEmptyTable = Template.bind({});

export const ExhibitsTable = Template.bind({});
ExhibitsTable.args = {
    dataSource: exhibits,
    columns: exhibitsColumns,
    sortDirections: ["descend", "ascend"],
    rowSelection: { type: "checkbox" },
};
ExhibitsTable.parameters = {
    backgrounds: { default: ThemeMode.default },
};

const data = [
    {
        title: "Text of example",
        action: false,
    },
    {
        title: "Text of example",
        action: true,
    },
    {
        title: "Text of example",
        description: "Sample long text to display two lines of text",
        action: true,
    },
    {
        title: "Sample long text to display two lines of text",
        action: true,
    },
];

const columns = [
    {
        title: "Title",
        dataIndex: "title",
        key: "title",
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
        width: theme.default.baseUnit * theme.default.spaces[6] * 12,
    },
    {
        title: "Description",
        key: "description",
        dataIndex: "description",
        ellipsis: true,
        render: (record) => <Text>{record}</Text>,
        width: theme.default.baseUnit * theme.default.spaces[6] * 12,
    },
    {
        title: "Action",
        key: "action",
        render: (d) =>
            d.action && (
                <Button size="small" type="primary">
                    CTA
                </Button>
            ),
    },
];

export const TableRowSizes = Template.bind({});
TableRowSizes.args = {
    dataSource: data,
    columns,
    sortDirections: ["descend", "ascend"],
    pagination: false,
};
