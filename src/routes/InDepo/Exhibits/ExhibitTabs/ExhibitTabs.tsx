import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import React from "react";
import { Space } from "antd";
import Icon from "../../../../components/Icon";
import Text from "../../../../components/Typography/Text";
import ColorStatus from "../../../../types/ColorStatus";
import { ExhibitTabContainer, ExhibitTabContainerText, ExhibitTabsContainer, Stick } from "./styles";
import { theme } from "../../../../constants/styles/theme";
import { getREM } from "../../../../constants/styles/utils";
import { EXHIBIT_TAB } from "../../../../constants/exhibits";

export interface ExhibitTabData {
    tabId: string;
    tabTestId: string;
    title: string;
    subTitle: string;
    icon?: React.ComponentType<CustomIconComponentProps | React.SVGProps<SVGSVGElement>>;
    ExhibitComponent: React.FC<any>;
    tabPaneTestId: string;
}

interface ExhibitTabsProps {
    activeKey: string;
    highlightKey?: number | null;
    panes: { props: { tab: EXHIBIT_TAB } }[];
    tabsTitles: ExhibitTabData[];
    onTabClick: (tab: EXHIBIT_TAB) => void;
}

export default function ExhibitTabs({
    activeKey,
    panes,
    onTabClick,
    tabsTitles,
    highlightKey = null,
}: ExhibitTabsProps) {
    return (
        <ExhibitTabsContainer data-testid="exhibits_tabs">
            {panes.map(({ props }, index) => {
                const active = activeKey === props.tab;
                const highlight = highlightKey === index;
                const previousTabIsNotSelected = activeKey !== (panes[index - 1] && panes[index - 1].props.tab);
                const isNotFirstTab = index !== 0;
                const tab = tabsTitles.find(({ tabId }) => tabId === props.tab);
                if (!tab) return undefined;
                const { tabTestId, title, subTitle, icon } = tab;
                let subtitleState: ColorStatus = ColorStatus.disabled;
                if (active) subtitleState = ColorStatus.white;
                else if (highlight) subtitleState = ColorStatus.primary;

                return (
                    <ExhibitTabContainer
                        data-testid={tabTestId}
                        key={props.tab}
                        onClick={() => onTabClick(props.tab)}
                        active={active}
                        highlight={highlight}
                    >
                        {!active && previousTabIsNotSelected && isNotFirstTab && <Stick />}
                        <ExhibitTabContainerText data-testid={active && `${tabTestId}_active`}>
                            <Text
                                uppercase
                                state={highlight && !active ? ColorStatus.primary : ColorStatus.white}
                                size="small"
                            >
                                <Space size="small">
                                    {icon && (
                                        <Icon icon={icon} style={{ fontSize: getREM(theme.default.fontSizes[4]) }} />
                                    )}
                                    {` ${title}`}
                                </Space>
                            </Text>
                            <Text state={subtitleState} size="small">
                                {subTitle}
                            </Text>
                        </ExhibitTabContainerText>
                    </ExhibitTabContainer>
                );
            })}
        </ExhibitTabsContainer>
    );
}
