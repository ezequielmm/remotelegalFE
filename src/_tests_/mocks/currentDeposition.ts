import { Roles } from "../../models/participant";

export const getCurrentDepositionOneCourtReporter = (name) => ({
    participants: [
        {
            email: "email@email.com",
            name: name,
            role: Roles.courtReporter,
            phone: "1234",
            user: null,
        },
    ],
});

export const getCurrentDepositionTwoParticipants = () => ({
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
    participants: [],
});
