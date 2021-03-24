import React, { useRef, useState, useEffect, useCallback } from "react";
import Space from "../../../components/Space";
import Title from "../../../components/Typography/Title";
import Table from "../../../components/Table";
import Button from "../../../components/Button";
import AddParticipantModal from "./AddParticipantModal";
import { DepositionModel } from "../../../models";
import * as CONSTANTS from "../../../constants/activeDepositionDetails";
import Icon from "../../../components/Icon";
import { ReactComponent as DeleteIcon } from "../../../assets/icons/delete.svg";
import { ReactComponent as AddIcon } from "../../../assets/general/Add.svg";
import Confirm from "../../../components/Confirm";
import { IParticipant, Roles } from "../../../models/participant";
import ColorStatus from "../../../types/ColorStatus";
import {
    useFetchParticipants,
    useRemoveParticipantFromExistingDepo,
} from "../../../hooks/activeDepositionDetails/hooks";
import CardFetchError from "../../../components/CardFetchError";
import { UserInfo } from "../../../models/user";
import Message from "../../../components/Message";
import { Status } from "../../../components/StatusPill/StatusPill";

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
    const [openAddParticipantModal, setOpenParticipantModal] = useState(false);
    const toggleDeleteModal = () => setOpenDeleteModal(!openDeleteModal);
    const toggleAddParticipantModal = () => setOpenParticipantModal(!openAddParticipantModal);
    const isCourtReporterPresent = useRef(false);
    const sortingRef = useRef({
        sortDirection: null,
        sortField: "",
    });
    const selectedParticipant = useRef<UserInfo["participant"]>(null);
    const [
        removeParticipant,
        removeParticipantLoading,
        removeParticipantError,
        removedParticipant,
    ] = useRemoveParticipantFromExistingDepo();

    useEffect(() => {
        if (removedParticipant) {
            const participantWasCourtReporter = selectedParticipant.current.role === "Court Reporter";
            if (participantWasCourtReporter) {
                isCourtReporterPresent.current = false;
            }
            setOpenDeleteModal(false);
            Message({
                content: CONSTANTS.DEPOSITION_DETAILS_REMOVE_PARTICIPANT_TOAST,
                type: "success",
                duration: 3,
            });
            fetchParticipants(deposition.id, sortingRef.current?.sortDirection ? sortingRef.current : {});
        }
    }, [removedParticipant, fetchParticipants, deposition.id]);

    useEffect(() => {
        if (removeParticipantError) {
            Message({
                content: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [removeParticipantError]);

    const columns = [
        ...CONSTANTS.DEPOSITION_DETAILS_INVITED_PARTIES_COLUMNS,
        {
            render: (record: UserInfo["participant"]) => {
                const depo = deposition;
                if (depo.status !== Status.canceled && record.role !== Roles.witness) {
                    return (
                        <Space justify="flex-end" fullWidth>
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
            const participantsArray = participants.map((participant: IParticipant) => {
                const { email, id, name, phone, role, user } = participant;
                const isCourtReporter = role === Roles.courtReporter;
                if (isCourtReporter) {
                    isCourtReporterPresent.current = true;
                }
                return {
                    email,
                    id,
                    name: user ? `${user.firstName} ${user.lastName}` : name,
                    phone,
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
            />

            <Confirm
                positiveLoading={removeParticipantLoading}
                visible={openDeleteModal}
                title={CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_TITLE}
                subTitle={CONSTANTS.DEPOSITION_DETAILS_DELETE_MODAL_SUBTITLE}
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
            <Space direction="vertical" size="middle" pt={6} fullWidth>
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
                            size="small"
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
