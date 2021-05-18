import React, { SetStateAction } from "react";
import Space from "../../../components/Space";
import Tabs from "../../../components/Tabs";
import * as CONSTANTS from "../../../constants/activeDepositionDetails";
import { DepositionModel } from "../../../models";

const ActiveDepositionDetailsTabs = ({
    deposition,
    setActiveKey,
    activeKey,
    setUpdatedDeposition,
}: {
    activeKey: string;
    deposition: DepositionModel.IDeposition;
    setActiveKey: React.Dispatch<SetStateAction<string>>;
    setUpdatedDeposition: React.Dispatch<SetStateAction<DepositionModel.IDeposition>>;
}) => {
    return (
        <Space mt={9} direction="vertical">
            <Space fullWidth>
                <Tabs
                    destroyInactiveTabPane
                    onChange={setActiveKey}
                    style={{ width: "100%" }}
                    renderTabBar={(props: { activeKey: string }, DefaultTabBar) => (
                        <DefaultTabBar {...props}>
                            {(node) => {
                                const testId = CONSTANTS.DEPOSITION_DETAILS_TABS_DATA.find(
                                    (tab) => tab.tabId === node.key
                                ).tabTestId;
                                const active = node.key === props.activeKey;
                                return <div data-testid={`${testId}${active ? "_active" : ""}`}>{node}</div>;
                            }}
                        </DefaultTabBar>
                    )}
                    defaultActiveKey={CONSTANTS.DEFAULT_ACTIVE_TAB}
                >
                    {CONSTANTS.DEPOSITION_DETAILS_TABS_DATA.map(
                        ({ tabId, DepositionDetailsComponent, tabPaneTestId, title }) => (
                            <Tabs.TabPane tab={title} key={tabId}>
                                <Space data-testid={tabPaneTestId} size={4} direction="vertical">
                                    <DepositionDetailsComponent
                                        activeKey={activeKey}
                                        deposition={deposition}
                                        setUpdatedDeposition={setUpdatedDeposition}
                                    />
                                </Space>
                            </Tabs.TabPane>
                        )
                    )}
                </Tabs>
            </Space>
        </Space>
    );
};
export default React.memo(ActiveDepositionDetailsTabs);
