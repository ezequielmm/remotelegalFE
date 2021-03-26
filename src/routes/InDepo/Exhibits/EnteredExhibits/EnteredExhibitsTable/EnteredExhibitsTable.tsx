import React, { useContext, useState } from "react";
import { Tooltip } from "antd";
import Column from "antd/lib/table/Column";
import { theme as GlobalTheme } from "../../../../../constants/styles/theme";
import { getREM } from "../../../../../constants/styles/utils";
import Button from "../../../../../components/Button";
import Table from "../../../../../components/Table";
import Text from "../../../../../components/Typography/Text";
import FileIcon from "../../../../../components/FileIcon";
import { ExhibitFile } from "../../../../../types/ExhibitFile";
import { StyledFileNameCell } from "./styles";
import ColorStatus from "../../../../../types/ColorStatus";
import { GlobalStateContext } from "../../../../../state/GlobalState";
import moment from "moment-timezone";
import { mapTimeZone } from "../../../../../models/general";
import ExhibitSharingModal from "../../ExhibitViewer/ExhibitSharingModal";
import { useShareExhibitFile } from "../../../../../hooks/exhibits/hooks";
import { ITableProps } from "../../../../../components/Table/Table";

interface IEnteredExhibitsTable extends ITableProps {
    onClickViewFile: (item: any) => void;
}
const EnteredExhibitsTable = ({ onClickViewFile, ...props }: IEnteredExhibitsTable) => {
    const { state } = useContext(GlobalStateContext);
    const { timeZone } = state.room;
    const { isRecording } = state.room;
    const [exhibitSharingModalOpen, setExhibitSharingModalOpen] = useState(false);
    const [selectedSharedExhibitFile, setSelectedSharedExhibitFile] = useState<ExhibitFile>(null);
    const { shareExhibit, shareExhibitPending, sharedExhibit, sharingExhibitFileError } = useShareExhibitFile();

    const onShareOkHandler = async () => {
        const isShared = await shareExhibit(selectedSharedExhibitFile, true);
        if (Boolean(isShared)) {
            setExhibitSharingModalOpen(false);
            setSelectedSharedExhibitFile(null);
        }
    };

    return (
        <>
            <ExhibitSharingModal
                destroyOnClose
                loading={shareExhibitPending}
                file={sharedExhibit || sharingExhibitFileError}
                visible={exhibitSharingModalOpen}
                onShareOk={onShareOkHandler}
                onShareCancel={() => setExhibitSharingModalOpen(false)}
            />
            <Table {...props}>
                <Column
                    title="FILE"
                    dataIndex="displayName"
                    key="displayName"
                    width="100%"
                    ellipsis
                    sorter={(a: ExhibitFile, b: ExhibitFile) => a.displayName.localeCompare(b.displayName)}
                    render={(displayName) => {
                        const fileExtension = displayName.split(".").pop();
                        return (
                            <StyledFileNameCell>
                                <FileIcon type={fileExtension} />
                                <Tooltip title={displayName}>
                                    <Text state={ColorStatus.white} dataTestId="entered_exhibit_display_name">
                                        {displayName}
                                    </Text>
                                </Tooltip>
                            </StyledFileNameCell>
                        );
                    }}
                />
                <Column
                    title="OWNER"
                    dataIndex="addedBy"
                    key="addedBy"
                    sorter={({ addedBy: a }, { addedBy: b }) => a.firstName.localeCompare(b.firstName)}
                    width={getREM(GlobalTheme.default.spaces[6] * 8)}
                    render={(addedBy) => `${addedBy?.firstName} ${addedBy?.lastName}`}
                />
                <Column
                    title="SHARED AT"
                    dataIndex="sharedAt"
                    key="sharedAt"
                    sorter={({ sharedAt: a }, { sharedAt: b }) =>
                        moment(a).isBefore(b) ? -1 : moment(a).isAfter(b) ? 1 : 0
                    }
                    defaultSortOrder="descend"
                    width={getREM(GlobalTheme.default.spaces[8] * 6)}
                    render={(sharedAt) => moment(sharedAt).tz(mapTimeZone[timeZone]).format("hh:mm A")}
                />
                <Column
                    title=""
                    dataIndex="view"
                    key="view"
                    width={getREM(GlobalTheme.default.spaces[8] * 4)}
                    render={(item, file: any) => (
                        <Button
                            type="text"
                            size="small"
                            data-testid="file_list_view_button"
                            onClick={() => onClickViewFile(file)}
                        >
                            View
                        </Button>
                    )}
                />
                <Column
                    dataIndex="share"
                    key="share"
                    width={getREM(GlobalTheme.default.spaces[8] * 4)}
                    render={(item, file: ExhibitFile) => {
                        return (
                            <Button
                                disabled={!isRecording}
                                size="small"
                                type="ghost"
                                data-testid="file_list_share_button"
                                onClick={() => {
                                    setSelectedSharedExhibitFile(file);
                                    setExhibitSharingModalOpen(true);
                                }}
                            >
                                Share
                            </Button>
                        );
                    }}
                />
                <Column
                    title=""
                    dataIndex="options"
                    key="options"
                    className="file-list-options-button"
                    width={getREM(GlobalTheme.default.spaces[6] * 3)}
                />
            </Table>
        </>
    );
};
export default EnteredExhibitsTable;
