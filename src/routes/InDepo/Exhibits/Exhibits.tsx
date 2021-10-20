import React, { useContext } from "react";
import Drawer from "@rl/prp-components-library/src/components/Drawer";
import Space from "@rl/prp-components-library/src/components/Space";
import ExhibitTabs from "./ExhibitTabs";
import { TabPane, Tabs, ExhibitTabPaneContainer } from "./ExhibitTabs/styles";
import { StyledLayoutCotainer, StyledLayoutContent, ContainerProps } from "../styles";
import * as CONSTANTS from "../../../constants/exhibits";
import { useExhibitTabs } from "../../../hooks/exhibits/hooks";
import actions from "../../../state/InDepo/InDepoActions";
import { GlobalStateContext } from "../../../state/GlobalState";
import { theme } from "../../../constants/styles/theme";
import LiveExhibits from "./LiveExhibits";
import { WindowSizeContext } from "../../../contexts/WindowSizeContext";

export interface exhibitsProps extends ContainerProps {
    togglerExhibits?: React.Dispatch<React.SetStateAction<boolean>> | ((value: React.SetStateAction<boolean>) => void);
    visible?: boolean;
}

const Exhibits = ({ visible, togglerExhibits }: exhibitsProps) => {
    const { highlightKey, activeKey, setActiveKey } = useExhibitTabs();
    const { dispatch } = useContext(GlobalStateContext);
    const [windowWidth] = useContext(WindowSizeContext);

    return (
        <>
            {windowWidth >= parseInt(theme.default.breakpoints.lg, 10) ? (
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
            ) : (
                <Drawer
                    zIndex={3000}
                    visible={visible}
                    onClose={() => togglerExhibits(false)}
                    placement="bottom"
                    height="100%"
                >
                    <Space direction="vertical" fullHeight align="center">
                        <LiveExhibits activeKey={activeKey} />
                    </Space>
                </Drawer>
            )}
        </>
    );
};

export default Exhibits;
