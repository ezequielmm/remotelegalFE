import { Row, Col } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import CardFetchError from "../../components/CardFetchError";
import { Status } from "../../components/StatusPill/StatusPill";
import Table from "../../components/Table";
import Space from "../../components/Space";
import Tabs from "../../components/Tabs";
import DatePicker from "../../components/DatePicker";
import Title from "../../components/Typography/Title";
import * as CONSTANTS from "../../constants/depositions";
import { dateToUTCString } from "../../helpers/dateToUTCString";
import { useFetchDepositions } from "../../hooks/depositions/hooks";
import { Roles } from "../../models/participant";
import { FilterCriteria } from "../../types/DepositionFilterCriteriaType";
import MyDepositionsEmptyTable from "./MyDepositionsEmptyTable";
import { DEPOSITIONS_COUNT_PER_PAGE } from "../../constants/depositions";
import { GlobalStateContext } from "../../state/GlobalState";
import useCurrentUser from "../../hooks/useCurrentUser";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);

const StyledSpaceItem = styled(Space.Item)`
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
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
    const date = dayjs(startDate).local();
    const dateFormat = date.format("ddd MMM DD YYYY");
    const startTime = date.format("hh:mm A");
    const endTime = endDate ? ` to ${dayjs(endDate).local().format("hh:mm A")}` : "";
    return { date: dateFormat, time: `${startTime}${endTime}` };
};

const { RangePicker } = DatePicker;

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
        page,
    } = useFetchDepositions();
    const [sorting, setSorting] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(FilterCriteria.UPCOMING);

    const { state } = React.useContext(GlobalStateContext);
    const { currentUser } = state?.user;
    const [getCurrentUser] = useCurrentUser();

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
                    witness: witness?.user?.firstName
                        ? `${witness?.user?.firstName} ${witness?.user?.lastName}`
                        : witness?.name,
                    courtReporter: courtReporter?.name,
                    job,
                    details: "-",
                } as MappedDeposition;
            }),
        [depositions]
    );

    const handleRefresh = () => {
        if (error) {
            refreshList();
        } else if (!currentUser) {
            getCurrentUser();
        }
    };

    const history = useHistory();

    const depositionColumns = React.useMemo(
        () =>
            CONSTANTS.getDepositionColumns(history, !!currentUser?.isAdmin).map(
                ({ sorter = true, field, ...column }: CONSTANTS.TableColumn) => ({
                    dataIndex: field,
                    sortOrder: sortedField === field && sortDirection,
                    sorter,
                    ...column,
                })
            ),
        [currentUser, history, sortedField, sortDirection]
    );

    const getFilterParam = (key: FilterCriteria) => {
        return { PastDepositions: key === FilterCriteria.PAST };
    };

    const onDepositionTabChange = (key: FilterCriteria) => {
        setFilterCriteria(key);
        handleListChange({ current: 1 }, getFilterParam(key), sorting);
    };

    const onFilterByDateChange = (dateRange) => {
        const [minDate = null, maxDate = null] = dateRange || [];
        const dateRangeFilter = {
            MinDate: minDate ? dateToUTCString(minDate?.startOf("day")) : undefined,
            MaxDate: maxDate ? dateToUTCString(maxDate?.endOf("day")) : undefined,
        };
        handleListChange({ current: 1 }, dateRangeFilter, sorting);
    };

    return (
        <>
            {!error && currentUser && (mappedDepositions === undefined || mappedDepositions?.length >= 0) && (
                <Space direction="vertical" size="large" fullHeight fullWidth>
                    <Space.Item fullWidth>
                        <Row justify="space-between" style={{ width: "100%" }}>
                            <Title level={4} noMargin weight="light" dataTestId="deposition_title">
                                My Depositions
                            </Title>
                        </Row>
                    </Space.Item>
                    <StyledSpaceItem fullWidth>
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
                        <Row justify="space-between" style={{ width: "100%" }}>
                            <Col lg={5}>
                                <RangePicker
                                    data-testid="depositions_date_range"
                                    disabled={loading}
                                    disabledDate={(date) => date.isAfter(dayjs().add(364, "day"))}
                                    ranges={{
                                        Today: [dayjs(), dayjs()],
                                        "This Week": [dayjs().startOf("week"), dayjs().endOf("week")],
                                        "This Month": [dayjs().startOf("month"), dayjs().endOf("month")],
                                    }}
                                    onChange={(dateRange) => onFilterByDateChange(dateRange)}
                                />
                            </Col>
                        </Row>

                        <Table
                            data-testid="my_depositions_table"
                            cursorPointer={!!currentUser?.isAdmin}
                            onRow={({ id, status }) => {
                                return {
                                    onClick: () => {
                                        if (currentUser?.isAdmin) {
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
                            onChange={(newPage, _, sorter) => {
                                setSorting(sorter);
                                handleListChange(newPage, getFilterParam(filterCriteria), sorter);
                            }}
                            sortDirections={["descend", "ascend"]}
                            pagination={{
                                current: page,
                                position: ["bottomRight"],
                                pageSize: DEPOSITIONS_COUNT_PER_PAGE,
                                total: filterCriteria === FilterCriteria.UPCOMING ? totalUpcoming : totalPast,
                                showSizeChanger: false,
                            }}
                            scroll
                            hscroll={1200}
                            style={{ height: "100%" }}
                            locale={{
                                emptyText: <MyDepositionsEmptyTable type={filterCriteria} />,
                            }}
                            rowClassName={(record) => (record.status === Status.canceled ? "rowCanceled" : "")}
                        />
                    </StyledSpaceItem>
                </Space>
            )}
            {(error || !currentUser) && <CardFetchError onClick={handleRefresh} />}
        </>
    );
};

export default MyDepositions;
