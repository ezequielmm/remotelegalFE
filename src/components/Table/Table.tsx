import React from "react";
import { Table } from "antd";
import { DefaultRecordType } from "rc-table/lib/interface";
import { TableProps } from "antd/lib/table/Table";
import styled from "styled-components";
import { getREM } from "../../constants/styles/utils";

const StyledTable = styled(Table)`
    ${({ theme }) => {
        const styles = `
            table {
                border-radius: 0;
                border-spacing: 0 ${getREM(theme.default.spaces[1])};

                thead.ant-table-thead {
                    > tr {
                        > th {
                            border-radius: 0;
                            background-color: transparent;
                            font-size: ${getREM(theme.default.fontSizes[8])};
                            text-transform: uppercase;
                            font-weight: bold;
                            border-bottom-color: ${theme.colors.neutrals[3]};

                            .ant-table-column-sorters {
                                padding: 0 0 ${getREM(theme.default.spaces[1])} ${getREM(theme.default.spaces[5])};

                                .ant-table-column-sorter {
                                    color: ${theme.colors.neutrals[1]};
                                    margin-top: -0.4em;
                                    .ant-table-column-sorter-up,
                                    .ant-table-column-sorter-down {
                                        font-size: ${getREM(theme.default.fontSizes[9])};
                                    }
                                }
                            }
                        }
                    }
                }

                tbody.ant-table-tbody {
                    > tr {
                        background-color: ${theme.colors.neutrals[6]};

                        > td {
                            box-shadow: 0 ${getREM(theme.default.spaces[2])} ${getREM(
            theme.default.spaces[5]
        )} 0 rgba(162, 195, 216, 0.08);
                            padding-left: ${getREM(theme.default.spaces[5])};
                            &:first-child {
                                border-radius: ${getREM(theme.default.spaces[2])} 0 0 ${getREM(
            theme.default.spaces[2]
        )};
                            }
                            &:last-child {
                                border-radius: 0 ${getREM(theme.default.spaces[2])} ${getREM(
            theme.default.spaces[2]
        )} 0;
                            }
                        }
                    }

                    &.ant-table-placeholder {
                        > td {
                            box-shadow: 0 ${getREM(theme.default.spaces[2])} ${getREM(
            theme.default.spaces[5]
        )} 0 rgba(162, 195, 216, 0.08);
                            padding-left: ${getREM(theme.default.spaces[5])};
                            border-radius: ${getREM(theme.default.spaces[2])};
                            }
                        }
                    }
                }
            }
        `;
        return styles;
    }}
`;

const table = (props: TableProps<DefaultRecordType>) => <StyledTable {...props} />;
export default table;
