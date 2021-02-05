import React from "react";
import styled from "styled-components";
import { Tabs as AntTabs } from "antd";
import { TabPaneProps, TabsProps } from "antd/lib/tabs";
import { theme } from "../../constants/styles/theme";

const AntTabPane = AntTabs.TabPane;

const StyledTabPane = styled(AntTabPane)<TabPaneProps>``;

const StyledTabs = styled(AntTabs)<TabsProps>`
    .ant-tabs-nav {
        &:before {
            border-bottom: 1px solid ${theme.colors.neutrals[3]};
        }
        .ant-tabs-ink-bar {
            height: 4px;
        }
    }
`;

const Tabs = ({ ...rest }: TabsProps) => {
    return <StyledTabs {...rest} />;
};

export const TabPane = ({ ...rest }: TabPaneProps) => {
    return <StyledTabPane {...rest} />;
};

Tabs.TabPane = TabPane;

export default Tabs;
