import { Form } from "antd";
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
    nameInput: boolean;
    roleInput: boolean;
    defaultRole?: string;
    defaultName?: string;
    email: string;
    loading?: boolean;
    disableRoleSelect?: boolean;
    returnFunc?: () => void;
    joinDeposition?: (name?: string, role?: string) => void;
}
const StyledEmailContainer = styled.div`
    margin-bottom: 24px;
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
}: IParticipantForm) => {
    const [name, setName] = useState<InputState>({
        value: "",
        invalid: false,
    });
    const [role, setRole] = useState<InputState>({ value: null, invalid: false });

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
        // TODO: Modify this function to handle different scenarios
        const nameInputInvalid = nameInput ? isInputEmpty(nameValue) : false;
        const roleInputInvalid = roleInput ? roleValue === null : false;

        if (nameInputInvalid) {
            setName({ ...name, invalid: true });
        }

        if (roleInputInvalid) {
            setRole({ ...role, invalid: true });
        }
        if (!nameInputInvalid && !roleInputInvalid) {
            return joinDeposition(nameValue, roleValue);
        }
        return null;
    };
    return (
        <Form layout="vertical" onFinish={handleSubmit}>
            <StyledEmailContainer>
                <Text uppercase state={ColorStatus.disabled} size="small" block>
                    {CONSTANTS.EMAIL_TEXT}
                </Text>
                <Text block>{email}</Text>
            </StyledEmailContainer>

            <UserInfoPanel
                nameInput={nameInput}
                roleInput={roleInput}
                role={role}
                disableRoleSelect={disableRoleSelect}
                setName={setName}
                name={name}
                setRole={setRole}
            />

            <Wizard.Actions>
                <Button
                    style={{ textTransform: "uppercase" }}
                    data-testid={CONSTANTS.BACK_BUTTON_ID}
                    onClick={returnFunc}
                    disabled={loading}
                    type="link"
                >
                    {CONSTANTS.PREVIOUS_BUTTON}
                </Button>
                <Button
                    loading={loading}
                    data-testid={CONSTANTS.STEP_2_BUTTON_ID}
                    disabled={loading}
                    onClick={handleSubmit}
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
