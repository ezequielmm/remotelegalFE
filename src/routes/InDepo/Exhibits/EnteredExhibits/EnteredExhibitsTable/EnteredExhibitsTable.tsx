import React, { useContext, useState } from "react";
import { Tooltip } from "antd";
import FileIcon from "@rl/prp-components-library/src/components/FileIcon";
import Column from "antd/lib/table/Column";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Button from "@rl/prp-components-library/src/components/Button";
import Table from "@rl/prp-components-library/src/components/Table";
import Text from "@rl/prp-components-library/src/components/Text";
import { ITableProps } from "@rl/prp-components-library/src/components/Table/Table";
import { theme as GlobalTheme } from "../../../../../constants/styles/theme";
import { getREM } from "../../../../../constants/styles/utils";
import { ExhibitFile } from "../../../../../types/ExhibitFile";
import { StyledFileNameCell } from "./styles";
import ColorStatus from "../../../../../types/ColorStatus";
import { GlobalStateContext } from "../../../../../state/GlobalState";
import { mapTimeZone } from "../../../../../models/general";
import ExhibitSharingModal from "../../ExhibitViewer/ExhibitSharingModal";
import { useShareExhibitFile } from "../../../../../hooks/exhibits/hooks";

dayjs.extend(utc);
dayjs.extend(timezone);
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
                    ellipsis
                    render={(addedBy) => (
                        <Text state={ColorStatus.white}>{`${addedBy?.firstName} ${addedBy?.lastName}`}</Text>
                    )}
                />
                <Column
                    title="SHARED AT"
                    dataIndex="sharedAt"
                    key="sharedAt"
                    sorter={({ sharedAt: a }, { sharedAt: b }) =>
                        dayjs(a).isBefore(b) ? -1 : dayjs(a).isAfter(b) ? 1 : 0
                    }
                    defaultSortOrder="descend"
                    width={getREM(GlobalTheme.default.spaces[8] * 6)}
                    ellipsis
                    render={(sharedAt) => (
                        <Text state={ColorStatus.white}>
                            {dayjs(sharedAt).tz(mapTimeZone[timeZone]).format("hh:mm A")}
                        </Text>
                    )}
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
