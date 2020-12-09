import React from "react";
import { Table } from "antd";
import { DefaultRecordType } from "rc-table/lib/interface";
import { TableProps } from "antd/lib/table/Table";
import styled from "styled-components";
import { getREM, hexToRGBA } from "../../constants/styles/utils";

const StyledTable = styled(Table)`
    ${({ theme }) => {
        const { fontSizes, spaces } = theme.default;
        const { neutrals } = theme.colors;
        const styles = `
            &.ant-table-wrapper {
                table {
                    border-radius: 0;
                    border-spacing: 0 ${getREM(spaces[1])};

                    thead.ant-table-thead {
                        > tr {
                            > th {
                                border-radius: 0;
                                background-color: transparent;
                                font-size: ${getREM(fontSizes[8])};
                                text-transform: uppercase;
                                font-weight: bold;
                                border-bottom-color: ${neutrals[3]};

                                padding: 0 0 ${getREM(spaces[1])} ${getREM(spaces[5])};
                                .ant-table-column-sorters {
                                    padding: 0;
                                    .ant-table-column-sorter {
                                        color: ${neutrals[1]};
                                        margin-top: -0.4em;
                                        .ant-table-column-sorter-up,
                                        .ant-table-column-sorter-down {
                                            font-size: ${getREM(fontSizes[9])};
                                        }
                                    }
                                }
                            }
                        }
                    }

                    tbody.ant-table-tbody {
                        > tr {
                            background-color: ${neutrals[6]};

                            > td.ant-table-cell {
                                box-shadow: 0 ${getREM(spaces[2])} ${getREM(spaces[5])} 0 ${hexToRGBA(
            neutrals[2],
            0.08
        )};
                                padding: ${getREM(spaces[4])} ${getREM(spaces[5] / 2)};
                                &:first-child {
                                    padding-left: ${getREM(spaces[5])};
                                    border-radius: ${getREM(spaces[2])} 0 0 ${getREM(spaces[2])};
                                }
                                &:last-child {
                                    border-radius: 0 ${getREM(spaces[2])} ${getREM(spaces[2])} 0;
                                }

                                small {
                                    font-size: ${getREM(fontSizes[8])};
                                    display: block;
                                }

                                &.ant-table-cell-ellipsis {
                                    overflow: initial;
                                    white-space: initial;
                                    text-overflow: initial;
                                    word-break: initial;

                                    small {
                                        display: -webkit-box;
                                        -webkit-line-clamp: 2;
                                        -webkit-box-orient: vertical;  
                                        overflow: hidden;
                                    }
                                }
                            }

                        &.ant-table-placeholder {
                            > td {
                                box-shadow: 0 ${getREM(spaces[2])} ${getREM(spaces[5])} 0 ${hexToRGBA(
            neutrals[2],
            0.08
        )};
                                padding-left: ${getREM(spaces[5])};
                                border-radius: ${getREM(spaces[2])};
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
