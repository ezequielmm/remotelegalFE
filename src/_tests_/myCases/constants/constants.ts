export const EMAIL_PLACEHOLDER = "Enter your email";
export const PASSWORD_PLACEHOLDER = "Enter your password";
export const PHONE_PLACEHOLDER = "Enter your mobile phone number";
export const NAME_PLACEHOLDER = "Enter your name";
export const LAST_NAME_PLACEHOLDER = "Enter last name";
export const CONFIRM_PASSWORD_PLACEHOLDER = "Confirm your password";
export const CHECKBOX_INPUT = "I agree to Remote Legal Terms of Use";

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
