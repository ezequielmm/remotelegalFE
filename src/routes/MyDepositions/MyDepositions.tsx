import { Row, Space } from "antd";
import moment from "moment-timezone";
import React from "react";
import { useHistory } from "react-router";
import Button from "../../components/Button";
import CardFetchError from "../../components/CardFetchError";
import CardResult from "../../components/CardResult/CardResult";
import { CustomStatus } from "../../components/Result/Result";
import Table from "../../components/Table";
import Title from "../../components/Typography/Title";
import * as CONSTANTS from "../../constants/depositions";
import { useFetchDepositions } from "../../hooks/depositions/hooks";
import { DepositionStatus } from "../../models/deposition";
import { Roles } from "../../models/participant";

export interface MappedDeposition {
    id: string;
    status: DepositionStatus;
    company: string;
    requester: string;
    caseName: string;
    startDate: { date: string; time: string };
    witness?: string;
    courtReporter?: string;
    details?: string;
}

const parseDate = ({ startDate, endDate }): { date: string; time: string } => {
    const date = moment(startDate).local();
    const dateFormat = date.format("ddd MMM DD, yyyy");
    const startTime = date.format("hh:mm A");
    const endTime = endDate ? ` to ${moment(endDate).local().format("hh:mm A")}` : "";
    return { date: dateFormat, time: `${startTime}${endTime}` };
};

const MyDepositions = () => {
    const { handleListChange, sortedField, sortDirection, error, data, loading, refreshList } = useFetchDepositions();
    const mappedDepositions = React.useMemo(
        () =>
            data?.map(({ id, details, status, requester, witness, participants, ...depositions }) => {
                const courtReporter = participants.find((participant) => participant.role === Roles.courtReporter);
                return {
                    id,
                    status,
                    company: requester?.companyName,
                    requester: `${requester.firstName} ${requester.lastName}`,
                    caseName: `${depositions.caseName} ${depositions.caseNumber}`,
                    startDate: parseDate(depositions),
                    witness: witness?.name,
                    courtReporter: courtReporter?.name,
                    details: "-",
                } as MappedDeposition;
            }),
        [data]
    );

    const history = useHistory();

    const depositionColumns = React.useMemo(
        () =>
            CONSTANTS.getDepositionColumns(history).map(
                ({ sorter = true, field, ...column }: CONSTANTS.TableColumn) => ({
                    dataIndex: field,
                    sortOrder: sortedField === field && sortDirection,
                    sorter,
                    ...column,
                })
            ),
        [history, sortedField, sortDirection]
    );

    return (
        <>
            {!error && (mappedDepositions === undefined || mappedDepositions?.length > 0) && (
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <Row justify="space-between">
                        <Title level={4} noMargin weight="light">
                            My Depositions
                        </Title>
                    </Row>

                    <Table
                        rowKey="id"
                        loading={loading}
                        dataSource={mappedDepositions || []}
                        columns={depositionColumns}
                        onChange={handleListChange}
                        sortDirections={["descend", "ascend"]}
                        pagination={false}
                    />
                </Space>
            )}
            {error && <CardFetchError onClick={refreshList} />}
            {!error && mappedDepositions?.length === 0 && (
                <CardResult
                    title={CONSTANTS.EMPTY_STATE_TITLE}
                    subTitle={CONSTANTS.EMPTY_STATE_TEXT}
                    status={CustomStatus.empty}
                    extra={
                        <Button onClick={() => history.push("/deposition/new")} type="primary">
                            {CONSTANTS.EMPTY_STATE_BUTTON}
                        </Button>
                    }
                />
            )}
        </>
    );
};

export default MyDepositions;
