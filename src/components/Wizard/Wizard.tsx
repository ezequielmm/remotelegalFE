import React from "react";
import styled from "styled-components";

import Space from "../Space";
import Modal from "../Modal";
import Title from "../Typography/Title";
import Text from "../Typography/Text";
import ColorStatus from "../../types/ColorStatus";

export interface IWizard {
    children: React.ReactNode;
    step?: number | null;
    totalSteps?: number | null;
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
    const stepText = step && totalSteps && `STEP ${step} OF ${totalSteps}`;

    return (
        <Modal onlyBody destroyOnClose closable={false} visible centered mask={false}>
            <Space direction="vertical" size="large" fullWidth>
                <Space.Item fullWidth>
                    <Text state={ColorStatus.primary} weight="bold">
                        {stepText}
                    </Text>
                    <Title level={4} weight="light">
                        {title}
                    </Title>
                    <Text state={ColorStatus.disabled}>{text}</Text>
                </Space.Item>
                <Space.Item fullWidth>{children}</Space.Item>
            </Space>
        </Modal>
    );
};

Wizard.Actions = WizardActions;
export default Wizard;
