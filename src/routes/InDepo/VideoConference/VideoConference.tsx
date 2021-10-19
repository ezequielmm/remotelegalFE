import { useCallback, useEffect, useRef, useState } from "react";
import { LocalParticipant, RemoteParticipant, Room } from "twilio-video";
import Confirm from "prp-components-library/src/components/Confirm";
import { useGetParticipantStatus } from "../../../hooks/InDepo/useParticipantStatus";
import { TimeZones } from "../../../models/general";
import Participant from "../Participant";
import {
    StyledVideoConference,
    StyledVideoConferenceWrapper,
    StyledDeponentContainer,
    StyledAttendeesContainer,
    StyledParticipantContainer,
} from "./styles";
import AspectRatio from "../../../assets/in-depo/aspect-ratio-16-8.svg";
import EditParticipantRoleModal from "./EditParticipantRoleModal";
import { IIdentity } from "../../../constants/identity";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";
import {
    EDIT_PARTICIPANT_ROLE_CHANGED_SUCCESSFULLY_MESSAGE,
    EDIT_PARTICIPANT_ROLE_ERROR_MESSAGE,
    EDIT_PARTICIPANT_ROLE_EXISTING_WITNESS_OK_LABEL,
    EDIT_PARTICIPANT_ROLE_EXISTING_WITNESS_SUBTITLE,
    EDIT_PARTICIPANT_ROLE_EXISTING_WITNESS_TITLE,
    EDIT_PARTICIPANT_ROLE_ON_THE_RECORD_OK_LABEL,
    EDIT_PARTICIPANT_ROLE_ON_THE_RECORD_SUBTITLE,
    EDIT_PARTICIPANT_ROLE_ON_THE_RECORD_TITLE,
} from "../../../constants/editParticipantRole";

enum LayoutSize {
    default,
    grid,
    vertical,
}

type TLayoutClass = keyof typeof LayoutSize;

interface IVideoConferenceProps {
    attendees: Room["participants"];
    layoutSize: LayoutSize;
    timeZone: TimeZones;
    isBreakroom?: boolean;
    localParticipant: LocalParticipant;
    atendeesVisibility?: boolean;
    enableMuteUnmute?: boolean;
    canChangeParticipantRole?: boolean;
    onUpdateParticipantRole?: (token: string) => void;
}

const VideoConference = ({
    isBreakroom,
    attendees,
    timeZone,
    layoutSize,
    localParticipant,
    atendeesVisibility = true,
    enableMuteUnmute = false,
    canChangeParticipantRole = false,
    onUpdateParticipantRole,
}: IVideoConferenceProps) => {
    const [layoutClass, setLayoutClass] = useState<TLayoutClass>(null);
    const participantContainer = useRef<HTMLDivElement>(null);
    const videoConferenceContainer = useRef<HTMLDivElement>(null);
    const { participantsStatus } = useGetParticipantStatus();
    const [isParticipantEditRoleModalOpen, setIsParticipantEditRoleModalOpen] = useState(false);
    const [isExistingWitnessConfirmModalOpen, setIsExistingWitnessConfirmModalOpen] = useState(false);
    const [isOnTheRecordConfirmModalOpen, setIsOnTheRecordConfirmModalOpen] = useState(false);
    const [currentParticipantEdited, setCurrentParticipantEdited] = useState<IIdentity>(null);
    const participants = [localParticipant, ...Array.from(attendees.values())];
    const witness = participants.find((participant) => JSON.parse(participant.identity).role === "Witness");
    const participantsFiltered = participants.filter(
        (participant) => isBreakroom || JSON.parse(participant.identity).role !== "Witness"
    );

    const addAlert = useFloatingAlertContext();

    const handleCloseUpdateParticipantRole = useCallback(() => {
        setIsParticipantEditRoleModalOpen(false);
    }, []);

    const handleUpdateRole = useCallback(
        (token, role) => {
            onUpdateParticipantRole(token);
            addAlert({
                message: `${EDIT_PARTICIPANT_ROLE_CHANGED_SUCCESSFULLY_MESSAGE} ${role}`,
                type: "info",
                duration: 3,
                dataTestId: "change-role-successfully-alert",
            });
        },
        [addAlert, onUpdateParticipantRole]
    );

    const handleError = (error: { status: number; message: string }) => {
        if (error?.status === 409) {
            setIsParticipantEditRoleModalOpen(false);
            return setIsExistingWitnessConfirmModalOpen(true);
        }

        if (error?.message?.includes("IsOnTheRecord")) {
            setIsParticipantEditRoleModalOpen(false);
            return setIsOnTheRecordConfirmModalOpen(true);
        }

        return addAlert({
            message: EDIT_PARTICIPANT_ROLE_ERROR_MESSAGE,
            type: "error",
            duration: 3,
            dataTestId: "change-role-error-alert",
        });
    };

    useEffect(() => {
        switch (layoutSize) {
            case LayoutSize.vertical:
                setLayoutClass("vertical");
                break;
            case LayoutSize.grid:
                setLayoutClass("grid");
                break;
            default:
                setLayoutClass("default");
                break;
        }
    }, [layoutSize]);

    return (
        <StyledVideoConferenceWrapper layout={layoutClass}>
            <Confirm
                title={EDIT_PARTICIPANT_ROLE_EXISTING_WITNESS_TITLE}
                subTitle={EDIT_PARTICIPANT_ROLE_EXISTING_WITNESS_SUBTITLE}
                positiveLabel={EDIT_PARTICIPANT_ROLE_EXISTING_WITNESS_OK_LABEL}
                visible={isExistingWitnessConfirmModalOpen}
                onPositiveClick={() => {
                    setIsExistingWitnessConfirmModalOpen(false);
                }}
            >
                <span data-testid="existing-witness-modalconfirm" />
            </Confirm>
            <Confirm
                title={EDIT_PARTICIPANT_ROLE_ON_THE_RECORD_TITLE}
                subTitle={EDIT_PARTICIPANT_ROLE_ON_THE_RECORD_SUBTITLE}
                positiveLabel={EDIT_PARTICIPANT_ROLE_ON_THE_RECORD_OK_LABEL}
                visible={isOnTheRecordConfirmModalOpen}
                onPositiveClick={() => {
                    setIsOnTheRecordConfirmModalOpen(false);
                }}
            >
                <span data-testid="existing-witness-modalconfirm" />
            </Confirm>
            <EditParticipantRoleModal
                currentParticipant={currentParticipantEdited}
                onClose={handleCloseUpdateParticipantRole}
                onUpdateRole={handleUpdateRole}
                onExistingWitnessError={handleError}
                visible={isParticipantEditRoleModalOpen}
            />
            <StyledVideoConference
                className={`${layoutClass} ${isBreakroom ? "breakrooms" : ""}`}
                ref={videoConferenceContainer}
                show={atendeesVisibility}
            >
                {!isBreakroom && (
                    <StyledDeponentContainer isSingle={isBreakroom && participants.length === 1}>
                        <Participant
                            isLocal={
                                isBreakroom
                                    ? participants[1]?.sid === localParticipant.sid
                                    : witness?.sid === localParticipant.sid
                            }
                            timeZone={timeZone}
                            participant={witness}
                            isWitness
                            isVideoOnly={layoutClass === "default"}
                            isMuted={
                                enableMuteUnmute &&
                                !!(witness && participantsStatus[JSON.parse(witness?.identity)?.email]?.isMuted)
                            }
                            onEditParticipantRole={(participantIdentity) => {
                                setCurrentParticipantEdited(participantIdentity);
                                setIsParticipantEditRoleModalOpen(true);
                            }}
                            canUserEditParticipantRole={canChangeParticipantRole}
                        />
                    </StyledDeponentContainer>
                )}
                <StyledAttendeesContainer
                    participantsLength={participantsFiltered.length}
                    layout={layoutClass}
                    isBreakroom={isBreakroom}
                >
                    {participantsFiltered.map((participant: RemoteParticipant, i) => (
                        <StyledParticipantContainer
                            key={participant.sid}
                            ref={i === 0 ? participantContainer : null}
                            participantsLength={participantsFiltered.length}
                            layout={layoutClass}
                            isBreakrooms={isBreakroom}
                        >
                            <Participant
                                isLocal={participant?.sid === localParticipant?.sid}
                                isMuted={
                                    enableMuteUnmute &&
                                    !!participantsStatus[JSON.parse(participant.identity)?.email]?.isMuted
                                }
                                participant={participant}
                                isVideoOnly={layoutClass === "default"}
                                isSingle={participantsFiltered.length === 1}
                                onEditParticipantRole={(participantIdentity) => {
                                    setCurrentParticipantEdited(participantIdentity);
                                    setIsParticipantEditRoleModalOpen(true);
                                }}
                                canUserEditParticipantRole={canChangeParticipantRole}
                            />
                        </StyledParticipantContainer>
                    ))}
                </StyledAttendeesContainer>
            </StyledVideoConference>
            <img src={AspectRatio} alt="16/8" className="aspect-ratio" />
        </StyledVideoConferenceWrapper>
    );
};

export default VideoConference;
