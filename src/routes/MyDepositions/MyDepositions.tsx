import { Row } from "antd";
import moment from "moment-timezone";
import React, { useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import CardFetchError from "../../components/CardFetchError";
import Spinner from "../../components/Spinner";
import { Status } from "../../components/StatusPill/StatusPill";
import Table from "../../components/Table";
import Space from "../../components/Space";
import Tabs from "../../components/Tabs";
import Title from "../../components/Typography/Title";
import * as CONSTANTS from "../../constants/depositions";
import { dateToUTCString } from "../../helpers/dateToUTCString";
import { useFetchDepositions } from "../../hooks/depositions/hooks";
import { useUserIsAdmin } from "../../hooks/users/hooks";
import { Roles } from "../../models/participant";
import { FilterCriteria } from "../../types/DepositionFilterCriteriaType";
import MyDepositionsEmptyTable from "./MyDepositionsEmptyTable";

const StyledSpace = styled(Space)`
    width: 100%;
    height: 100%;
    > *:last-child {
        height: 100%;
    }
`;

export interface MappedDeposition {
    id: string;
    status: Status;
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
    const {
        handleListChange,
        sortedField,
        sortDirection,
        error,
        depositions,
        totalPast,
        totalUpcoming,
        loading,
        refreshList,
    } = useFetchDepositions();
    const [checkIfUserIsAdmin, loadingUserIsAdmin, errorUserIsAdmin, userIsAdmin] = useUserIsAdmin();
    const [sorting, setSorting] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(FilterCriteria.UPCOMING);

    React.useEffect(() => {
        checkIfUserIsAdmin();
    }, [checkIfUserIsAdmin]);

    const mappedDepositions = React.useMemo(
        () =>
            depositions?.map(({ id, details, status, requester, witness, participants, job, ...depositionsData }) => {
                const courtReporter = participants.find((participant) => participant.role === Roles.courtReporter);
                return {
                    id,
                    status,
                    company: requester?.companyName,
                    requester: `${requester.firstName} ${requester.lastName}`,
                    caseName: `${depositionsData.caseName} ${depositionsData.caseNumber}`,
                    startDate: parseDate(depositionsData),
                    witness: witness?.name,
                    courtReporter: courtReporter?.name,
                    job,
                    details: "-",
                } as MappedDeposition;
            }),
        [depositions]
    );

    const handleRefresh = () => {
        if (error) refreshList();
        if (errorUserIsAdmin) checkIfUserIsAdmin();
    };

    const history = useHistory();

    const depositionColumns = React.useMemo(
        () =>
            CONSTANTS.getDepositionColumns(history, userIsAdmin).map(
                ({ sorter = true, field, ...column }: CONSTANTS.TableColumn) => ({
                    dataIndex: field,
                    sortOrder: sortedField === field && sortDirection,
                    sorter,
                    ...column,
                })
            ),
        [userIsAdmin, history, sortedField, sortDirection]
    );

    const getFilterParam = (key: FilterCriteria) => {
        if (key === FilterCriteria.UPCOMING) {
            return null;
        }
        return { MaxDate: dateToUTCString() };
    };

    const onDepositionTabChange = (key: FilterCriteria) => {
        setFilterCriteria(key);
        handleListChange(1, getFilterParam(key), sorting);
    };

    return (
        <>
            {!loadingUserIsAdmin &&
                !error &&
                !errorUserIsAdmin &&
                (mappedDepositions === undefined || mappedDepositions?.length >= 0) && (
                    <StyledSpace direction="vertical" size="large">
                        <Space.Item fullWidth>
                            <Row justify="space-between" style={{ width: "100%" }}>
                                <Title level={4} noMargin weight="light" dataTestId="deposition_title">
                                    My Depositions
                                </Title>
                            </Row>
                        </Space.Item>
                        <Space.Item fullWidth style={{ overflow: "hidden" }}>
                            <Tabs defaultActiveKey="1" onChange={onDepositionTabChange}>
                                <Tabs.TabPane
                                    tab={`${CONSTANTS.UPCOMING_DEPOSITION_TAB_TITLE} (${totalUpcoming || 0})`}
                                    key={FilterCriteria.UPCOMING}
                                />
                                <Tabs.TabPane
                                    tab={`${CONSTANTS.PAST_DEPOSITION_TAB_TITLE} (${totalPast || 0})`}
                                    key={FilterCriteria.PAST}
                                />
                            </Tabs>
                            <Table
                                data-testid="my_depositions_table"
                                cursorPointer={userIsAdmin}
                                onRow={({ id, status }) => {
                                    return {
                                        onClick: () => {
                                            if (userIsAdmin) {
                                                return status !== Status.completed
                                                    ? history.push(`${CONSTANTS.DEPOSITION_DETAILS_ROUTE}${id}`)
                                                    : history.push(`${CONSTANTS.DEPOSITION_POST_DEPO_ROUTE}${id}`);
                                            }
                                            return null;
                                        },
                                    };
                                }}
                                rowKey="id"
                                loading={loading}
                                dataSource={mappedDepositions || []}
                                columns={depositionColumns}
                                onChange={(page, filter, sorter) => {
                                    setSorting(sorter);
                                    handleListChange(page, getFilterParam(filterCriteria), sorter);
                                }}
                                sortDirections={["descend", "ascend"]}
                                pagination={false}
                                scroll
                                style={{ height: "100%" }}
                                locale={{
                                    emptyText: <MyDepositionsEmptyTable type={filterCriteria} />,
                                }}
                                rowClassName={(record) => (record.status === Status.canceled ? "rowCanceled" : "")}
                            />
                        </Space.Item>
                    </StyledSpace>
                )}
            {loadingUserIsAdmin && <Spinner height="100%" />}
            {(error || errorUserIsAdmin) && <CardFetchError onClick={handleRefresh} />}
        </>
    );
};

export default MyDepositions;
