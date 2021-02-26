import { Roles } from "../../models/participant";

const DEPO_PARTICIPANT_MOCK = {
    id: "ed3dfae5-e9ab-4b8e-8a7a-08d896ba5d7f",
    creationDate: "2020-12-02T09:24:14-03:00",
    name: "Test1",
    email: "participant@email.fake",
    phone: 5555555555,
    role: Roles.courtReporter,
    user: null,
};
export default DEPO_PARTICIPANT_MOCK;

export const getDepoParticipantWithOverrideValues = (values?) => ({
    id: "ed3dfae5-e9ab-4b8e-8a7a-08d896ba5d7f",
    creationDate: "2020-12-02T09:24:14-03:00",
    name: "Test1",
    email: "participant@email.fake",
    phone: 5555555555,
    role: Roles.courtReporter,
    user: null,
    ...values,
});
