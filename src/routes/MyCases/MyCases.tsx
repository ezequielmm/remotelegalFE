/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Card, Col, Table } from "antd";
import Button from "../../components/Button";
import FetchingErrorCard from "../../components/FetchingErrorCard/FetchingErrorCard";
import Result from "../../components/Result";
import { useFetchCase } from "../../hooks/cases/hooks";
import * as Components from "./styles";
import CaseModal from "./CaseModal";
import { CASE_COLUMNS_FIELDS, CASE_COLUMNS_TITLES } from "../../constants/cases";

const MyCases = () => {
    const [openCaseModal, setOpenCaseModal] = React.useState(false);
    const { handleListChange, sortedField, sortDirection, error, data, loading, refreshList } = useFetchCase();

    const getCaseColumns = React.useCallback(
        () => [
            {
                title: CASE_COLUMNS_TITLES[0],
                dataIndex: CASE_COLUMNS_FIELDS[0],
                sortOrder: sortedField === CASE_COLUMNS_FIELDS[0] && sortDirection,
                sorter: true,
            },
            {
                title: CASE_COLUMNS_TITLES[1],
                dataIndex: CASE_COLUMNS_FIELDS[1],
                sortOrder: sortedField === CASE_COLUMNS_FIELDS[1] && sortDirection,
                render: (text) => text || "-",
                sorter: true,
            },
            {
                title: CASE_COLUMNS_TITLES[2],
                dataIndex: CASE_COLUMNS_FIELDS[2],
                sortOrder: sortedField === CASE_COLUMNS_FIELDS[2] && sortDirection,
                sorter: true,
            },
        ],
        [sortedField, sortDirection]
    );

    return (
        <Components.MyCasesContainer>
            <CaseModal
                handleClose={() => {
                    setOpenCaseModal(false);
                }}
                fetchCases={refreshList}
                open={openCaseModal}
            />
            {error && <FetchingErrorCard refreshPage={refreshList} />}
            {!error && (data === null || data?.length > 0) && (
                <Components.TableContainer>
                    <Components.TopActions>
                        <div> My Cases</div>
                        <Components.ButtonContainer>
                            <Button
                                disabled={data === null || loading}
                                onClick={() => setOpenCaseModal(true)}
                                type="primary"
                                block
                                htmlType="submit"
                            >
                                ADD CASE
                            </Button>
                        </Components.ButtonContainer>
                    </Components.TopActions>
                    <Table
                        rowKey="id"
                        loading={loading}
                        dataSource={data || []}
                        columns={getCaseColumns()}
                        onChange={handleListChange}
                        sortDirections={["descend", "ascend"]}
                        pagination={false}
                    />
                </Components.TableContainer>
            )}

            {!error && data?.length === 0 && (
                <Col sm={24} lg={18} xl={12} xxl={10}>
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
            )}
        </Components.MyCasesContainer>
    );
};

export default MyCases;
