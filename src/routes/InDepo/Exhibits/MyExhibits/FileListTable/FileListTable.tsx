import React from "react";
import { Dropdown, Menu } from "antd";
import { TableProps } from "antd/lib/table";
import { DefaultRecordType } from "rc-table/lib/interface";
import Button from "../../../../../components/Button";
import { ReactComponent as kebebIcon } from "../../../../../assets/icons/kebeb.svg";
import Icon from "../../../../../components/Icon";
import FileIcon from "../FileIcon";
import { StyledFileListTable } from "./styles";
import { formatBytes } from "../../../../../helpers/formatBytes";

const menu = (
    <Menu>
        <Menu.Item key="0">
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                1st menu item
            </a>
        </Menu.Item>
        <Menu.Item key="1">
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                2nd menu item
            </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" disabled>
            3rd menu item（disabled）
        </Menu.Item>
    </Menu>
);

const columns = [
    {
        title: "FILE",
        dataIndex: "name",
        key: "name",
        render: (name) => {
            const fileExtension = name.split(".").pop();
            return <FileIcon type={fileExtension} />;
        },
    },
    {
        title: "",
        dataIndex: "displayName",
        key: "displayName",
        sorter: (a, b) => a.displayName.localeCompare(b.displayName),
    },
    {
        title: "FILE SIZE",
        dataIndex: "size",
        key: "size",
        render: (size) => formatBytes(size),
    },
    {
        title: "",
        dataIndex: "view",
        key: "view",
        render: () => <Button type="text">View</Button>,
    },
    {
        title: "",
        dataIndex: "share",
        key: "share",
        render: () => <Button type="link">Share</Button>,
    },
    {
        title: "",
        dataIndex: "options",
        key: "options",
        render: () => (
            <Dropdown overlay={menu}>
                <Icon icon={kebebIcon} style={{ fontSize: "24px" }} />
            </Dropdown>
        ),
    },
];

const FileListTable = (props: TableProps<DefaultRecordType>) => <StyledFileListTable columns={columns} {...props} />;
export default FileListTable;
