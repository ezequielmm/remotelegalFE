import React from "react";
import { Tooltip } from "antd";
import { TableProps } from "antd/lib/table";
// eslint-disable-next-line import/no-extraneous-dependencies
import { DefaultRecordType } from "rc-table/lib/interface";
import Column from "antd/lib/table/Column";
import Table from "../../../../components/Table";
import { StyledFileNameCell } from "./styles";
import FileIcon from "../FileIcon";
import Text from "../../../../components/Typography/Text";
import ColorStatus from "../../../../types/ColorStatus";

interface IEnteredExhibitsTable extends TableProps<DefaultRecordType> {}

const EnteredExhibitsTable = (props: IEnteredExhibitsTable) => {
    return (
        <>
            <Table
                data-testid="entered_exhibits_table"
                rowKey="id"
                sortDirections={["descend", "ascend"]}
                pagination={false}
                style={{ height: "100%" }}
                {...props}
            >
                <Column
                    title="FILE"
                    dataIndex="displayName"
                    key="displayName"
                    sorter={({ displayName: a }, { displayName: b }) => a.localeCompare(b)}
                    width="50%"
                    ellipsis
                    render={(displayName) => {
                        const fileExtension = displayName.split(".").pop();
                        return (
                            <StyledFileNameCell>
                                <FileIcon type={fileExtension} />
                                <Tooltip title={displayName}>
                                    <Text state={ColorStatus.secondary} dataTestId="entered_exhibit_display_name">
                                        {displayName}
                                    </Text>
                                </Tooltip>
                            </StyledFileNameCell>
                        );
                    }}
                />
                <Column
                    title="OWNER"
                    dataIndex="addedBy"
                    key="addedBy"
                    sorter={({ addedBy: a }, { addedBy: b }) => a.firstName.localeCompare(b.firstName)}
                    width="25%"
                    render={(addedBy) => `${addedBy?.firstName} ${addedBy?.lastName}`}
                />
                <Column
                    title="STAMP LABEL"
                    dataIndex="stampLabel"
                    key="stampLabel"
                    sorter={({ stampLabel: a }, { stampLabel: b }) => a.localeCompare(b)}
                    width="25%"
                    render={(stampLabel) => stampLabel}
                    defaultSortOrder="ascend"
                />
            </Table>
        </>
    );
};

export default EnteredExhibitsTable;
