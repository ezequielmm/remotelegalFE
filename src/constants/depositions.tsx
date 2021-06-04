import { History } from "history";
import React from "react";
import { Tooltip } from "antd";
import Button from "../components/Button";
import Text from "../components/Typography/Text";
import Space from "../components/Space";
import StatusPill from "../components/StatusPill";
import { Status } from "../components/StatusPill/StatusPill";
import { MappedDeposition } from "../routes/MyDepositions/MyDepositions";

export interface TableColumn {
    title?: string;
    field?: string;
    render?: (item: MappedDeposition | string | { date: string; time: string }) => React.ReactNode;
    sorter?: boolean;
    width: string;
}

export const STATUS_COLUMN = {
    title: "STATUS",
    field: "status",
    ellipsis: true,
    render: (text) => <StatusPill status={text} />,
    width: 120,
};
export const REQUESTER_BY_COLUMN = {
    title: "REQUESTER",
    field: "requester",
    ellipsis: true,
    render: (text) => (
        <Tooltip title={text}>
            <Text>{text}</Text>
        </Tooltip>
    ),
    width: "13%",
};
export const LAW_COLUMN = {
    title: "LAW FIRM",
    field: "company",
    ellipsis: true,
    width: "11%",
    render: (text) => (
        <Tooltip title={text}>
            <Text weight="bold">{text || "-"}</Text>
        </Tooltip>
    ),
};
export const CASE_COLUMN = {
    title: "CASE",
    field: "caseName",
    ellipsis: true,
    width: "13%",
    render: (text) => (
        <Tooltip title={text}>
            <Text>{text}</Text>
        </Tooltip>
    ),
};
export const DATE_COLUMN = {
    title: "DATE AND TIME",
    field: "startDate",
    ellipsis: true,
    render: ({ date, time }: { date: string; time: string }) => (
        <Text>
            <>
                {date}
                <br />
                {time}
            </>
        </Text>
    ),
    width: "15%",
};
export const WITNESS_COLUMN = {
    title: "WITNESS",
    sorter: false,
    field: "witness",
    ellipsis: true,
    render: (text) => (
        <Tooltip title={text}>
            <Text weight="bold">{text || "-"}</Text>
        </Tooltip>
    ),
    width: "12%",
};
export const COURT_REPORTER_COLUMN = {
    title: "COURT REPORTER",
    sorter: false,
    field: "courtReporter",
    ellipsis: true,
    render: (text) => (
        <Tooltip title={text}>
            <Text weight="bold">{text || "-"}</Text>
        </Tooltip>
    ),
    width: "13%",
};
export const JOB_COLUMN = { title: "JOB#", field: "job", render: (text) => <Text>{text || "-"}</Text>, width: "8%" };
export const getActionColumns = (history) => ({
    render: ({ id, status }: MappedDeposition) => {
        const isCompleted = status === Status.completed;
        return (
            <Space justify="flex-end">
                <Button
                    disabled={status === Status.canceled}
                    onClick={(e) => {
                        e.stopPropagation();
                        history.push(isCompleted ? `/deposition/post-depo-details/${id}` : `/deposition/join/${id}`);
                    }}
                    type="primary"
                    size="small"
                    data-testid={isCompleted ? "view_button" : "join_button"}
                >
                    {isCompleted ? "VIEW" : "JOIN"}
                </Button>
            </Space>
        );
    },
    sorter: false,
    width: 90,
});

export const getDepositionColumns = (history: History, isAdmin?: boolean) =>
    (isAdmin
        ? [
              STATUS_COLUMN,
              LAW_COLUMN,
              REQUESTER_BY_COLUMN,
              CASE_COLUMN,
              DATE_COLUMN,
              WITNESS_COLUMN,
              COURT_REPORTER_COLUMN,
              JOB_COLUMN,
              getActionColumns(history),
          ]
        : [
              STATUS_COLUMN,
              CASE_COLUMN,
              WITNESS_COLUMN,
              DATE_COLUMN,
              JOB_COLUMN,
              getActionColumns(history),
          ]) as TableColumn[];

export const EMPTY_STATE_TITLE = "No depositions added yet";
export const EMPTY_STATE_TEXT = "Currently, you don't have any deposition added yet. Do you want to add a deposition?";
export const EMPTY_STATE_BUTTON = "SCHEDULE DEPOSITION";
export const DEPOSITION_DETAILS_ROUTE = "/deposition/details/";
export const DEPOSITION_POST_DEPO_ROUTE = "/deposition/post-depo-details/";
export const EMPTY_UPCOMING_DEPOSITIONS_TITLE = "No upcoming depositions to show.";
export const EMPTY_PAST_DEPOSITIONS_TITLE = "No past depositions to show.";
export const UPCOMING_DEPOSITION_TAB_TITLE = "UPCOMING DEPOSITIONS";
export const PAST_DEPOSITION_TAB_TITLE = "PAST DEPOSITIONS";

export const DEPOSITIONS_COUNT_PER_PAGE = 20;
