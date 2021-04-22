import { Form, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import UserInfoPanel from "./UserInfoPanel";
import Text from "../../../components/Typography/Text";
import Button from "../../../components/Button";
import Wizard from "../../../components/Wizard";
import isInputEmpty from "../../../helpers/isInputEmpty";
import ColorStatus from "../../../types/ColorStatus";
import * as CONSTANTS from "../../../constants/preJoinDepo";
import { InputState } from "../../../types/PreJoinDepo";

interface IParticipantForm {
    nameInput?: boolean;
    passwordInput?: boolean;
    roleInput: boolean;
    defaultRole?: string;
    defaultName?: string;
    email: string;
    loading: boolean;
    disableRoleSelect?: boolean;
    returnFunc: () => void;
    hideBackButton?: boolean;
    joinDeposition: (role: string, userData: string) => void;
    termsOfUseURL: string;
}
const StyledEmailContainer = styled.div`
    margin-bottom: 24px;
`;

const StyledCheckBoxsContainer = styled.div`
    margin-bottom: 24px;
`;

const StyledCheckBoxWrapper = styled.div`
    margin-bottom: 8px;
`;

const ParticipantInfoForm = ({
    nameInput,
    roleInput,
    email,
    loading,
    defaultName,
    defaultRole,
    returnFunc,
    joinDeposition,
    disableRoleSelect,
    passwordInput,
    hideBackButton,
    termsOfUseURL,
}: IParticipantForm) => {
    const [name, setName] = useState<InputState>({
        value: "",
        invalid: false,
    });
    const [password, setPassword] = useState<InputState>({
        value: "",
        invalid: false,
    });
    const [role, setRole] = useState<InputState>({ value: null, invalid: false });
    const [certifyInformation, setCertifyInformation] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    useEffect(() => {
        if (defaultName) {
            setName((oldName) => ({ ...oldName, value: defaultName }));
        }
        if (defaultRole) {
            setRole((oldRole) => ({ ...oldRole, value: defaultRole }));
        }
    }, [defaultName, defaultRole]);

    const handleSubmit = () => {
        const { value: nameValue } = name;
        const { value: roleValue } = role;
        const { value: passwordValue } = password;

        const nameInputInvalid = nameInput ? isInputEmpty(nameValue) : false;
        const roleInputInvalid = roleInput ? roleValue === null : false;
        const passwordInputInvalid = passwordInput ? isInputEmpty(passwordValue) : false;

        if (nameInputInvalid) {
            setName({ ...name, invalid: true });
        }

        if (roleInputInvalid) {
            setRole({ ...role, invalid: true });
        }
        if (passwordInputInvalid) {
            setPassword({ ...password, invalid: true });
        }
        if (!nameInputInvalid && !roleInputInvalid && !passwordInputInvalid) {
            return joinDeposition(roleValue, passwordValue || nameValue);
        }
        return null;
    };
    return (
        <Form layout="vertical">
            <StyledEmailContainer>
                <Text uppercase state={ColorStatus.disabled} size="small" block>
                    {CONSTANTS.EMAIL_TEXT}
                </Text>
                <Text block>{email}</Text>
            </StyledEmailContainer>

            <UserInfoPanel
                password={password}
                setPassword={setPassword}
                passwordInput={passwordInput}
                nameInput={nameInput}
                roleInput={roleInput}
                role={role}
                disableRoleSelect={disableRoleSelect}
                setName={setName}
                name={name}
                setRole={setRole}
            />
            <StyledCheckBoxsContainer>
                <StyledCheckBoxWrapper>
                    <Checkbox
                        data-testid={CONSTANTS.PREJOIN_CERTIFY_INFORMATION_TEXT_TEST_ID}
                        checked={certifyInformation}
                        onChange={() => setCertifyInformation(!certifyInformation)}
                    >
                        {CONSTANTS.PREJOIN_CERTIFY_INFORMATION_TEXT}
                    </Checkbox>
                </StyledCheckBoxWrapper>
                <StyledCheckBoxWrapper>
                    <Checkbox
                        data-testid={CONSTANTS.PREJOIN_AGREE_TERMS_AND_CONDITION_TEXT_TEST_ID}
                        checked={agreeTerms}
                        onChange={() => setAgreeTerms(!agreeTerms)}
                    >
                        {CONSTANTS.PREJOIN_AGREE_TERMS_AND_CONDITION_TEXT}
                        <Button type="link" href={termsOfUseURL} target="_blank">
                            {CONSTANTS.PREJOIN_TERMS_AND_CONDITION_LINK_TEXT}
                        </Button>
                    </Checkbox>
                </StyledCheckBoxWrapper>
            </StyledCheckBoxsContainer>

            <Wizard.Actions>
                {!hideBackButton && (
                    <Button
                        style={{ textTransform: "uppercase" }}
                        data-testid={CONSTANTS.BACK_BUTTON_ID}
                        onClick={returnFunc}
                        disabled={loading}
                        type="link"
                    >
                        {CONSTANTS.PREVIOUS_BUTTON}
                    </Button>
                )}

                <Button
                    loading={loading}
                    onClick={handleSubmit}
                    data-testid={CONSTANTS.STEP_2_BUTTON_ID}
                    disabled={loading || !certifyInformation || !agreeTerms}
                    type="primary"
                    htmlType="submit"
                >
                    {CONSTANTS.JOIN_DEPOSITION_BUTTON}
                </Button>
            </Wizard.Actions>
        </Form>
    );
};
export default ParticipantInfoForm;
