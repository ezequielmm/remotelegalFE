import React from "react";
import { Tooltip } from "antd";
import Column from "antd/lib/table/Column";
import FileIcon from "prp-components-library/src/components/FileIcon";
import Table from "prp-components-library/src/components/Table";
import { ITableProps } from "prp-components-library/src/components/Table/Table";
import Text from "prp-components-library/src/components/Text";
import { StyledFileNameCell } from "./styles";
import ColorStatus from "../../../../types/ColorStatus";

interface IEnteredExhibitsTable extends ITableProps {}

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
                    ellipsis
                    render={(addedBy) => <Text>{`${addedBy?.firstName} ${addedBy?.lastName}`}</Text>}
                />
                <Column
                    title="STAMP LABEL"
                    dataIndex="stampLabel"
                    key="stampLabel"
                    sorter={({ stampLabel: a }, { stampLabel: b }) => a.localeCompare(b)}
                    width="25%"
                    ellipsis
                    render={(stampLabel) => <Text>{stampLabel}</Text>}
                    defaultSortOrder="ascend"
                />
            </Table>
        </>
    );
};

export default EnteredExhibitsTable;
