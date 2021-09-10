import { useContext } from "react";
import { Row, Col } from "antd";
import Icon from "prp-components-library/src/components/Icon";
import Result from "prp-components-library/src/components/Result";
import { CustomStatus } from "prp-components-library/src/components/Result/Result";
import { EXHIBIT_TABS, LIVE_EXHIBITS_SUBTITLE, LIVE_EXHIBITS_TITLE } from "../../../../constants/exhibits";
import { ReactComponent as LiveExhibitsIcon } from "../../../../assets/icons/LiveExhibits-empty.svg";
import { ExhibitTabPaneSpacer } from "../styles";
import { theme } from "../../../../constants/styles/theme";
import ExhibitViewer from "../ExhibitViewer";
import { useCloseSharedExhibit, useExhibitSendAnnotation } from "../../../../hooks/exhibits/hooks";
import { TOOLBAR_GROUP_ANNOTATE, TOOLBAR_GROUP_VIEW } from "../../../../constants/PDFTronViewer";
import { GlobalStateContext } from "../../../../state/GlobalState";

export default function LiveExhibits({ activeKey }: { activeKey: string }) {
    const { state } = useContext(GlobalStateContext);
    const { currentExhibit, currentExhibitTabName } = state.room;
    const { currentUser } = state.user;
    const { closeSharedExhibit, pendingCloseSharedExhibit } = useCloseSharedExhibit();
    const { sendAnnotation } = useExhibitSendAnnotation();

    return (
        <ExhibitTabPaneSpacer direction="vertical" size="large" className="live-exhibit">
            {currentExhibit && (
                <ExhibitViewer
                    activeKey={activeKey}
                    showShareButtonOnHeader={!currentExhibit}
                    showBackButtonOnHeader={false}
                    showCloseButtonOnHeader={currentExhibit?.close}
                    showBringAllToMeButton={currentExhibit && currentExhibit?.addedBy?.id === currentUser?.id}
                    file={currentExhibit}
                    onClose={closeSharedExhibit}
                    onClosePending={pendingCloseSharedExhibit}
                    onAnnotationChange={sendAnnotation}
                    pdfTronDisableElements={
                        currentExhibit?.isPublic ? [TOOLBAR_GROUP_ANNOTATE, TOOLBAR_GROUP_VIEW] : []
                    }
                    readOnly={currentExhibit?.isPublic}
                    shouldGetAnnotations
                    realTimeAnnotations
                    isActive={currentExhibitTabName === EXHIBIT_TABS.liveExhibits}
                    canDownload
                />
            )}
            {!currentExhibit && (
                <Row justify="center" align="middle" style={{ height: "100%" }}>
                    <Col sm={18} lg={14} xl={13} xxl={9}>
                        <Result
                            icon={<Icon icon={LiveExhibitsIcon} size="6rem" />}
                            title={LIVE_EXHIBITS_TITLE}
                            subTitle={LIVE_EXHIBITS_SUBTITLE}
                            status={CustomStatus.successCreate}
                            titleColor={theme.default.primaryColor}
                            subTitleColor={theme.default.whiteColor}
                        />
                    </Col>
                </Row>
            )}
        </ExhibitTabPaneSpacer>
    );
}
