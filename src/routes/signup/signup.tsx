import React, { useState } from "react";
import { Checkbox } from "antd";
import { Redirect } from "react-router-dom";
import useInput from "../../hooks/useInput";
import useFetch from "../../hooks/useFetch";
import * as Components from "./components/components";
import Container from "../../components/container/container";
import Label from "../../components/Label/Label";
import Link from "../../components/link/link";
import Button from "../../components/Button";
import Paragraph from "../../components/paragraph/paragraph";
import ErrorParagraph from "../../components/errorparagraph/errorparagraph";
import * as ERRORS from "./constants/errors";
import useAuthentication from "../../hooks/useAuthentication";
import isInputEmpty from "../../helpers/isInputEmpty";
import isInvalidEMail from "../../helpers/isInvalidEmail";
import isPasswordInvalid from "../../helpers/isPasswordInvalid";
import isPhoneInvalid from "../../helpers/isPhoneInvalid";
import buildRequestOptions from "../../helpers/buildRequestOptions";
import CodeSent from "./components/code-sent";

const SignUp = () => {
    const { isAuthenticated } = useAuthentication();
    const [checked, setChecked] = useState(false);
    const { inputValue: nameValue, input: nameInput, invalid: nameInvalid } = useInput(
        "firstname",
        "Enter your name",
        undefined,
        isInputEmpty,
        undefined,
        50
    );
    const { inputValue: lastNameValue, input: lastNameInput, invalid: lastNameInvalid } = useInput(
        "lastname",
        "Enter last name",
        undefined,
        isInputEmpty,
        undefined,
        50
    );
    const { inputValue: emailValue, input: emailInput, invalid: emailInvalid } = useInput(
        "email",
        "Enter your email",
        undefined,
        isInvalidEMail
    );
    const { input: phoneInput, invalid: phoneInvalid, inputValue: phoneValue } = useInput(
        "phone",
        "Enter your mobile phone number",
        "tel",
        isPhoneInvalid
    );

    const { inputValue: passwordValue, input: passwordInput, invalid: passwordInvalid } = useInput(
        "password",
        "Enter your password",
        "password",
        isPasswordInvalid
    );

    const {
        inputValue: confirmPasswordValue,
        input: confirmPasswordInput,
        invalid: confirmPasswordInvalid,
        setInvalid: setConfirmPasswordInvalid,
        touched: confirmPasswordTouched,
    } = useInput("confirm-password", "confirm your password", "password", (value: string) => value !== passwordValue);

    React.useEffect(() => {
        const passwordsMatch = passwordValue === confirmPasswordValue;
        if (confirmPasswordTouched && passwordsMatch) {
            setConfirmPasswordInvalid(false);
        } else if (confirmPasswordTouched && !passwordsMatch) {
            setConfirmPasswordInvalid(true);
        }
    }, [confirmPasswordTouched, passwordValue, confirmPasswordValue, setConfirmPasswordInvalid]);

    const requestObj = buildRequestOptions("POST", {
        firstName: nameValue,
        lastName: lastNameValue,
        phoneNumber: phoneValue,
        password: passwordValue,
        emailAddress: emailValue,
    });

    const { error, data, loading, fetchAPI } = useFetch(`${process.env.REACT_APP_BASE_BE_URL}/api/Users`, requestObj);

    const emailErrorMessage =
        emailInvalid && !emailValue.length ? ERRORS.EMPTY_EMAIL_ERROR : emailInvalid && ERRORS.INVALID_EMAIL_ERROR;
    const passwordErrorMessage = passwordInvalid && ERRORS.PASSWORD_ERROR;
    const nameErrorMessage = nameInvalid && ERRORS.FIRST_NAME_ERROR;
    const lastNameErrorMessage = lastNameInvalid && ERRORS.LAST_NAME_ERROR;
    const phoneErrorMessage = phoneInvalid && ERRORS.PHONE_ERROR;
    const confirmPasswordErrorMessage = confirmPasswordInvalid && ERRORS.CONFIRM_PASSWORD_ERROR;
    const networkError = error && error !== 400 && ERRORS.NETWORK_ERROR;
    const SignUpErrorMessage = error === 400 && ERRORS.WAITING_FOR_CODE;

    const disabledButton =
        loading ||
        isInvalidEMail(emailValue) ||
        isPasswordInvalid(passwordValue) ||
        isInputEmpty(nameValue) ||
        isInputEmpty(lastNameValue) ||
        isPhoneInvalid(phoneValue) ||
        confirmPasswordValue !== passwordValue ||
        !checked;

    return isAuthenticated ? (
        <Redirect to="/dashboard" />
    ) : (
        <Container>
            <Components.StyledFormContainer>
                <Components.StyledForm>
                    {data ? (
                        <CodeSent email={emailValue} />
                    ) : (
                        <>
                            <Paragraph style={{ marginBottom: "0" }}>Welcome</Paragraph>
                            <Paragraph small="true">Create your account</Paragraph>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    <Label htmlFor="firstname">First name</Label>
                                    {nameInput}
                                    <ErrorParagraph>{nameErrorMessage}</ErrorParagraph>
                                </div>
                                <div>
                                    <Label htmlFor="lastname">Last name</Label>
                                    {lastNameInput}
                                    <ErrorParagraph>{lastNameErrorMessage}</ErrorParagraph>
                                </div>
                            </div>
                            <Label htmlFor="email">Email address</Label>
                            {emailInput}
                            <ErrorParagraph>{emailErrorMessage}</ErrorParagraph>
                            <Label htmlFor="phone">Mobile phone number (optional)</Label>
                            {phoneInput}
                            <ErrorParagraph>{phoneErrorMessage}</ErrorParagraph>
                            <Components.StyledLabelContainer>
                                <Label htmlFor="password">Password</Label>
                            </Components.StyledLabelContainer>
                            {passwordInput}
                            <ErrorParagraph>{passwordErrorMessage}</ErrorParagraph>
                            <Paragraph style={{ fontSize: "0.75rem", margin: "0", color: "#8591A6" }} small="true">
                                8 digits minimum, combining numbers and letters
                            </Paragraph>
                            <Paragraph style={{ fontSize: "0.75rem", color: "#8591A6" }} small="true">
                                At least one uppercase and one lowercase
                            </Paragraph>
                            <Label htmlFor="confirm-password">Confirm password</Label>
                            {confirmPasswordInput}
                            <ErrorParagraph>{confirmPasswordErrorMessage}</ErrorParagraph>
                            <Button disabled={disabledButton} onClick={fetchAPI} htmlType="submit">
                                Create account
                            </Button>
                            <ErrorParagraph>{networkError || SignUpErrorMessage}</ErrorParagraph>
                            <Checkbox checked={checked} onChange={() => setChecked(!checked)}>
                                I agree to Remote Legal Terms of Use
                            </Checkbox>
                            <div style={{ marginTop: "0.5rem" }}>
                                <Components.StyledNewUserParagraph>Have an account?</Components.StyledNewUserParagraph>
                                <Link to="/">Log in</Link>
                            </div>
                        </>
                    )}
                </Components.StyledForm>
            </Components.StyledFormContainer>
        </Container>
    );
};

export default SignUp;
