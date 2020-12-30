import React from "react";
import { Table } from "antd";
import { DefaultRecordType } from "rc-table/lib/interface";
import { TableProps } from "antd/lib/table/Table";
import styled from "styled-components";
import { getREM, hexToRGBA } from "../../constants/styles/utils";

const StyledTable = styled(Table)`
    ${({ theme }) => {
        const { fontSizes, spaces, borderRadiusBase } = theme.default;
        const { neutrals, disabled, primary, inDepoBlue, inDepoNeutrals } = theme.colors;

        const styles = `
            &.ant-table-wrapper {
                ${
                    theme.mode === "inDepo"
                        ? `
                    .ant-spin-container {
                        background: ${hexToRGBA(inDepoNeutrals[6], 1)};
                        border-radius: ${getREM(borderRadiusBase)};
                        &::after {
                            background: ${hexToRGBA(inDepoNeutrals[6], 1)};
                            transition: opacity 0.3s;
                        }
                    }
                    .ant-pagination {
                        .anticon {
                            color: ${primary[5]};
                        }
                        .ant-pagination-item-link {
                            background: transparent;
                        }
                        .ant-pagination-item {
                            background: transparent;
                            border-color: ${disabled[9]}; 
                        }
                        .ant-pagination-item a {
                            color: ${primary[5]};
                        }

                        .ant-pagination .ant-pagination-item-link,
                        .ant-pagination-item-link {
                            border-color: ${disabled[9]};
                            .anticon {
                                color: ${primary[5]};
                            }
                        }
                        .ant-pagination-disabled:focus .ant-pagination-item-link,
                        .ant-pagination-disabled:hover .ant-pagination-item-link,
                        .ant-pagination-disabled .ant-pagination-item-link,
                        .ant-pagination-disabled:hover .ant-pagination-item-link,
                        .ant-pagination-disabled:focus .ant-pagination-item-link {
                            border-color: ${disabled[9]};
                            .anticon {
                                color: ${disabled[9]};
                            }
                        }
                        .ant-pagination-item:hover,
                        .ant-pagination-item-active,
                        .ant-pagination-next:focus:not(.ant-pagination-disabled) .ant-pagination-item-link, 
                        .ant-pagination-next:hover:not(.ant-pagination-disabled) .ant-pagination-item-link, 
                        .ant-pagination-prev:focus:not(.ant-pagination-disabled) .ant-pagination-item-link, 
                        .ant-pagination-prev:hover:not(.ant-pagination-disabled) .ant-pagination-item-link {
                            border-color: ${primary[5]};
                        }
                    }
                `
                        : ""
                };
                .ant-table-empty {
                    table {
                        tbody.ant-table-tbody {
                            > tr {
                                > td.ant-table-cell:first-child {
                                    border-radius: ${theme.mode === "inDepo" ? "" : `${getREM(spaces[5])}`};
                                    box-shadow: ${theme.mode === "inDepo" ? "none" : ""};
                                    padding: ${getREM(spaces[9])} ${getREM(spaces[4])};
                                    &:hover {
                                        ${theme.mode === "inDepo" ? `background: transparent;` : ""}
                                    }
                                }
                            }
                            ${
                                theme.mode === "inDepo"
                                    ? `
                            .ant-empty-image {
                                .ant-empty-img-simple-ellipse {
                                    fill: ${primary[5]};
                                }
                                .ant-empty-img-simple-path {
                                    fill: ${primary[6]};
                                }
                                .ant-empty-img-simple-g {
                                    stroke: ${primary[4]};
                                }
                            }
                            .ant-empty-description {
                                color: ${primary[5]};
                            }
                            `
                                    : ""
                            }
                        }
                    }
                }
                table {
                    border-radius: 0;
                    border-spacing: ${theme.mode === "inDepo" ? "" : `0 ${getREM(spaces[3])};`};

                    .ant-table-thead > tr > th:not(.ant-table-column-has-sorters), 
                    .ant-table tfoot > tr > th:not(.ant-table-column-has-sorters) {
                        padding: 10px 0 10px ${getREM(spaces[4])};
                    }

                    thead.ant-table-thead {
                        > tr {
                            > th {
                                border-radius: 0;
                                background-color: transparent;
                                font-size: ${getREM(fontSizes[8])};
                                text-transform: uppercase;
                                font-weight: bold;
                                border-bottom-color: ${theme.mode === "inDepo" ? disabled[9] : neutrals[3]};
                                &:first-child {
                                    .ant-table-column-sorters {
                                        padding-left: ${getREM(spaces[9])};
                                    } 
                                }
                                &:last-child {
                                    .ant-table-column-sorters {
                                        padding-right: ${getREM(spaces[9])};
                                    } 
                                }
                                .ant-table-column-sorters {
                                    padding: 10px 0 10px ${getREM(spaces[4])};
                                    .active {
                                        color: ${theme.mode === "inDepo" ? inDepoBlue[4] : ""};
                                    }
                                    .ant-table-column-sorter {
                                        color: ${theme.mode === "inDepo" ? neutrals[2] : neutrals[1]};
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
                            background-color: ${theme.mode === "inDepo" ? `transparent` : neutrals[6]};
                            ${
                                theme.mode === "inDepo"
                                    ? `
                                &.ant-table-row:hover > td {
                                    background: ${hexToRGBA(neutrals[1], 0.05)};
                                }
                            `
                                    : ""
                            };

                            > td.ant-table-cell {
                                box-shadow: ${
                                    theme.mode === "inDepo"
                                        ? `none`
                                        : `0 ${getREM(spaces[5])} ${getREM(spaces[9])} 0 ${hexToRGBA(
                                              neutrals[2],
                                              0.08
                                          )}`
                                };
                                padding: ${getREM(spaces[4])};
                                color: ${theme.mode === "inDepo" ? neutrals[6] : ""};
                                border-bottom-color: ${theme.mode === "inDepo" ? disabled[9] : ""};
                                &:first-child {
                                    padding-left: ${getREM(spaces[9])};
                                    border-radius: ${
                                        theme.mode === "inDepo" ? `0` : `${getREM(spaces[5])} 0 0 ${getREM(spaces[5])}`
                                    };
                                }
                                &:last-child {
                                    padding-right: ${getREM(spaces[9])};
                                    border-radius: ${
                                        theme.mode === "inDepo" ? `0` : `0 ${getREM(spaces[5])} ${getREM(spaces[5])} 0`
                                    };
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
                            ${
                                theme.mode === "inDepo"
                                    ? `> td.ant-table-column-sort {
                                background: ${hexToRGBA(neutrals[1], 0.05)};
                            }`
                                    : ""
                            }

                        &.ant-table-placeholder {
                            > td {
                                box-shadow: 0 ${getREM(spaces[5])} ${getREM(spaces[9])} 0 ${hexToRGBA(
            neutrals[2],
            0.08
        )};
                                padding-left: ${getREM(spaces[9])};
                                border-radius: ${getREM(spaces[5])};
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
