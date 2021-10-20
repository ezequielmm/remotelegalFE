import React from "react";
import styled from "styled-components";
import Modal from "@rl/prp-components-library/src/components/Modal";
import Space from "@rl/prp-components-library/src/components/Space";
import Text from "@rl/prp-components-library/src/components/Text";
import Title from "@rl/prp-components-library/src/components/Title";
import ColorStatus from "../../types/ColorStatus";

export interface IWizard {
    children: React.ReactNode;
    step?: number | null;
    totalSteps?: number | null;
    title?: string;
    text?: string;
    alertComponent?: React.ReactNode;
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

const Wizard = ({ children, step = 0, totalSteps, title, text, alertComponent }: IWizard) => {
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
                    <Text state={ColorStatus.disabled} ellipsis={false}>
                        {text}
                    </Text>
                </Space.Item>
                {alertComponent}
                <Space.Item fullWidth>{children}</Space.Item>
            </Space>
        </Modal>
    );
};

Wizard.Actions = WizardActions;
export default Wizard;
