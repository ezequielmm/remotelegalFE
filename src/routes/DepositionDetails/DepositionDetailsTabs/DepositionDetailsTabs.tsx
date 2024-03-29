import { useState } from "react";
import { useParams } from "react-router";
import Space from "@rl/prp-components-library/src/components/Space";
import Tabs from "@rl/prp-components-library/src/components/Tabs";
import * as CONSTANTS from "../../../constants/depositionDetails";
import { IDeposition } from "../../../models/deposition";
import { DepositionID } from "../../../state/types";

export default function DepositionDetailsTabs({ deposition }: { deposition: IDeposition }) {
    const [activeKey, setActiveKey] = useState<string>(CONSTANTS.DEFAULT_ACTIVE_TAB);
    const { depositionID } = useParams<DepositionID>();

    return (
        <Space mt={9} direction="vertical">
            <Space fullWidth>
                <Tabs
                    activeKey={activeKey}
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
                                <div data-testid={tabPaneTestId}>
                                    <DepositionDetailsComponent
                                        activeKey={activeKey}
                                        depositionID={depositionID}
                                        deposition={deposition}
                                        setActiveKey={setActiveKey}
                                    />
                                </div>
                            </Tabs.TabPane>
                        )
                    )}
                </Tabs>
            </Space>
        </Space>
    );
}
