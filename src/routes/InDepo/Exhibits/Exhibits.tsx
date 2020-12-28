import React from "react";
import ExhibitTabs from "./ExhibitTabs";
import { TabPane, Tabs, ExhibitTabPaneContainer } from "./ExhibitTabs/styles";
import { StyledLayoutCotainer, StyledLayoutContent, ContainerProps } from "../styles";
import * as CONSTANTS from "../../../constants/exhibits";

const Exhibits = ({ visible }: ContainerProps) => {
    return (
        <StyledLayoutCotainer visible={visible}>
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
