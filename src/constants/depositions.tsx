import { History } from "history";
import React from "react";
import Button from "../components/Button";
import Space from "../components/Space";
import StatusPill from "../components/StatusPill";
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
    render: (text) => <StatusPill status={text} />,
    width: 120,
};
export const REQUESTER_BY_COLUMN = {
    title: "REQUESTER",
    field: "requester",
    render: (text) => <small>{text}</small>,
};
export const LAW_COLUMN = {
    title: "LAW FIRM",
    field: "company",
    render: (text) => (
        <small>
            <b>{text || "-"}</b>
        </small>
    ),
};
export const CASE_COLUMN = {
    title: "CASE",
    field: "caseName",
    ellipsis: true,
    render: (text) => <small>{text}</small>,
    width: "13%",
};
export const DATE_COLUMN = {
    title: "DATE AND TIME",
    field: "startDate",
    render: ({ date, time }: { date: string; time: string }) => (
        <>
            <small>{date}</small>
            <small>{time}</small>
        </>
    ),
    width: 170,
};
export const WITNESS_COLUMN = {
    title: "WITNESS",
    sorter: false,
    field: "witness",
    render: (text) => (
        <small>
            <b>{text || "-"}</b>
        </small>
    ),
    width: "12%",
};
export const COURT_REPORTER_COLUMN = {
    title: "COURT REPORTER",
    sorter: false,
    field: "courtReporter",
    render: (text) => text || "-",
};
export const JOB_COLUMN = { title: "JOB#", field: "details", render: (text) => text || "-", width: "6.5%" };
export const getActionColumns = (history) => ({
    render: ({ id }: MappedDeposition) => (
        <Space justify="flex-end">
            <Button onClick={() => history.push(`/deposition/join/${id}`)} type="primary" size="small" width="75px">
                JOIN
            </Button>
        </Space>
    ),
    sorter: false,
    width: 60,
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
