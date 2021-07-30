import { useContext } from "react";
import ExhibitTabs from "./ExhibitTabs";
import { TabPane, Tabs, ExhibitTabPaneContainer } from "./ExhibitTabs/styles";
import { StyledLayoutCotainer, StyledLayoutContent } from "../styles";
import * as CONSTANTS from "../../../constants/exhibits";
import { useExhibitTabs } from "../../../hooks/exhibits/hooks";
import actions from "../../../state/InDepo/InDepoActions";
import { GlobalStateContext } from "../../../state/GlobalState";

const Exhibits = ({ visible }: { visible?: boolean }) => {
    const { highlightKey, activeKey, setActiveKey } = useExhibitTabs();
    const { dispatch } = useContext(GlobalStateContext);

    return (
        <StyledLayoutCotainer visible={visible}>
            <StyledLayoutContent>
                <div style={{ display: visible ? "block" : "none", height: "100%", overflow: "hidden" }}>
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
                                    <ExhibitComponent activeKey={activeKey} />
                                </ExhibitTabPaneContainer>
                            </TabPane>
                        ))}
                    </Tabs>
                </div>
            </StyledLayoutContent>
        </StyledLayoutCotainer>
    );
};

export default Exhibits;
