import React, { forwardRef } from "react";
import { Table } from "antd";
import { DefaultRecordType } from "rc-table/lib/interface";
import { TableProps } from "antd/lib/table/Table";
import styled from "styled-components";
import { getREM, hexToRGBA, getWeightNumber, getPX } from "../../constants/styles/utils";
import { ThemeMode } from "../../types/ThemeType";
import useWindowSize from "../../hooks/useWindowSize";

export interface ITableProps extends Omit<TableProps<DefaultRecordType>, "scroll"> {
    cursorPointer?: boolean;
    scroll?: boolean;
}

const StyledTable = styled(Table)<TableProps<DefaultRecordType> & Pick<ITableProps, "cursorPointer">>`
    ${({ theme, scroll, cursorPointer }) => {
        const { fontSizes, spaces, borderRadiusBase } = theme.default;
        const { neutrals, disabled, primary, inDepoBlue, inDepoNeutrals } = theme.colors;

        const styles = `
            &.ant-table-wrapper {
                ${scroll ? "height: 100%;" : ""}

                ${
                    theme.mode === ThemeMode.inDepo
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
                                    border-radius: ${theme.mode === ThemeMode.inDepo ? "" : `${getREM(spaces[5])}`};
                                    box-shadow: ${theme.mode === ThemeMode.inDepo ? "none" : ""};
                                    padding: ${getREM(spaces[9])} ${getREM(spaces[4])};
                                    &:hover {
                                        ${theme.mode === ThemeMode.inDepo ? `background: transparent;` : ""}
                                    }
                                }
                            }
                            ${
                                theme.mode === ThemeMode.inDepo
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

                .ant-table-body {
                    overflow-y: auto !important;

                    ${
                        scroll
                            ? `
                                padding-right: ${getREM(theme.default.spaces[6])}; 
                                scrollbar-color: ${`${theme.colors.disabled[7]} ${theme.default.disabledBg}`};
                                scrollbar-width: thin;
                                &::-webkit-scrollbar {
                                    width: ${getPX(theme.default.spaces[3])};
                                    height: ${getPX(theme.default.spaces[3])};
                                }
                                &::-webkit-scrollbar-track {
                                    background-color: ${theme.default.disabledBg};
                                }
                                &::-webkit-scrollbar-thumb {
                                    border-radius: ${getPX(theme.default.spaces[5])};
                                    background: ${theme.colors.disabled[7]};
                                }
                            `
                            : ""
                    }
                }

                .ant-table-header table{
                    ${
                        scroll
                            ? `
                            padding-right: 1.5rem;
                            `
                            : ""
                    }
                }

                table {
                    border-radius: 0;
                    border-spacing: ${theme.mode === ThemeMode.inDepo ? "" : `0 ${getREM(spaces[3])};`};

                    .ant-table-thead > tr > th:not(.ant-table-column-has-sorters), 
                    .ant-table tfoot > tr > th:not(.ant-table-column-has-sorters) {
                        padding: 10px ${getREM(spaces[6])};
                    }

                    thead.ant-table-thead > tr > th.ant-table-cell.ant-table-selection-column,
                    tbody.ant-table-tbody > tr > td.ant-table-cell.ant-table-selection-column {
                        text-align: center;
                        padding-left: ${getREM(spaces[6])};
                        padding-right: ${getREM(spaces[6])};

                        .ant-checkbox-wrapper {
                            .ant-checkbox {
                                .ant-checkbox-inner {
                                    border-radius:  ${getREM(spaces[2])};
                                    &:after {
                                        display: block;
                                    }
                                }
                            }
                        }                        
                    }

                    thead.ant-table-thead {
                        > tr {
                            > th {
                                border-radius: 0;
                                background-color: transparent;
                                font-size: ${getREM(fontSizes[8])};
                                text-transform: uppercase;
                                font-weight: ${getWeightNumber("bold")};
                                border-bottom-color: ${theme.mode === ThemeMode.inDepo ? disabled[9] : neutrals[3]};
                                &:first-child {
                                    .ant-table-column-sorters {
                                        padding-left: ${getREM(spaces[6])};
                                    } 
                                }
                                &:last-child {
                                    .ant-table-column-sorters {
                                        padding-right: ${getREM(spaces[6])};
                                    } 
                                }
                                .ant-table-column-sorters {
                                    padding: 10px ${getREM(spaces[4])};
                                    .active {
                                        color: ${theme.mode === ThemeMode.inDepo ? inDepoBlue[4] : ""};
                                    }
                                    .ant-table-column-sorter {
                                        color: ${theme.mode === ThemeMode.inDepo ? neutrals[2] : neutrals[1]};
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
                            cursor: ${cursorPointer ? "pointer" : "auto"};
                            background-color: ${theme.mode === ThemeMode.inDepo ? `transparent` : neutrals[6]};

                            &.ant-table-row.rowCanceled {
                                background-color: ${theme.colors.error[0]};
                            }

                            &.ant-table-row:hover > td {
                                background-color: ${
                                    theme.mode === ThemeMode.inDepo
                                        ? hexToRGBA(neutrals[1], 0.2)
                                        : hexToRGBA(neutrals[3], 0.3)
                                };
                            }

                            &.ant-table-row-selected > td {
                                background-color: transparent;
                            }

                            > td.ant-table-cell {
                                box-shadow: ${
                                    theme.mode === ThemeMode.inDepo
                                        ? `none`
                                        : `0 ${getREM(spaces[5])} ${getREM(spaces[9])} 0 ${hexToRGBA(
                                              neutrals[2],
                                              0.08
                                          )}`
                                };
                                padding: ${getREM(spaces[4])};
                                height: ${getREM(spaces[10] * 2)};
                                color: ${theme.mode === ThemeMode.inDepo ? neutrals[6] : ""};
                                border-bottom-color: ${theme.mode === ThemeMode.inDepo ? disabled[9] : ""};
                                &:first-child {
                                    border-radius: ${
                                        theme.mode === ThemeMode.inDepo
                                            ? `0`
                                            : `${getREM(spaces[5])} 0 0 ${getREM(spaces[5])}`
                                    };
                                    padding: ${getREM(spaces[4])} ${getREM(spaces[6])};
                                }
                                &:last-child {
                                    border-radius: ${
                                        theme.mode === ThemeMode.inDepo
                                            ? `0`
                                            : `0 ${getREM(spaces[5])} ${getREM(spaces[5])} 0`
                                    };
                                }

                                small {
                                    font-size: ${getREM(fontSizes[8])};
                                    display: block;
                                    
                                    @media (min-width: ${theme.default.breakpoints.xxl}) {
                                        font-size: ${getREM(fontSizes[7])};
                                    }
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
                            > td.ant-table-column-sort {
                                background: transparent
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
                .ant-pagination {
                    .ant-pagination-item, .ant-pagination-item-link {
                        border-radius: ${getPX(spaces[3])};
                    }
                    .ant-pagination-item-link {
                        .anticon {
                            vertical-align: text-top;
                        }
                    }
                }
            }
        `;
        return styles;
    }}
`;

const table = forwardRef(({ scroll, ...props }: ITableProps) => {
    const [windowHeight] = useWindowSize();
    const [tableScrollHeight, setTableScrollHeight] = React.useState<number>(0);
    const tableRef = React.useRef(null);

    React.useEffect(() => {
        const tableWrapper: HTMLElement =
            (tableRef.current?.getElementsByClassName("ant-table-wrapper")[0] as HTMLElement) || null;
        const tableHeader: HTMLElement =
            (tableRef.current?.getElementsByClassName("ant-table-thead")[0] as HTMLElement) || null;
        const tablePagination: HTMLElement =
            (tableRef.current?.getElementsByClassName("ant-table-pagination")[0] as HTMLElement) || null;
        const tablePaginationMargin: number = tablePagination
            ? parseInt(window.getComputedStyle(tablePagination as Element)?.marginTop, 10) +
              parseInt(window.getComputedStyle(tablePagination as Element)?.marginBottom, 10)
            : 0;
        const wrapperHeight: number = tableWrapper?.offsetHeight || 0;
        const headerHeight: number = tableHeader?.offsetHeight || 0;
        const paginationHeight: number = tablePagination?.offsetHeight + tablePaginationMargin || 0;
        const tableContentHeight: number =
            wrapperHeight && headerHeight ? wrapperHeight - headerHeight - paginationHeight : 0;
        setTableScrollHeight(tableContentHeight);
    }, [props.dataSource, windowHeight]);

    return (
        <div ref={tableRef} style={{ flex: 1, overflow: "hidden", width: "100%" }}>
            <StyledTable {...props} scroll={scroll && props.dataSource ? { y: tableScrollHeight } : null} />
        </div>
    );
});
export default table;
