import { useEffect, useState } from "react";

import { Story, Meta } from "@storybook/react/types-6-0";

import { Form } from "antd";
import Button from "prp-components-library/src/components/Button";
import { InputWrapper } from "prp-components-library/src/components/Input/styles";
import Select from "prp-components-library/src/components/Select";
import Text from "prp-components-library/src/components/Text";
import Wizard from "prp-components-library/src/components/Wizard";
import styled from "styled-components";

import isInvalidEMail from "../helpers/isInvalidEmail";
import useInput from "../hooks/useInput";
import ColorStatus from "../types/ColorStatus";

export default {
    title: "Wizard",
    component: Wizard,
    argTypes: {
        title: {
            control: {
                type: "text",
            },
        },
        text: {
            control: {
                type: "text",
            },
        },
    },
} as Meta;

const Template: Story = ({ ...args }) => {
    const isInputEmpty = (value) => value.length === 0;

    const [role, setRole] = useState<number | null>(null);
    const [submitInvalid, setSubmitInvalid] = useState<boolean>(true);
    const [step, setStep] = useState<number>(0);
    const [submitText, setSubmitText] = useState<string>("Next");
    const totalSteps = 2;

    const StyledEmailContainer = styled.div`
        margin-bottom: 24px;
    `;

    const {
        inputValue: emailValue,
        input: emailInput,
        invalid: emailInvalid,
        setValue: setEmailValue,
    } = useInput(isInvalidEMail, {
        name: "email",
        placeholder: "Enter your email",
        maxLength: 50,
    });

    const {
        inputValue: nameValue,
        input: nameInput,
        invalid: nameInvalid,
        setValue: setNameValue,
    } = useInput(isInputEmpty, {
        name: "fullname",
        placeholder: "Enter your full name",
        maxLength: 50,
    });

    const handleRoleChange = (value) => {
        setRole(value || null);
    };

    const submitWizard = () => {
        console.log("submitted!");
    };

    const handleSubmit = () => {
        if (step === totalSteps - 1) {
            submitWizard();
        } else {
            setStep((prevStep) => prevStep + 1);
        }
    };

    const handlePrev = () => {
        if (step === 0) {
            return;
        }
        setStep((prevStep) => prevStep - 1);
    };

    useEffect(() => {
        if (step === 0) {
            setSubmitInvalid(!!isInvalidEMail(emailValue));
        }
        if (step === 1) {
            setSubmitInvalid(!(nameValue && role));
        }
    }, [emailInvalid, emailValue, nameInvalid, nameValue, role, step, submitInvalid]);

    useEffect(() => {
        if (step === totalSteps - 1) {
            setSubmitText("JOIN DEPOSITION");
        } else {
            setSubmitText("NEXT");
        }
    }, [step, totalSteps]);

    return (
        <Wizard step={step} totalSteps={totalSteps} {...args}>
            <Form layout="vertical">
                {step === 0 && (
                    <Form.Item label="Email" htmlFor="email">
                        <InputWrapper>{emailInput}</InputWrapper>
                    </Form.Item>
                )}

                {step === 1 && (
                    <div>
                        <StyledEmailContainer>
                            <Text state={ColorStatus.disabled} size="small" block>
                                EMAIL
                            </Text>
                            <Text block>{emailValue}</Text>
                        </StyledEmailContainer>
                        <Form.Item label="Full Name" htmlFor="name">
                            <InputWrapper>{nameInput}</InputWrapper>
                            {nameInvalid && (
                                <Text size="small" state={ColorStatus.error}>
                                    Name invalid
                                </Text>
                            )}
                        </Form.Item>
                        <Form.Item label="Role" htmlFor="role">
                            <InputWrapper>
                                <Select value={role} placeholder="Select your Role" onChange={handleRoleChange}>
                                    <Select.Option value="1">Attorney</Select.Option>
                                    <Select.Option value="2">Observer</Select.Option>
                                    <Select.Option value="3">Paralegal</Select.Option>
                                    <Select.Option value="4">Witness</Select.Option>
                                </Select>
                            </InputWrapper>
                        </Form.Item>
                    </div>
                )}

                <Wizard.Actions>
                    {step !== 0 && (
                        <div>
                            <Button type="link" onClick={handlePrev}>
                                PREVIOUS
                            </Button>
                        </div>
                    )}
                    <div>
                        <Button onClick={handleSubmit} disabled={submitInvalid} type="primary" block htmlType="submit">
                            {submitText}
                        </Button>
                    </div>
                </Wizard.Actions>
            </Form>
        </Wizard>
    );
};

export const PRWizard = Template.bind({});
PRWizard.args = {
    title: "Join Deposition",
    text: "Please complete the information below to join the deposition",
};
