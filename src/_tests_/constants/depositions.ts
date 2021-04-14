import { IDeposition } from "../../models/deposition";
import { Roles } from "../../models/participant";

// eslint-disable-next-line import/prefer-default-export
export const getNoDepositions = () => [];

export const PARTICIPANT_NAME = "Participant Name";

export const DEPOSITION_ID = "859233bf-a627-471c-02bb-08d8962d8ea9";

export const getDepositions = () =>
    [
        {
            id: DEPOSITION_ID,
            creationDate: "2020-12-01T16:16:08-03:00",
            completeDate: "2020-12-01T17:16:08-03:00",
            startDate: "2021-03-24T20:32:37.757Z",
            actualStartDate: "2021-03-24T20:32:37.757Z",
            endDate: "2021-03-24T20:32:37.757Z",
            timeZone: "ET",
            caseName: "case name",
            caseNumber: "#001",
            caption: { displayName: "test.pdf" },
            witness: {
                id: "ed3dfae5-e9ab-4b8e-8a7a-08d896ba5d7f",
                creationDate: "2020-12-02T09:24:14-03:00",
                name: "Witness Name",
                email: "participant@email.fake",
                phone: null,
                role: Roles.witness,
                user: null,
            },
            isVideoRecordingNeeded: false,
            requester: {
                id: "fe8873a1-45db-4800-df3e-08d8914a73db",
                firstName: "Name",
                lastName: "Last",
                emailAddress: "some@fake.email",
                phoneNumber: "3333333333",
            },
            participants: [
                {
                    id: "ed3dfae5-e9ab-4b8e-8a7a-08d896ba5d7f",
                    creationDate: "2020-12-02T09:24:14-03:00",
                    name: PARTICIPANT_NAME,
                    email: "participant@email.fake",
                    phone: null,
                    role: Roles.courtReporter,
                    user: null,
                },
            ],
            details: "",
            room: null,
            documents: null,
            job: "12345",
        },
    ] as IDeposition[];

export const getDepositionWithOverrideValues = (values?) => {
    return {
        status: "pending",
        job: "testJob1234",
        requesterNotes: "test notes",
        addedBy: {
            firstName: "fictional creator name",
            lastName: "fictional creator last name",
        },
        id: DEPOSITION_ID,
        creationDate: "2020-12-01T16:16:08-03:00",
        completeDate: "2020-12-01T17:16:08-03:00",
        startDate: "2021-03-24T20:32:37.757Z",
        endDate: "2021-03-24T20:32:37.757Z",
        timeZone: "ET",
        caseName: "case name",
        caseNumber: "#001",
        caption: {
            displayName: "test.pdf",
        },
        witness: {
            id: "ed3dfae5-e9ab-4b8e-8a7a-08d896ba5d7f",
            creationDate: "2020-12-02T09:24:14-03:00",
            name: "Witness Name",
            email: "participant@email.fake",
            phone: null,
            role: Roles.witness,
            user: null,
        },
        isVideoRecordingNeeded: true,
        requester: {
            id: "fe8873a1-45db-4800-df3e-08d8914a73db",
            firstName: "fake requester name",
            lastName: "fake requester last name",
            emailAddress: "some@fake.email",
            phoneNumber: "3333333333",
            companyName: "fake Company",
        },
        participants: [
            {
                id: "ed3dfae5-e9ab-4b8e-8a7a-08d896ba5d7f",
                creationDate: "2020-12-02T09:24:14-03:00",
                name: PARTICIPANT_NAME,
                email: "participant@email.fake",
                phone: null,
                role: Roles.courtReporter,
                user: null,
            },
        ],
        details: "test details",
        room: null,
        documents: null,
        ...values,
    };
};
