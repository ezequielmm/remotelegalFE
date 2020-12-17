import React from "react";
import ExhibitTabs from "./ExhibitTabs";
import Icon from "../../../components/Icon";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { TabPane, Tabs, ExhibitTabPaneContainer } from "./ExhibitTabs/styles";
import { StyledLayoutCotainer, StyledLayoutHeader, StyledLayoutContent, ContainerProps } from "../styles";
import { getREM } from "../../../constants/styles/utils";
import { theme } from "../../../constants/styles/theme";
import * as CONSTANTS from "../../../constants/exhibits";

const Exhibits = ({ visible, onClick }: ContainerProps) => {
    return (
        <StyledLayoutCotainer visible={visible}>
            <StyledLayoutHeader>
                <Icon
                    icon={CloseIcon}
                    onClick={onClick}
                    style={{ fontSize: getREM(theme.default.fontSizes[5]), color: theme.default.whiteColor }}
                />
            </StyledLayoutHeader>
            <StyledLayoutContent>
                <Tabs
                    renderTabBar={({ activeKey, panes, onTabClick }) => (
                        <ExhibitTabs
                            onTabClick={onTabClick}
                            activeKey={activeKey}
                            panes={panes}
                            tabsTitles={CONSTANTS.EXHIBIT_TABS_DATA}
                        />
                    )}
                    defaultActiveKey={CONSTANTS.DEFAULT_ACTIVE_TAB}
                    tabPosition="top"
                >
                    {CONSTANTS.EXHIBIT_TABS_DATA.map(({ tabId, ExhibitComponent, tabPaneTestId }) => (
                        <TabPane tab={tabId} key={tabId}>
                            <ExhibitTabPaneContainer data-testid={tabPaneTestId}>
                                <ExhibitComponent />
                            </ExhibitTabPaneContainer>
                        </TabPane>
                    ))}
                </Tabs>
            </StyledLayoutContent>
        </StyledLayoutCotainer>
    );
};

export default Exhibits;
