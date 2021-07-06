import { useContext, useState } from "react";
import { Tooltip } from "antd";
import Column from "antd/lib/table/Column";
import Button from "prp-components-library/src/components/Button";
import Dropdown from "prp-components-library/src/components/Dropdown";
import FileIcon from "prp-components-library/src/components/FileIcon";
import Icon from "prp-components-library/src/components/Icon";
import Menu from "prp-components-library/src/components/Menu";
import Space from "prp-components-library/src/components/Space";
import Table from "prp-components-library/src/components/Table";
import Text from "prp-components-library/src/components/Text";
import { ITableProps } from "prp-components-library/src/components/Table/Table";
import { theme as GlobalTheme } from "../../../../../constants/styles/theme";
import { getREM } from "../../../../../constants/styles/utils";
import { ReactComponent as kebebIcon } from "../../../../../assets/icons/kebeb.svg";
import { ReactComponent as DeleteIcon } from "../../../../../assets/icons/delete.svg";
import { formatBytes } from "../../../../../helpers/formatBytes";
import FileListActionModal from "./FileListActionModal";
import { ModalMode } from "./FileListActionModal/FileListActionModal";
import { ExhibitFile } from "../../../../../types/ExhibitFile";
import { StyledFileNameCell } from "./styles";
import ExhibitSharingModal from "../../ExhibitViewer/ExhibitSharingModal";
import ColorStatus from "../../../../../types/ColorStatus";
import { GlobalStateContext } from "../../../../../state/GlobalState";
import { useShareExhibitFile } from "../../../../../hooks/exhibits/hooks";

interface IFileListTable extends ITableProps {
    onClickViewFile: (item: any) => void;
    onOptionsConfirmOk?: () => void;
}

const FileListTable = ({ onClickViewFile, onOptionsConfirmOk, ...props }: IFileListTable) => {
    const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
    const [currentModalMode, setCurrentModalMode] = useState<ModalMode>(null);
    const [exhibitSharingModalOpen, setExhibitSharingModalOpen] = useState(false);
    const [selectedExhibitForOptions, setSelectedExhibitForOptions] = useState<ExhibitFile>(null);
    const [selectedSharedExhibitFile, setSelectedSharedExhibitFile] = useState<ExhibitFile>(null);
    const { shareExhibit, shareExhibitPending, sharedExhibit, sharingExhibitFileError } = useShareExhibitFile();
    const { state } = useContext(GlobalStateContext);
    const { isRecording, currentExhibit } = state.room;

    const toggleModal = (mode: ModalMode) => {
        setConfirmModalIsOpen(true);
        setCurrentModalMode(mode);
    };

    const menu = (exhibit) => (
        <Menu data-testid="menu_options">
            <Menu.Item key="0">
                <Button
                    data-testid="option_delete_button"
                    type="link"
                    disabled={currentExhibit?.id && currentExhibit?.id === exhibit?.id}
                    onClick={() => {
                        setSelectedExhibitForOptions(exhibit);
                        toggleModal("delete");
                    }}
                >
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
    const onDeleteOkHandler = () => {
        setConfirmModalIsOpen(false);
        onOptionsConfirmOk();
    };
    const onRenameCancelHandler = () => {};
    const onDeleteCancelHandler = () => {
        setConfirmModalIsOpen(false);
    };

    const onShareOkHandler = async () => {
        const isShared = await shareExhibit(selectedSharedExhibitFile);
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
            <FileListActionModal
                mode={currentModalMode}
                file={selectedExhibitForOptions}
                visible={confirmModalIsOpen}
                onRenameOk={onRenameOkHandler}
                onDeleteOk={onDeleteOkHandler}
                onRenameCancel={onRenameCancelHandler}
                onDeleteCancel={onDeleteCancelHandler}
                onCancel={handleCloseClick}
                onError={() => setConfirmModalIsOpen(false)}
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
                    ellipsis
                    render={(size) => <Text state={ColorStatus.white}>{formatBytes(size, 0)}</Text>}
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
                    render={(item, file: ExhibitFile) => (
                        <Dropdown
                            overlay={menu(file)}
                            trigger={["click"]}
                            styled
                            arrow
                            placement="bottomRight"
                            dataTestId="dropdown_options"
                        >
                            <Icon icon={kebebIcon} size={9} />
                        </Dropdown>
                    )}
                />
            </Table>
        </>
    );
};
export default FileListTable;
