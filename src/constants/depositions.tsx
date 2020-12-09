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

export const getDepositionColumns = (history: History) =>
    [
        { title: "STATUS", field: "status", width: "11%" },
        {
            title: "LAW FIRM",
            field: "company",
            render: (text) => <strong>{text || "-"}</strong>,
            width: "14%",
        },
        { title: "REQUESTED BY", field: "requester", width: "14%" },
        { title: "CASE", field: "caseName", width: "11%" },
        {
            title: "DATE AND TIME",
            field: "startDate",
            render: ({ date, time }: { date: string; time: string }) => (
                <div>
                    {date} <br /> {time}
                </div>
            ),
            width: "12%",
        },
        {
            title: "WITNESS",
            sorter: false,
            field: "witness",
            render: (text) => <strong>{text || "-"}</strong>,
            width: "12%",
        },
        {
            title: "COURT REPORTER",
            sorter: false,
            field: "courtReporter",
            render: (text) => text || "-",
            width: "12%",
        },
        { title: "JOB#", field: "details", render: (text) => text || "-", width: "6.5%" },
        {
            render: ({ id }: MappedDeposition) => (
                <Button onClick={() => history.push(`/deposition/join/${id}`)} type="primary" size="small" width="75px">
                    JOIN
                </Button>
            ),
            sorter: false,
            width: "6.5%",
        },
    ] as TableColumn[];

export const EMPTY_STATE_TITLE = "No depositions added yet";
export const EMPTY_STATE_TEXT = "Currently, you don't have any deposition added yet. Do you want to add a deposition?";
export const EMPTY_STATE_BUTTON = "SCHEDULE DEPOSITION";
