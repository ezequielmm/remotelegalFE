import { Row, Space } from "antd";
import moment from "moment-timezone";
import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import Button from "../../components/Button";
import CardFetchError from "../../components/CardFetchError";
import CardResult from "../../components/CardResult/CardResult";
import { CustomStatus } from "../../components/Result/Result";
import Spinner from "../../components/Spinner";
import Table from "../../components/Table";
import Title from "../../components/Typography/Title";
import * as CONSTANTS from "../../constants/depositions";
import { useFetchDepositions } from "../../hooks/depositions/hooks";
import { useUserIsAdmin } from "../../hooks/users/hooks";
import useWindowSize from "../../hooks/useWindowSize";
import { DepositionStatus } from "../../models/deposition";
import { Roles } from "../../models/participant";

const StyledSpace = styled(Space)`
    width: 100%;
    height: 100%;
    > *:last-child {
        height: 100%;
    }
`;

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
    const [checkIfUserIsAdmin, loadingUserIsAdmin, errorUserIsAdmin, userIsAdmin] = useUserIsAdmin();
    const [, windowHeight] = useWindowSize();
    const [tableScrollHeight, setTableScrollHeight] = React.useState<number>(0);
    const tableRef = React.useRef(null);

    React.useEffect(() => {
        checkIfUserIsAdmin();
    }, [checkIfUserIsAdmin]);

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

    React.useEffect(() => {
        if (userIsAdmin === undefined) return;
        const tableWrapper: HTMLElement =
            (tableRef.current?.getElementsByClassName("ant-table-wrapper")[0] as HTMLElement) || null;
        const tableHeader: HTMLElement =
            (tableRef.current?.getElementsByClassName("ant-table-header")[0] as HTMLElement) || null;
        const wrapperHeight: number = tableWrapper?.offsetHeight || 0;
        const headerHeight: number = tableHeader?.offsetHeight || 0;
        const tableContentHeight: number = wrapperHeight && headerHeight ? wrapperHeight - headerHeight : 0;
        setTableScrollHeight(tableContentHeight);
    }, [userIsAdmin, data, windowHeight]);

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

    return (
        <>
            {!loadingUserIsAdmin &&
                !error &&
                !errorUserIsAdmin &&
                (mappedDepositions === undefined || mappedDepositions?.length > 0) && (
                    <StyledSpace direction="vertical" size="large">
                        <Row justify="space-between">
                            <Title level={4} noMargin weight="light">
                                My Depositions
                            </Title>
                        </Row>
                        <Table
                            ref={tableRef}
                            rowKey="id"
                            loading={loading}
                            dataSource={mappedDepositions || []}
                            columns={depositionColumns}
                            onChange={handleListChange}
                            sortDirections={["descend", "ascend"]}
                            pagination={false}
                            scroll={mappedDepositions ? { y: tableScrollHeight } : null}
                            style={{ height: "100%" }}
                        />
                    </StyledSpace>
                )}
            {loadingUserIsAdmin && <Spinner height="100%" />}
            {(error || errorUserIsAdmin) && <CardFetchError onClick={handleRefresh} />}
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
