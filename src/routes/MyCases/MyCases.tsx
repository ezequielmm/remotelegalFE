import React from "react";
import { Row, Space } from "antd";
import styled from "styled-components";
import Table from "../../components/Table";
import Button from "../../components/Button";
import CaseModal from "./CaseModal";
import Title from "../../components/Typography/Title";
import { useFetchCases } from "../../hooks/cases/hooks";
import * as CONSTANTS from "../../constants/cases";
import CardFetchError from "../../components/CardFetchError";
import CardResult from "../../components/CardResult/CardResult";
import { CustomStatus } from "../../components/Result/Result";
import useWindowSize from "../../hooks/useWindowSize";

const StyledSpace = styled(Space)`
    width: 100%;
    height: 100%;
    > *:last-child {
        height: 100%;
    }
`;

const MyCases = () => {
    const [openCaseModal, setOpenCaseModal] = React.useState(false);
    const { handleListChange, sortedField, sortDirection, error, data, loading, refreshList } = useFetchCases();
    const [, windowHeight] = useWindowSize();
    const [tableScrollHeight, setTableScrollHeight] = React.useState<number>(0);
    const tableRef = React.useRef(null);

    React.useEffect(() => {
        const tableWrapper: HTMLElement =
            (tableRef.current?.getElementsByClassName("ant-table-wrapper")[0] as HTMLElement) || null;
        const tableHeader: HTMLElement =
            (tableRef.current?.getElementsByClassName("ant-table-header")[0] as HTMLElement) || null;
        const wrapperHeight: number = tableWrapper?.offsetHeight || 0;
        const headerHeight: number = tableHeader?.offsetHeight || 0;
        const tableContentHeight: number = wrapperHeight && headerHeight ? wrapperHeight - headerHeight : 0;
        setTableScrollHeight(tableContentHeight);
    }, [data, windowHeight]);

    const getCaseColumns = React.useCallback(
        () => [
            {
                title: CONSTANTS.CASE_COLUMNS_TITLES[0],
                dataIndex: CONSTANTS.CASE_COLUMNS_FIELDS[0],
                sortOrder: sortedField === CONSTANTS.CASE_COLUMNS_FIELDS[0] && sortDirection,
                sorter: true,
            },
            {
                title: CONSTANTS.CASE_COLUMNS_TITLES[1],
                dataIndex: CONSTANTS.CASE_COLUMNS_FIELDS[1],
                sortOrder: sortedField === CONSTANTS.CASE_COLUMNS_FIELDS[1] && sortDirection,
                render: (text) => text || "-",
                sorter: true,
            },
            {
                title: CONSTANTS.CASE_COLUMNS_TITLES[2],
                dataIndex: CONSTANTS.CASE_COLUMNS_FIELDS[2],
                sortOrder: sortedField === CONSTANTS.CASE_COLUMNS_FIELDS[2] && sortDirection,
                sorter: true,
            },
        ],
        [sortedField, sortDirection]
    );

    return (
        <>
            <CaseModal
                handleClose={() => {
                    setOpenCaseModal(false);
                }}
                fetchCases={refreshList}
                open={openCaseModal}
            />
            {!error && (data === undefined || data?.length > 0) && (
                <StyledSpace direction="vertical" size="large">
                    <Row justify="space-between">
                        <Title level={4} noMargin weight="light">
                            My Cases
                        </Title>
                        <Button
                            disabled={data === null || loading}
                            onClick={() => setOpenCaseModal(true)}
                            type="primary"
                            htmlType="submit"
                        >
                            ADD CASE
                        </Button>
                    </Row>
                    <Table
                        data-testid="my_cases_table"
                        ref={tableRef}
                        rowKey="id"
                        loading={loading}
                        dataSource={data || []}
                        columns={getCaseColumns()}
                        onChange={handleListChange}
                        sortDirections={["descend", "ascend"]}
                        pagination={false}
                        scroll={data ? { y: tableScrollHeight } : null}
                        style={{ height: "100%" }}
                    />
                </StyledSpace>
            )}
            {error && <CardFetchError onClick={refreshList} />}
            {!error && data?.length === 0 && (
                <CardResult
                    title={CONSTANTS.EMPTY_STATE_TITLE}
                    subTitle={CONSTANTS.EMPTY_STATE_TEXT}
                    status={CustomStatus.empty}
                    extra={
                        <Button onClick={() => setOpenCaseModal(true)} type="primary">
                            {CONSTANTS.EMPTY_STATE_BUTTON}
                        </Button>
                    }
                />
            )}
        </>
    );
};

export default MyCases;
