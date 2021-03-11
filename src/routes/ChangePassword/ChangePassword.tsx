import React, { useCallback } from "react";
import { Col, Form, Row } from "antd";
import { Redirect, useHistory } from "react-router-dom";
import useInput from "../../hooks/useInput";
import Space from "../../components/Space";
import Container from "../../components/Container";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import * as CONSTANTS from "../../constants/changePassword";
import { useChangePassword, useVerifyChangePasswordToken } from "../../hooks/auth";
import isPasswordInvalid from "../../helpers/isPasswordInvalid";
import Title from "../../components/Typography/Title";
import Text from "../../components/Typography/Text";
import { InputWrapper } from "../../components/Input/styles";
import ColorStatus from "../../types/ColorStatus";
import Spinner from "../../components/Spinner";

const ChangePassword = () => {
    const history = useHistory();
    const { inputValue: passwordValue, input: passwordInput, invalid: passwordInvalid } = useInput(isPasswordInvalid, {
        name: "password",
        placeholder: CONSTANTS.PASSWORD_PLACEHOLDER,
        type: "password",
    });

    const {
        inputValue: confirmPasswordValue,
        input: confirmPasswordInput,
        invalid: confirmPasswordInvalid,
        setInvalid: setConfirmPasswordInvalid,
        touched: confirmPasswordTouched,
    } = useInput((value: string) => value !== passwordValue, {
        name: "confirm-password",
        placeholder: CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER,
        type: "password",
    });
    const {
        isAuthenticated,
        verificationHash,
        data,
        loading: loadingVerifyToken,
        error: verifyChangePasswordError,
    } = useVerifyChangePasswordToken();
    const [changePassword, loading, error, changedPassword] = useChangePassword();

    const handleChangePassword = useCallback(() => {
        changePassword(passwordValue, verificationHash);
    }, [changePassword, passwordValue, verificationHash]);

    React.useEffect(() => {
        if (changedPassword) history.push("/", { changedPassword: true });
    }, [history, changedPassword]);

    React.useEffect(() => {
        const passwordsMatch = passwordValue === confirmPasswordValue;
        if (confirmPasswordTouched && passwordsMatch) {
            setConfirmPasswordInvalid(false);
        } else if (confirmPasswordTouched && !passwordsMatch) {
            setConfirmPasswordInvalid(true);
        }
    }, [confirmPasswordTouched, passwordValue, confirmPasswordValue, setConfirmPasswordInvalid]);

    React.useEffect(() => {
        if (!verificationHash || verifyChangePasswordError) history.push("/", { changedPassword: false });
    }, [history, verificationHash, verifyChangePasswordError]);

    const passwordErrorMessage = passwordInvalid && CONSTANTS.PASSWORD_ERROR;
    const confirmPasswordErrorMessage = confirmPasswordInvalid && CONSTANTS.CONFIRM_PASSWORD_ERROR;
    const networkError = error && error !== 409 && CONSTANTS.NETWORK_ERROR;

    const disabledButton = loading || isPasswordInvalid(passwordValue) || confirmPasswordValue !== passwordValue;

    if (loadingVerifyToken) return <Spinner />;

    return isAuthenticated && !verificationHash ? (
        <Redirect to="/dashboard" />
    ) : (
        <Container>
            <Row justify="center" align="middle">
                <Col xs={20} sm={16} lg={14} xxl={12}>
                    <Form layout="vertical">
                        <Space direction="vertical" size="large" fullWidth>
                            <Space.Item fullWidth>
                                <Title level={3} weight="light" noMargin>
                                    {CONSTANTS.CHANGE_PASSWORD_TITLE}
                                </Title>
                                <Text size="large">{`${CONSTANTS.CHANGE_PASSWORD_SUBTITLE} ${data?.email}`}</Text>
                            </Space.Item>
                            {networkError && <Alert data-testid={networkError} message={networkError} type="error" />}
                            <Space.Item fullWidth>
                                <Form.Item label="Password" htmlFor="password">
                                    <InputWrapper>
                                        {passwordInput}
                                        {passwordErrorMessage && (
                                            <Text
                                                dataTestId={passwordErrorMessage}
                                                size="small"
                                                state={ColorStatus.error}
                                            >
                                                {passwordErrorMessage}
                                            </Text>
                                        )}
                                        <div>
                                            <Text size="small" block ellipsis={false} state={ColorStatus.disabled}>
                                                {CONSTANTS.PASSWORD_TITLE}
                                            </Text>
                                            <Text size="small" block ellipsis={false} state={ColorStatus.disabled}>
                                                {CONSTANTS.PASSWORD_SUBTITLE}
                                            </Text>
                                        </div>
                                    </InputWrapper>
                                </Form.Item>
                                <Form.Item style={{ margin: 0 }} label="Confirm password" htmlFor="confirm-password">
                                    <InputWrapper>
                                        {confirmPasswordInput}
                                        {confirmPasswordErrorMessage && (
                                            <Text
                                                dataTestId={confirmPasswordErrorMessage}
                                                size="small"
                                                state={ColorStatus.error}
                                            >
                                                {confirmPasswordErrorMessage}
                                            </Text>
                                        )}
                                    </InputWrapper>
                                </Form.Item>
                            </Space.Item>
                            <Button
                                data-testid="change_password_button"
                                type="primary"
                                block
                                disabled={disabledButton}
                                onClick={handleChangePassword}
                                htmlType="submit"
                            >
                                {CONSTANTS.CHANGE_PASSWORD}
                            </Button>
                        </Space>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ChangePassword;
