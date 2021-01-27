import React from "react";
import styled from "styled-components";
import { Space } from "antd";

import Modal from "../Modal";
import Title from "../Typography/Title";
import Text from "../Typography/Text";
import ColorStatus from "../../types/ColorStatus";

export interface IWizard {
    children: React.ReactNode;
    step?: number;
    totalSteps: number;
    title?: string;
    text?: string;
}

interface IWizardStepProps {
    stepNumber: number;
    children: React.ReactNode;
}
interface IWizardActionsProps {
    children: React.ReactNode;
}

const StyledCustomSpacer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    > :last-child {
        margin-left: auto;
    }
`;

const WizardActions = ({ children }: IWizardActionsProps) => {
    return <StyledCustomSpacer>{children}</StyledCustomSpacer>;
};

const Wizard = ({ children, step = 0, totalSteps, title, text }: IWizard) => {
    const stepText = `STEP ${step} OF ${totalSteps}`;

    return (
        <Modal onlyBody destroyOnClose closable={false} visible centered mask={false}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div>
                    <Text state={ColorStatus.primary} weight="bold">
                        {stepText}
                    </Text>
                    <Title level={4} weight="light">
                        {title}
                    </Title>
                    <Text state={ColorStatus.disabled}>{text}</Text>
                </div>
                <div>{children}</div>
            </Space>
        </Modal>
    );
};

Wizard.Actions = WizardActions;
export default Wizard;
