import { useContext, useEffect, useState } from "react";
import { Row, Col } from "antd";
import Badge from "@rl/prp-components-library/src/components/Badge";
import Icon from "@rl/prp-components-library/src/components/Icon";
import Result from "@rl/prp-components-library/src/components/Result";
import { CustomStatus } from "@rl/prp-components-library/src/components/Result/Result";
import Space from "@rl/prp-components-library/src/components/Space";
import Text from "@rl/prp-components-library/src/components/Text";
import { useParams } from "react-router-dom";
import { useFileList, useUploadFileToS3 } from "../../../../hooks/exhibits/hooks";
import { MY_EXHIBITS_RESULT_SUBTITLE, MY_EXHIBITS_RESULT_TITLE, EXHIBIT_TABS } from "../../../../constants/exhibits";
import { ReactComponent as MyExhibitsIcon } from "../../../../assets/icons/MyExhibits-empty.svg";
import { ExhibitTabPaneSpacer, ScrollTableContainer } from "../styles";
import UploadButton from "./UploadButton";
import FileListTable from "./FileListTable";
import ExhibitViewer from "../ExhibitViewer";
import { theme } from "../../../../constants/styles/theme";
import { ExhibitFile } from "../../../../types/ExhibitFile";
import ColorStatus from "../../../../types/ColorStatus";
import { GlobalStateContext } from "../../../../state/GlobalState";
import { getREM } from "../../../../constants/styles/utils";

export default function MyExhibits({ activeKey }: { activeKey: string }) {
    const { depositionID } = useParams<{ depositionID: string }>();
    const { upload } = useUploadFileToS3(depositionID);
    const { handleFetchFiles, loading, errorFetchFiles, refreshList } = useFileList(depositionID);
    const [myExhibits, setMyExhibits] = useState<ExhibitFile[]>([]);
    const [selectedFile, setSelectedFile] = useState<ExhibitFile>(null);
    const { state } = useContext(GlobalStateContext);
    const { currentExhibitTabName } = state.room;

    useEffect(() => {
        if (currentExhibitTabName === EXHIBIT_TABS.myExhibits) {
            handleFetchFiles();
        }
    }, [handleFetchFiles, currentExhibitTabName]);

    useEffect(() => {
        setMyExhibits(state.room.myExhibits.filter((e) => !e.isPending));
    }, [state.room.myExhibits]);

    return (
        <ExhibitTabPaneSpacer direction="vertical" size="large">
            {!selectedFile && (
                <>
                    <Space size="middle" align="center">
                        <Text size="large" state={ColorStatus.white}>
                            My Exhibits
                        </Text>
                        <Badge style={{ lineHeight: getREM(1.72) }} count={myExhibits?.length || 0} />
                    </Space>
                    <ScrollTableContainer direction="vertical" size="large">
                        <UploadButton onUpload={upload} refreshList={refreshList} />
                        {myExhibits?.length > 0 && (
                            <FileListTable
                                data-testid="file_list_table"
                                loading={loading}
                                dataSource={myExhibits}
                                pagination={false}
                                sortDirections={["descend", "ascend"]}
                                onClickViewFile={setSelectedFile}
                                onChange={handleFetchFiles}
                                onOptionsConfirmOk={handleFetchFiles}
                            />
                        )}
                        {(myExhibits?.length === 0 || errorFetchFiles) && (
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
