import { BreakroomModel } from "../../models";

/* eslint-disable import/prefer-default-export */
export const getBreakrooms = (isLocked = false): BreakroomModel.Breakroom[] => [
    {
        id: "d4403be9-1066-4aed-b1fe-08d8d8ef50e8",
        name: "Breakroom 1",
        isLocked,
        currentAttendees: [
            {
                id: "2318a78f-ae33-4f80-bdd7-8d5d189472ff",
                firstName: "Facu",
                lastName: "Cast",
                emailAddress: "fcastello@makingsense.com",
            },
        ],
    },
    { id: "3c86047b-aed5-448e-b1ff-08d8d8ef50e8", name: "Breakroom 2", isLocked: false, currentAttendees: [] },
    { id: "fdb64a60-7726-466b-b200-08d8d8ef50e8", name: "Breakroom 3", isLocked: false, currentAttendees: [] },
    { id: "3baf69a5-0789-4301-b201-08d8d8ef50e8", name: "Breakroom 4", isLocked: false, currentAttendees: [] },
];
