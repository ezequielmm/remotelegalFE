import React, { useCallback } from "react";
import { Row, Tooltip } from "antd";
import styled from "styled-components";
import Table from "../../components/Table";
import Button from "../../components/Button";
import CaseModal from "./CaseModal";
import Title from "../../components/Typography/Title";
import Text from "../../components/Typography/Text";
import Space from "../../components/Space";
import { useFetchCases } from "../../hooks/cases/hooks";
import * as CONSTANTS from "../../constants/cases";
import CardFetchError from "../../components/CardFetchError";
import CardResult from "../../components/CardResult/CardResult";
import { CustomStatus } from "../../components/Result/Result";

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
    const handleClose = useCallback(() => setOpenCaseModal(false), []);
    const getCaseColumns = React.useCallback(
        () => [
            {
                title: CONSTANTS.CASE_COLUMNS_TITLES[0],
                dataIndex: CONSTANTS.CASE_COLUMNS_FIELDS[0],
                sorter: true,
                sortOrder: sortedField === CONSTANTS.CASE_COLUMNS_FIELDS[0] && sortDirection,
                ellipsis: true,
                render: (text) => (
                    <Tooltip title={text}>
                        <Text>{text}</Text>
                    </Tooltip>
                ),
            },
            {
                title: CONSTANTS.CASE_COLUMNS_TITLES[1],
                dataIndex: CONSTANTS.CASE_COLUMNS_FIELDS[1],
                sorter: true,
                sortOrder: sortedField === CONSTANTS.CASE_COLUMNS_FIELDS[1] && sortDirection,
                ellipsis: true,
                render: (text) => <Text>{text || "-"}</Text>,
            },
            {
                title: CONSTANTS.CASE_COLUMNS_TITLES[2],
                dataIndex: CONSTANTS.CASE_COLUMNS_FIELDS[2],
                sorter: true,
                sortOrder: sortedField === CONSTANTS.CASE_COLUMNS_FIELDS[2] && sortDirection,
                ellipsis: true,
                render: (text) => (
                    <Tooltip title={text}>
                        <Text>{text}</Text>
                    </Tooltip>
                ),
            },
        ],
        [sortedField, sortDirection]
    );

    return (
        <>
            <CaseModal handleClose={handleClose} fetchCases={refreshList} open={openCaseModal} />
            {!error && (data === undefined || data?.length > 0) && (
                <StyledSpace direction="vertical" size="large" fullWidth>
                    <Row justify="space-between" style={{ width: "100%" }}>
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
                        rowKey="id"
                        loading={loading}
                        dataSource={data || []}
                        columns={getCaseColumns()}
                        onChange={handleListChange}
                        sortDirections={["descend", "ascend"]}
                        pagination={false}
                        scroll
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
