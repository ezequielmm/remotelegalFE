import styled from "styled-components";
import { Table } from "antd";

export const StyledFileListTable = styled(Table)`
    .ant-table {
        color: ${({ theme }) => theme.default.whiteColor};
        .ant-table-tbody tr > td {
            border-bottom: 1px solid #384962;
        }
        .ant-table-thead > tr > th {
            border-bottom: 1px solid #384962;
        }
        .ant-table-tbody tr td {
            padding: 5px;
        }
    }
    &.ant-table-wrapper {
        font-size: 40px;
        table {
            .ant-table-tbody {
                .ant-table-column-sort {
                    background: none;
                }
            }
        }
    }
    .ant-table-tbody > tr.ant-table-row:hover > td {
        background: #384962;
    }

    .file-list-options-button {
        svg {
            fill: ${({ theme }) => theme.default.whiteColor};
        }
    }
`;
