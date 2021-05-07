import React, { useContext } from "react";
import ExhibitTabs from "./ExhibitTabs";
import { TabPane, Tabs, ExhibitTabPaneContainer } from "./ExhibitTabs/styles";
import { StyledLayoutCotainer, StyledLayoutContent, ContainerProps } from "../styles";
import * as CONSTANTS from "../../../constants/exhibits";
import { useExhibitTabs } from "../../../hooks/exhibits/hooks";
import actions from "../../../state/InDepo/InDepoActions";
import { GlobalStateContext } from "../../../state/GlobalState";

const Exhibits = ({ visible }: ContainerProps) => {
    const { highlightKey, activeKey, setActiveKey } = useExhibitTabs();
    const { dispatch } = useContext(GlobalStateContext);

    return (
        <StyledLayoutCotainer visible={visible}>
            <StyledLayoutContent>
                <Tabs
                    activeKey={activeKey}
                    renderTabBar={({ panes, onTabClick }) => {
                        return (
                            <ExhibitTabs
                                onTabClick={(tab) => {
                                    dispatch(actions.setActiveTab(tab));
                                    setActiveKey(tab);
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
