export const EMAIL_PLACEHOLDER = "Enter your email";
export const PASSWORD_PLACEHOLDER = "Enter your password";
export const PHONE_PLACEHOLDER = "Enter your company phone number";
export const NAME_PLACEHOLDER = "Enter your name";
export const LAST_NAME_PLACEHOLDER = "Enter last name";
export const CONFIRM_PASSWORD_PLACEHOLDER = "Confirm your password";
export const CHECKBOX_INPUT = "I agree to Remote Legal Terms of Use";
export const COMPANY_NAME_PLACEHOLDER = "Enter your company name";
export const COMPANY_ADDRESS_PLACEHOLDER = "Enter your company address";

export const getUser1 = () => ({
    id: "adfe3315-c9d6-4691-9a61-08d886951bc0",
    creationDate: "2020-11-12T12:36:31",
    emailAddress: "email@address.com",
    firstName: "First",
    lastName: "Last",
    password: "pass1234",
    phoneNumber: "3333333333",
    isAdmin: true,
});

export const getUserNotAdmin = () => ({
    id: "adfe3315-c9d6-4691-9a61-08d886951bc0",
    creationDate: "2020-11-12T12:36:31",
    emailAddress: "email2@address.com",
    firstName: "First",
    lastName: "Last",
    password: "pass1234",
    phoneNumber: "3333333333",
    isAdmin: false,
});

export const MOCKED_EMAIL = "test@test.com";
export const MOCKED_LOCATION = { state: { email: MOCKED_EMAIL } };
