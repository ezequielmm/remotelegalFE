import React from "react";
import styled from "styled-components";
import { Tabs as AntTabs } from "antd";
import { TabPaneProps, TabsProps } from "antd/lib/tabs";
import { getREM, getPX } from "../../../../constants/styles/utils";

interface ExhibitTabContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    active: boolean;
    highlight: boolean;
    children: React.ReactNode;
}

const ExhibitTabContainerWithProps = ({ children, ...props }: ExhibitTabContainerProps) => (
    <div {...props}>{children}</div>
);

export const Tabs = styled(AntTabs)<TabsProps>`
    height: 100%;

    .ant-tabs-content-top {
        height: 100%;
    }
`;

export const ExhibitTabsContainer = styled.div`
    display: flex;
    background-color: ${({ theme }) => theme.colors.inDepoNeutrals[4]};
    border: ${({ theme }) => `1px solid ${theme.colors.disabled[9]}`};
    border-radius: ${({ theme }) => getPX(theme.default.borderRadiusBase, theme.default.baseUnit)};
    box-shadow: inset 0 1px 8px 0 rgba(0, 0, 0, 0.5);
`;

export const ExhibitTabContainer = styled(ExhibitTabContainerWithProps).attrs((props: ExhibitTabContainerProps) => ({
    active: props.active,
    highlight: props.highlight,
}))`
    display: flex;
    flex: 1 0 0;
    border-radius: ${({ theme }) => getPX(theme.default.borderRadiusBase, theme.default.baseUnit)};
    ${({ active, highlight, theme }) => {
        return (
            active &&
            `
                background-color: ${highlight ? theme.default.primaryColor : theme.colors.inDepoBlue[7]};
                border: 1px solid ${highlight ? theme.default.primaryColor : theme.colors.inDepoBlue[7]};
                margin: -1px;
            `
        );
    }}
`;

export const ExhibitTabContainerText = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${({ theme }) => `${getREM(theme.default.spaces[2])} ${getREM(theme.default.spaces[5])}`};
`;

export const Stick = styled.div`
    margin-top: auto;
    margin-bottom: auto;
    margin-left: -1px;
    height: ${({ theme }) => getREM(theme.default.spaces[5])};
    width: 1px;
    background: ${({ theme }) => theme.colors.disabled[7]};
`;

export const TabPane = styled(AntTabs.TabPane)<TabPaneProps>`
    height: 100%;
`;

export const ExhibitTabPaneContainer = styled.div`
    height: inherit;
    width: 100%;
    padding: ${({ theme }) => `${getREM(theme.default.spaces[5])} 0`};
`;
