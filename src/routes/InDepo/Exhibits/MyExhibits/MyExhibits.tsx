import { useContext, useEffect, useState } from "react";
import { Row, Col } from "antd";
import Badge from "prp-components-library/src/components/Badge";
import Icon from "prp-components-library/src/components/Icon";
import Result from "prp-components-library/src/components/Result";
import { CustomStatus } from "prp-components-library/src/components/Result/Result";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import { useParams } from "react-router-dom";
import { useFileList, useUploadFileToS3 } from "../../../../hooks/exhibits/hooks";
import { MY_EXHIBITS_RESULT_SUBTITLE, MY_EXHIBITS_RESULT_TITLE, EXHIBIT_TABS } from "../../../../constants/exhibits";
import { ReactComponent as MyExhibitsIcon } from "../../../../assets/icons/MyExhibits-empty.svg";
import { ExhibitTabPaneSpacer, ScrollTableContainer } from "../styles";
import useSignalR from "../../../../hooks/useSignalR";
import UploadButton from "./UploadButton";
import FileListTable from "./FileListTable";
import ExhibitViewer from "../ExhibitViewer";
import { theme } from "../../../../constants/styles/theme";
import { ExhibitFile } from "../../../../types/ExhibitFile";
import ColorStatus from "../../../../types/ColorStatus";
import { Notification, NotificationEntityType, NotificationAction } from "../../../../types/Notification";
import { GlobalStateContext } from "../../../../state/GlobalState";
import { getREM } from "../../../../constants/styles/utils";

export default function MyExhibits({ activeKey }: { activeKey: string }) {
    const { depositionID } = useParams<{ depositionID: string }>();
    const { upload } = useUploadFileToS3(depositionID);
    const { handleFetchFiles, loading, errorFetchFiles, files, refreshList } = useFileList(depositionID);
    const [selectedFile, setSelectedFile] = useState<ExhibitFile>(null);
    const [exhibitUploadComplete, setExhibitUploadComplete] = useState(false);
    const [exhibitUploadError, setExhibitUploadError] = useState(false);
    const { state } = useContext(GlobalStateContext);
    const { currentExhibitTabName } = state.room;
    const { subscribeToGroup, unsubscribeMethodFromGroup, signalR } = useSignalR("/depositionHub");

    useEffect(() => {
        if (currentExhibitTabName === EXHIBIT_TABS.myExhibits) {
            handleFetchFiles();
        }
    }, [handleFetchFiles, currentExhibitTabName]);

    useEffect(() => {
        let onExhibitUploadComplete;
        if (signalR && subscribeToGroup && unsubscribeMethodFromGroup) {
            onExhibitUploadComplete = (message: Notification) => {
                if (
                    message?.entityType === NotificationEntityType.exhibit &&
                    message?.action === NotificationAction.create
                ) {
                    setExhibitUploadComplete(true);
                    refreshList();
                }
                if (
                    message?.entityType === NotificationEntityType.exhibit &&
                    message?.action === NotificationAction.error
                ) {
                    setExhibitUploadError(true);
                }
            };
            subscribeToGroup("ReceiveNotification", onExhibitUploadComplete);
        }
        return () => {
            if (onExhibitUploadComplete) {
                unsubscribeMethodFromGroup("ReceiveNotification", onExhibitUploadComplete);
            }
        };
    }, [signalR, subscribeToGroup, unsubscribeMethodFromGroup, refreshList]);

    const handleUpload = (options) => {
        setExhibitUploadComplete(false);
        setExhibitUploadError(false);
        upload(options);
    };

    return (
        <ExhibitTabPaneSpacer direction="vertical" size="large">
            {!selectedFile && (
                <>
                    <Space size="middle" align="center">
                        <Text size="large" state={ColorStatus.white}>
                            My Exhibits
                        </Text>
                        <Badge style={{ lineHeight: getREM(1.72) }} count={files?.length || 0} />
                    </Space>
                    <ScrollTableContainer direction="vertical" size="large">
                        <UploadButton
                            onUpload={handleUpload}
                            fileUploadComplete={exhibitUploadComplete}
                            fileUploadError={exhibitUploadError}
                            refreshList={refreshList}
                        />
                        {files?.length > 0 && (
                            <FileListTable
                                data-testid="file_list_table"
                                loading={loading}
                                dataSource={files}
                                pagination={false}
                                sortDirections={["descend", "ascend"]}
                                onClickViewFile={setSelectedFile}
                                onChange={handleFetchFiles}
                                onOptionsConfirmOk={handleFetchFiles}
                            />
                        )}
                        {(files?.length === 0 || errorFetchFiles) && (
                            <Row justify="center" align="middle" style={{ height: "100%" }}>
                                <Col sm={18} lg={14} xl={13} xxl={9}>
                                    <Result
                                        icon={<Icon icon={MyExhibitsIcon} size="6rem" />}
                                        title={MY_EXHIBITS_RESULT_TITLE}
                                        subTitle={MY_EXHIBITS_RESULT_SUBTITLE}
                                        status={CustomStatus.empty}
                                        titleColor={theme.default.primaryColor}
                                        subTitleColor={theme.default.whiteColor}
                                    />
                                </Col>
                            </Row>
                        )}
                    </ScrollTableContainer>
                </>
            )}
            {selectedFile && (
                <ExhibitViewer
                    activeKey={activeKey}
                    file={selectedFile}
                    onClose={() => setSelectedFile(null)}
                    showShareButtonOnHeader
                    isActive={currentExhibitTabName === EXHIBIT_TABS.myExhibits}
                />
            )}
        </ExhibitTabPaneSpacer>
    );
}
