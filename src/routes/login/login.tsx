import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Redirect, useHistory } from "react-router-dom";
import useInput from "../../hooks/useInput";
import * as Components from "./components/components";
import Container from "../../components/container/container";
import Label from "../../components/label/label";
import Link from "../../components/link/link";
import Button from "../../components/Button";
import Paragraph from "../../components/paragraph/paragraph";
import ErrorParagraph from "../../components/errorparagraph/errorparagraph";
import * as ERRORS from "./constants/errors";
import useAuthentication from "../../hooks/useAuthentication";
import isInputEmpty from "../../helpers/isInputEmpty";
import isInvalidEMail from "../../helpers/isInvalidEmail";

interface LoginProps {
    location?: {
        state: string;
    };
}

const Login = ({ location }: LoginProps) => {
    const params = location?.state;
    const history = useHistory();
    const [submitError, setSubmitError] = useState("");
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuthentication();
    const { inputValue: emailValue, input: emailInput, invalid: emailInvalid } = useInput(
        "email",
        "Enter your Email",
        undefined,
        isInvalidEMail
    );

    const { inputValue: passwordValue, input: passwordInput, invalid: passwordInvalid } = useInput(
        "password",
        "Enter your Password",
        "password",
        isInputEmpty
    );
    const onSubmit = async () => {
        if (submitError) {
            setSubmitError("");
        }
        setLoading(true);
        try {
            await Auth.signIn(emailValue.trim(), passwordValue);
            return history.push(params || "/dashboard");
        } catch (e) {
            setLoading(false);
            return setSubmitError(ERRORS.AWS_ERRORS[e.message] || ERRORS.NETWORK_ERROR);
        }
    };
    const disabledButton = loading || emailInvalid || passwordInvalid || !emailValue || !passwordValue;
    const emailErrorMessage =
        (emailInvalid && !emailValue.length && ERRORS.EMPTY_EMAIL_ERROR) ||
        (emailInvalid && ERRORS.INVALID_EMAIL_ERROR);
    const passwordErrorMessage = passwordInvalid && ERRORS.EMPTY_PASSWORD_ERROR;
    return isAuthenticated ? (
        <Redirect to="/dashboard" />
    ) : (
        <Container>
            <Components.StyledFormContainer>
                <Components.StyledForm onFinish={onSubmit}>
                    <Paragraph style={{ marginBottom: "0" }}>Welcome</Paragraph>
                    <Paragraph small="true">Log in into your account</Paragraph>
                    <Label htmlFor="email">Email</Label>
                    {emailInput}
                    <ErrorParagraph>{emailErrorMessage}</ErrorParagraph>
                    <Components.StyledLabelContainer>
                        <Label htmlFor="password">Password</Label>
                        {/*  <Link to="/password-recovery">Forgot password?</Link> */}
                    </Components.StyledLabelContainer>
                    {passwordInput}
                    <ErrorParagraph>{passwordErrorMessage}</ErrorParagraph>
                    <Button disabled={disabledButton} htmlType="submit">
                        Log in
                    </Button>
                    <ErrorParagraph>{submitError}</ErrorParagraph>
                    <Components.StyledNewUserParagraph>New user?</Components.StyledNewUserParagraph>
                    <Link to="/sign-up">Create an account</Link>
                </Components.StyledForm>
            </Components.StyledFormContainer>
        </Container>
    );
};

export default Login;
