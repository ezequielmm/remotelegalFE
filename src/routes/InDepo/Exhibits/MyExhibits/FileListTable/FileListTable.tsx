import React, { useContext, useState } from "react";
import { Tooltip } from "antd";
import { TableProps } from "antd/lib/table";
import { DefaultRecordType } from "rc-table/lib/interface";
import Column from "antd/lib/table/Column";
import { theme as GlobalTheme } from "../../../../../constants/styles/theme";
import { getREM } from "../../../../../constants/styles/utils";
import Button from "../../../../../components/Button";
import Table from "../../../../../components/Table";
import Text from "../../../../../components/Typography/Text";
import Dropdown from "../../../../../components/Dropdown";
import Menu from "../../../../../components/Menu";
import Space from "../../../../../components/Space";
import Icon from "../../../../../components/Icon";
import FileIcon from "../../FileIcon";
import { ReactComponent as kebebIcon } from "../../../../../assets/icons/kebeb.svg";
import { ReactComponent as DeleteIcon } from "../../../../../assets/icons/delete.svg";
import { ReactComponent as RenameIcon } from "../../../../../assets/icons/edit.svg";
import { formatBytes } from "../../../../../helpers/formatBytes";
import FileListActionModal from "./FileListActionModal";
import { ModalMode } from "./FileListActionModal/FileListActionModal";
import { ExhibitFile } from "../../../../../types/ExhibitFile";
import { StyledFileNameCell } from "./styles";
import ExhibitSharingModal from "../../ExhibitViewer/ExhibitSharingModal";
import ColorStatus from "../../../../../types/ColorStatus";
import { GlobalStateContext } from "../../../../../state/GlobalState";

interface IFileListTable extends TableProps<DefaultRecordType> {
    onClickViewFile: (item: any) => void;
}

const FileListTable = (props: IFileListTable) => {
    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
    const [currentModalMode, setCurrentModalMode] = useState<ModalMode>(null);
    const [exhibitSharingModalOpen, setExhibitSharingModalOpen] = useState(false);
    const [selectedSharedExhibitFile, setSelectedSharedExhibitFile] = useState<ExhibitFile>(null);
    const { state } = useContext(GlobalStateContext);
    const { isRecording } = state.room;

    const toggleModal = (mode: ModalMode) => {
        setConfirmModalIsOpen(true);
        setCurrentModalMode(mode);
    };

    const menu = (
        <Menu>
            <Menu.Item key="0">
                <Button type="link" onClick={() => toggleModal("rename")}>
                    <Space size="middle" align="center">
                        <Icon icon={RenameIcon} size={8} style={{ color: "white" }} />
                        <Text state={ColorStatus.white} size="small">
                            Rename
                        </Text>
                    </Space>
                </Button>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1">
                <Button type="link" onClick={() => toggleModal("delete")}>
                    <Space size="middle" align="center">
                        <Icon icon={DeleteIcon} size={8} style={{ color: "white" }} />
                        <Text state={ColorStatus.white} size="small">
                            Delete
                        </Text>
                    </Space>
                </Button>
            </Menu.Item>
        </Menu>
    );
    const handleCloseClick = () => {
        setConfirmModalIsOpen(false);
    };

    const onRenameOkHandler = () => {
        setConfirmModalIsOpen(false);
    };
    const onDeleteOkHandler = () => {};
    const onRenameCancelHandler = () => {};
    const onDeleteCancelHandler = () => {};

    const onShareOkHandler = () => {
        setExhibitSharingModalOpen(false);
    };
    return (
        <>
            <ExhibitSharingModal
                destroyOnClose
                file={selectedSharedExhibitFile}
                visible={exhibitSharingModalOpen}
                onShareOk={onShareOkHandler}
                onShareCancel={() => setExhibitSharingModalOpen(false)}
            />
            <FileListActionModal
                mode={currentModalMode}
                visible={confirmModalIsOpen}
                onRenameOk={onRenameOkHandler}
                onDeleteOk={onDeleteOkHandler}
                onRenameCancel={onRenameCancelHandler}
                onDeleteCancel={onDeleteCancelHandler}
                onCancel={handleCloseClick}
            />
            <Table {...props}>
                <Column
                    title="FILE"
                    dataIndex="displayName"
                    key="displayName"
                    width="100%"
                    ellipsis
                    sorter={(a: ExhibitFile, b: ExhibitFile) => a.displayName.localeCompare(b.displayName)}
                    sortDirections={["descend", "ascend"]}
                    defaultSortOrder="ascend"
                    render={(displayName) => {
                        const fileExtension = displayName.split(".").pop();
                        return (
                            <StyledFileNameCell>
                                <FileIcon type={fileExtension} />
                                <Tooltip title={displayName}>
                                    <Text state={ColorStatus.white}>{displayName}</Text>
                                </Tooltip>
                            </StyledFileNameCell>
                        );
                    }}
                />
                <Column
                    title="SIZE"
                    dataIndex="size"
                    key="size"
                    width={getREM(GlobalTheme.default.spaces[6] * 6)}
                    render={(size) => formatBytes(size, 0)}
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
                            onClick={() => props.onClickViewFile(file)}
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
                    render={() => (
                        <Dropdown disabled overlay={menu} trigger={["click"]} styled arrow placement="bottomRight">
                            <Icon icon={kebebIcon} size={9} />
                        </Dropdown>
                    )}
                />
            </Table>
        </>
    );
};
export default FileListTable;
