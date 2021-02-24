import React from "react";
import Space from "../../../components/Space";
import Tabs from "../../../components/Tabs";
import * as CONSTANTS from "../../../constants/activeDepositionDetails";
import { DepositionModel } from "../../../models";

export default function ActiveDepositionDetailsTabs({ deposition }: { deposition: DepositionModel.IDeposition }) {
    return (
        <Space mt={9} direction="vertical">
            <Space fullWidth>
                <Tabs
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
                                    <DepositionDetailsComponent deposition={deposition} />
                                </Space>
                            </Tabs.TabPane>
                        )
                    )}
                </Tabs>
            </Space>
        </Space>
    );
}
