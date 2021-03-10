import { Roles } from "../../models/participant";
import { getDepositions } from "../constants/depositions";

export const getCurrentDepositionOneCourtReporter = (name) => ({
    ...getDepositions()[0],
    participants: [
        {
            email: "email@email.com",
            name,
            role: Roles.courtReporter,
            phone: "1234",
            user: null,
        },
    ],
});

export const getCurrentDepositionTwoParticipants = () => ({
    ...getDepositions()[0],
    participants: [
        {
            email: "email@email.com",
            name: "name1",
            role: Roles.courtReporter,
            phone: "1234",
            user: null,
        },
        {
            email: "email@email.com",
            name: "name2",
            role: Roles.attorney,
            phone: "1234",
            user: null,
        },
    ],
});

export const getCurrentDepositionNoParticipants = () => ({
    ...getDepositions()[0],
    participants: [],
});
