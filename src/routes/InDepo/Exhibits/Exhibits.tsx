import React from "react";
import ExhibitTabs from "./ExhibitTabs";
import { TabPane, Tabs, ExhibitTabPaneContainer } from "./ExhibitTabs/styles";
import { StyledLayoutCotainer, StyledLayoutContent, ContainerProps } from "../styles";
import * as CONSTANTS from "../../../constants/exhibits";
import { useExhibitTabs } from "../../../hooks/exhibits/hooks";

const Exhibits = ({ visible }: ContainerProps) => {
    const { highlightKey, activeKey, setActivetKey } = useExhibitTabs();
    return (
        <StyledLayoutCotainer visible={visible}>
            <StyledLayoutContent>
                <Tabs
                    activeKey={activeKey}
                    renderTabBar={({ currentActiveKey, panes, onTabClick }) => {
                        return (
                            <ExhibitTabs
                                onTabClick={(tab) => {
                                    setActivetKey(tab);
                                    onTabClick(tab);
                                }}
                                activeKey={activeKey}
                                panes={panes}
                                tabsTitles={CONSTANTS.EXHIBIT_TABS_DATA}
                                highlightKey={highlightKey}
                            />
                        );
                    }}
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
