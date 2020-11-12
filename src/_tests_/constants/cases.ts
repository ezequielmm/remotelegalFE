export const CASE_NAME_PLACEHOLDER = "Type a case name";

export const CASE_NUMBER_PLACEHOLDER = "Type a case number";

export const ADD_CASE_BUTTON = "Add case";

export const CASE_NAME_ERROR_MESSAGE = "Please enter a case name";

export const NETWORK_ERROR = "Something went wrong. Please try again.";
export const NEW_CASE_SUCCESFUL = "Your case has been added successfully!";
export const NEW_CASE_COLLABORATORS_SUCCESFUL =
    "You can now start adding files, collaborators and depositions to this case";

export const NEW_CASE_BUTTON = /Go to my cases/;

const buildResponse = (data) => ({
    ok: true,
    json: () => data,
    headers: { get: () => "application/json" },
});

export const RESPONSE_WITH_NO_CASE = buildResponse([]);

export const CASE_NAME = "Case Name";
export const CASE_NUMBER = "123456";
export const CASE_ADDED_BY = "Case Added By";

export const RESPONSE_WITH_ONE_CASE = buildResponse([
    { id: "646661736466", caseNumber: "123456", name: CASE_NAME, addedBy: "name" },
]);

export const RESPONSE_ASC = buildResponse([
    { id: "646661736466", caseNumber: `0${CASE_NUMBER}`, name: `0${CASE_NAME}`, addedBy: `0${CASE_ADDED_BY}` },
    { id: "646661736467", caseNumber: `1${CASE_NUMBER}`, name: `1${CASE_NAME}`, addedBy: `1${CASE_ADDED_BY}` },
    { id: "646661736468", caseNumber: `2${CASE_NUMBER}`, name: `2${CASE_NAME}`, addedBy: `2${CASE_ADDED_BY}` },
    { id: "646661736469", caseNumber: `3${CASE_NUMBER}`, name: `3${CASE_NAME}`, addedBy: `3${CASE_ADDED_BY}` },
    { id: "646661736470", caseNumber: `4${CASE_NUMBER}`, name: `4${CASE_NAME}`, addedBy: `4${CASE_ADDED_BY}` },
    { id: "646661736471", caseNumber: `5${CASE_NUMBER}`, name: `5${CASE_NAME}`, addedBy: `5${CASE_ADDED_BY}` },
    { id: "646661736472", caseNumber: `6${CASE_NUMBER}`, name: `6${CASE_NAME}`, addedBy: `6${CASE_ADDED_BY}` },
    { id: "646661736473", caseNumber: `7${CASE_NUMBER}`, name: `7${CASE_NAME}`, addedBy: `7${CASE_ADDED_BY}` },
    { id: "646661736474", caseNumber: `8${CASE_NUMBER}`, name: `8${CASE_NAME}`, addedBy: `8${CASE_ADDED_BY}` },
    { id: "646661736475", caseNumber: `9${CASE_NUMBER}`, name: `9${CASE_NAME}`, addedBy: `9${CASE_ADDED_BY}` },
]);

export const RESPONSE_DESC = buildResponse([
    { id: "646661736475", caseNumber: `9${CASE_NUMBER}`, name: `9${CASE_NAME}`, addedBy: `9${CASE_ADDED_BY}` },
    { id: "646661736474", caseNumber: `8${CASE_NUMBER}`, name: `8${CASE_NAME}`, addedBy: `8${CASE_ADDED_BY}` },
    { id: "646661736473", caseNumber: `7${CASE_NUMBER}`, name: `7${CASE_NAME}`, addedBy: `7${CASE_ADDED_BY}` },
    { id: "646661736472", caseNumber: `6${CASE_NUMBER}`, name: `6${CASE_NAME}`, addedBy: `6${CASE_ADDED_BY}` },
    { id: "646661736471", caseNumber: `5${CASE_NUMBER}`, name: `5${CASE_NAME}`, addedBy: `5${CASE_ADDED_BY}` },
    { id: "646661736470", caseNumber: `4${CASE_NUMBER}`, name: `4${CASE_NAME}`, addedBy: `4${CASE_ADDED_BY}` },
    { id: "646661736469", caseNumber: `3${CASE_NUMBER}`, name: `3${CASE_NAME}`, addedBy: `3${CASE_ADDED_BY}` },
    { id: "646661736468", caseNumber: `2${CASE_NUMBER}`, name: `2${CASE_NAME}`, addedBy: `2${CASE_ADDED_BY}` },
    { id: "646661736467", caseNumber: `1${CASE_NUMBER}`, name: `1${CASE_NAME}`, addedBy: `1${CASE_ADDED_BY}` },
    { id: "646661736466", caseNumber: `0${CASE_NUMBER}`, name: `0${CASE_NAME}`, addedBy: `0${CASE_ADDED_BY}` },
]);