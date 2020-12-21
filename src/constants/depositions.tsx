import { History } from "history";
import React from "react";
import Button from "../components/Button";
import { MappedDeposition } from "../routes/MyDepositions/MyDepositions";

export interface TableColumn {
    title?: string;
    field?: string;
    render?: (item: MappedDeposition | string | { date: string; time: string }) => React.ReactNode;
    sorter?: boolean;
    width: string;
}

export const STATUS_COLUMN = { title: "STATUS", field: "status", width: "11%" };
export const REQUESTER_BY_COLUMN = { title: "REQUESTED BY", field: "requester", width: "14%" };
export const LAW_COLUMN = {
    title: "LAW FIRM",
    field: "company",
    render: (text) => <strong>{text || "-"}</strong>,
    width: "14%",
};
export const CASE_COLUMN = { title: "CASE", field: "caseName", width: "11%" };
export const DATE_COLUMN = {
    title: "DATE AND TIME",
    field: "startDate",
    render: ({ date, time }: { date: string; time: string }) => (
        <div>
            {date} <br /> {time}
        </div>
    ),
    width: "12%",
};
export const WITNESS_COLUMN = {
    title: "WITNESS",
    sorter: false,
    field: "witness",
    render: (text) => <strong>{text || "-"}</strong>,
    width: "12%",
};
export const COURT_REPORTER_COLUMN = {
    title: "COURT REPORTER",
    sorter: false,
    field: "courtReporter",
    render: (text) => text || "-",
    width: "12%",
};
export const JOB_COLUMN = { title: "JOB#", field: "details", render: (text) => text || "-", width: "6.5%" };
export const getActionColumns = (history) => ({
    render: ({ id }: MappedDeposition) => (
        <Button onClick={() => history.push(`/deposition/join/${id}`)} type="primary" size="small" width="75px">
            JOIN
        </Button>
    ),
    sorter: false,
    width: "6.5%",
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
