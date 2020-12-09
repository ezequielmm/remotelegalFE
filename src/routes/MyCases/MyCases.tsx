import React from "react";
import { Row, Space } from "antd";
import Table from "../../components/Table";
import Button from "../../components/Button";
import CaseModal from "./CaseModal";
import Title from "../../components/Typography/Title";
import { useFetchCases } from "../../hooks/cases/hooks";
import * as CONSTANTS from "../../constants/cases";
import CardFetchError from "../../components/CardFetchError";
import CardResult from "../../components/CardResult/CardResult";
import { CustomStatus } from "../../components/Result/Result";

const MyCases = () => {
    const [openCaseModal, setOpenCaseModal] = React.useState(false);
    const { handleListChange, sortedField, sortDirection, error, data, loading, refreshList } = useFetchCases();

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
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
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
                        rowKey="id"
                        loading={loading}
                        dataSource={data || []}
                        columns={getCaseColumns()}
                        onChange={handleListChange}
                        sortDirections={["descend", "ascend"]}
                        pagination={false}
                    />
                </Space>
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
