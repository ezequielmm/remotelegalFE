import React from "react";
import { Row, Col, Space } from "antd";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Result from "../../components/Result";
import CaseModal from "./CaseModal";
import Title from "../../components/Typography/Title";
import { useFetchCase } from "../../hooks/cases/hooks";
import * as CONSTANTS from "../../constants/cases";

const MyCases = () => {
    const [openCaseModal, setOpenCaseModal] = React.useState(false);
    const { handleListChange, sortedField, sortDirection, error, data, loading, refreshList } = useFetchCase();

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
            {!error && (data === null || data?.length > 0) && (
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
            {error && (
                <Row justify="center" align="middle" style={{ height: "100%" }}>
                    <Col sm={24} lg={18} xl={13} xxl={10}>
                        <Card>
                            <Result
                                title={CONSTANTS.FETCH_ERROR_MODAL_TITLE}
                                subTitle={CONSTANTS.FETCH_ERROR_MODAL_BODY}
                                status="error-fetch"
                                extra={[
                                    <Button
                                        type="primary"
                                        onClick={() => refreshList()}
                                        key="console"
                                        data-testid="new_case_button"
                                    >
                                        {CONSTANTS.FETCH_ERROR_MODAL_BUTTON}
                                    </Button>,
                                ]}
                            />
                        </Card>
                    </Col>
                </Row>
            )}
            {!error && data?.length === 0 && (
                <Row justify="center" align="middle" style={{ height: "100%" }}>
                    <Col sm={24} lg={18} xl={13} xxl={10}>
                        <Card>
                            <Result
                                title="No cases added yet"
                                subTitle="Currently, you don’t have any case added yet. Do you want to add a case?"
                                status="empty"
                                extra={
                                    <Button onClick={() => setOpenCaseModal(true)} type="primary">
                                        ADD CASE
                                    </Button>
                                }
                            />
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default MyCases;
