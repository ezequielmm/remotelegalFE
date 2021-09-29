import React, { useRef, useState, useEffect, useCallback } from "react";
import Button from "prp-components-library/src/components/Button";
import Confirm from "prp-components-library/src/components/Confirm";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import { Status } from "prp-components-library/src/components/StatusPill/StatusPill";
import Table from "prp-components-library/src/components/Table";
import Title from "prp-components-library/src/components/Title";
import AddParticipantModal from "./AddParticipantModal";
import { DepositionModel } from "../../../models";
import * as CONSTANTS from "../../../constants/activeDepositionDetails";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/delete.svg";
import { ReactComponent as AddIcon } from "../../../assets/general/Add.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/edit.svg";
import { IParticipant, Roles } from "../../../models/participant";
import ColorStatus from "../../../types/ColorStatus";
import {
    useFetchParticipants,
    useRemoveParticipantFromExistingDepo,
} from "../../../hooks/activeDepositionDetails/hooks";
import CardFetchError from "../../../components/CardFetchError";
import { UserInfo } from "../../../models/user";
import EditParticipantModal from "./EditParticipantModal";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";

const ParticipantListTable = ({
    deposition,
    activeKey,
}: {
    deposition: DepositionModel.IDeposition;
    activeKey: string;
}) => {
    const [fetchParticipants, loading, error, participants] = useFetchParticipants();
    const [mappedParticipants, setMappedParticipants] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openAddParticipantModal, setOpenParticipantModal] = useState(false);
    const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);
    const toggleEditModal = useCallback(() => setOpenEditModal(false), []);
    const toggleAddParticipantModal = () => setOpenParticipantModal(!openAddParticipantModal);
    const isCourtReporterPresent = useRef(false);
    const sortingRef = useRef({
        sortDirection: null,
        sortField: "",
    });
    const selectedParticipant = useRef<UserInfo["participant"]>(null);
    const [removeParticipant, removeParticipantLoading, removeParticipantError, removedParticipant] =
        useRemoveParticipantFromExistingDepo();
    const addAlert = useFloatingAlertContext();

    useEffect(() => {
        if (removedParticipant) {
            setOpenDeleteModal(false);
            addAlert({
                message: CONSTANTS.DEPOSITION_DETAILS_REMOVE_PARTICIPANT_TOAST,
                type: "success",
                duration: 3,
            });
            fetchParticipants(deposition.id, sortingRef.current?.sortDirection ? sortingRef.current : {});
        }
    }, [removedParticipant, fetchParticipants, deposition.id, addAlert]);

    useEffect(() => {
        if (removeParticipantError) {
            addAlert({
                message: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [removeParticipantError, addAlert]);

    const columns = [
        ...CONSTANTS.DEPOSITION_DETAILS_INVITED_PARTIES_COLUMNS,
        {
            render: (record: UserInfo["participant"]) => {
                const depo = deposition;
                if (depo.status !== Status.canceled) {
                    return (
                        <Space justify="flex-end" fullWidth>
                            <Icon
                                data-testid={`${record.name}_edit_icon`}
                                icon={EditIcon}
                                onClick={() => {
                                    selectedParticipant.current = record;
                                    setOpenEditModal(true);
                                }}
                                color={ColorStatus.primary}
                                size={8}
                            />
                            {record.role !== Roles.witness && (
                                <Icon
                                    data-testid={`${record.name}_delete_icon`}
                                    icon={DeleteIcon}
                                    onClick={() => {
                                        selectedParticipant.current = record;
                                        toggleDeleteModal();
                                    }}
                                    color={ColorStatus.primary}
                                    size={8}
                                />
                            )}
                        </Space>
                    );
                }
                return null;
            },
        },
    ];

    useEffect(() => {
        if (activeKey === CONSTANTS.DEPOSITION_DETAILS_TABS[1]) {
            fetchParticipants(deposition.id, sortingRef.current?.sortDirection ? sortingRef.current : {});
        }
    }, [fetchParticipants, activeKey, deposition.id]);

    useEffect(() => {
        if (participants) {
            isCourtReporterPresent.current = participants.some(
                (participant) => participant.role === Roles.courtReporter
            );
            const participantsArray = participants.map((participant: IParticipant) => {
                const { email, id, name, phone, role, user } = participant;
                const isCourtReporter = role === Roles.courtReporter;
                return {
                    user,
                    email,
                    id,
                    name: user ? `${user.firstName} ${user.lastName}` : name,
                    phone: phone || user?.phoneNumber,
                    role: isCourtReporter ? "Court Reporter" : role,
                };
            });
            setMappedParticipants(participantsArray);
        }
    }, [participants]);

    const handleSortAndReFetchParticipants = useCallback(
        () => fetchParticipants(deposition.id, sortingRef.current?.sortDirection ? sortingRef.current : {}),
        [deposition.id, fetchParticipants]
    );

    if (error) {
        // TODO: Improve error handling
        return <CardFetchError width="100%" onClick={handleSortAndReFetchParticipants} />;
    }

    return (
        <>
            <AddParticipantModal
                depoID={deposition.id}
                isCourtReporterPresent={isCourtReporterPresent.current}
                handleClose={setOpenParticipantModal}
                open={openAddParticipantModal}
                fetchParticipants={handleSortAndReFetchParticipants}
                depositionStatus={deposition.status}
            />

            <EditParticipantModal
                deposition={deposition}
                currentParticipant={selectedParticipant.current}
                isCourtReporterPresent={isCourtReporterPresent.current}
                handleClose={toggleEditModal}
                visible={openEditModal}
                fetchParticipants={handleSortAndReFetchParticipants}
            />

            <Confirm
                positiveLoading={removeParticipantLoading}
                visible={openDeleteModal}
                title={CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_TITLE}
                subTitle={
                    selectedParticipant?.current?.email && deposition.status !== Status.pending
                        ? CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_SUBTITLE_WITH_EMAIL
                        : CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_SUBTITLE
                }
                positiveLabel={CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_CONFIRM_BUTTON_LABEL}
                negativeLabel={CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_CANCEL_BUTTON_LABEL}
                onNegativeClick={() => {
                    if (removeParticipantLoading) {
                        return;
                    }
                    toggleDeleteModal();
                }}
                onPositiveClick={() => {
                    removeParticipant(deposition.id, selectedParticipant.current.id);
                }}
            />
            <Space direction="vertical" size={4} pt={4} fullWidth>
                <Space justify="space-between" fullWidth>
                    <Title
                        level={5}
                        noMargin
                        weight="regular"
                        dataTestId={CONSTANTS.DEPOSITION_DETAILS_INVITED_PARTIES_DATA_TEST_ID}
                    >
                        {CONSTANTS.DEPOSITION_DETAILS_INVITED_PARTIES_TITLE}
                    </Title>
                    {mappedParticipants.length < 22 && (
                        <Button
                            disabled={deposition.status === Status.canceled}
                            type="primary"
                            icon={<Icon icon={AddIcon} size={9} />}
                            size="middle"
                            onClick={toggleAddParticipantModal}
                        >
                            {CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON}
                        </Button>
                    )}
                </Space>
                <Table
                    onChange={(_, __, sorter: any) => {
                        sortingRef.current = { sortField: sorter.field, sortDirection: sorter.order };
                        return handleSortAndReFetchParticipants();
                    }}
                    loading={loading}
                    rowKey="id"
                    dataSource={mappedParticipants}
                    columns={columns}
                    pagination={false}
                    style={{ height: "100%" }}
                />
            </Space>
        </>
    );
};

export default ParticipantListTable;
