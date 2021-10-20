import React from "react";
import { fireEvent, waitFor, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";
import { TimeZones } from "../../models/general";
import VideoConference from "../../routes/InDepo/VideoConference";
import * as CONSTANTS from "../constants/InDepo";
import { getParticipant, participantMap, participantMapIdentity, participantMapWithAdmin } from "../mocks/participant";
import { useGetParticipantStatus } from "../../hooks/InDepo/useParticipantStatus";
import useEditParticipantRole from "../../hooks/useEditParticipantRole";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import getMockDeps from "../utils/getMockDeps";
import { rootReducer } from "../../state/GlobalState";
import {
    EDIT_PARTICIPANT_ROLE_CHANGED_SUCCESSFULLY_MESSAGE,
    EDIT_PARTICIPANT_ROLE_ERROR_MESSAGE,
    EDIT_PARTICIPANT_ROLE_EXISTING_WITNESS_TITLE,
    EDIT_PARTICIPANT_ROLE_HAS_BEEN_ON_THE_RECORD_TITLE,
    EDIT_PARTICIPANT_ROLE_ON_THE_RECORD_TITLE,
} from "../../constants/editParticipantRole";

jest.mock("../../hooks/InDepo/useParticipantStatus", () => ({
    useGetParticipantStatus: jest.fn(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test@test.com",
                isMuted: false,
            },
        },
    })),
}));

jest.mock("../../hooks/useEditParticipantRole", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({ depositionID: "test1234", breakroomID: "testBreakroom1234" }),
}));

let customDeps;

beforeEach(() => {
    customDeps = getMockDeps();
    (useEditParticipantRole as jest.Mock).mockReturnValue({ editParticipantRole: () => {}, loading: false });
    jest.resetModules();
    jest.clearAllMocks();
});

test("Shows waiting for witness and participant identity", () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));
    const participant = getParticipant("test1", "Attorney");
    const { queryByTestId, queryByText } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
        />
    );
    expect(queryByText(CONSTANTS.WAITING_FOR_WITNESS)).toBeTruthy();
    expect(queryByText(JSON.parse(participant.identity).name)).toBeTruthy();
    expect(queryByTestId("participant_time")).toBeTruthy();
});

test("Shows both participants´ identities", () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness");
    const { queryByTestId, queryByText } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
        />
    );
    expect(queryByText(JSON.parse(participant.identity).name)).toBeTruthy();
    expect(queryByText(JSON.parse(participant.identity).role)).toBeTruthy();
    expect(queryByText(participantMapIdentity)).toBeTruthy();
    expect(queryByText(CONSTANTS.WAITING_FOR_WITNESS)).toBeFalsy();
    expect(queryByTestId("participant_time")).toBeTruthy();
});

test("Should display the muted microphone icon when the enableMuteUnmute is true and the participant is muted", () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test@test.com",
                isMuted: true,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness", "test@test.com");
    const { queryAllByTestId } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
        />
    );

    expect(queryAllByTestId("participant_muted")[0].parentElement).toHaveStyle({ opacity: 1 });
});

test("Should not display the muted microphone icon when the enableMuteUnmute is false", () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test@test.com",
                isMuted: true,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness", "test@test.com");
    const { queryAllByTestId } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
        />
    );
    expect(queryAllByTestId("participant_muted")[0].parentElement).toHaveStyle({ opacity: 0 });
});

test("Should not display the muted microphone icon when the enableMuteUnmute is true but the participant is not muted", () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test@test.com",
                isMuted: false,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness", "test@test.com");
    const { queryAllByTestId } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
        />
    );
    expect(queryAllByTestId("participant_muted")[0].parentElement).toHaveStyle({ opacity: 0 });
});

test("Should not display the muted microphone icon when the enableMuteUnmute is true but the a different participant is muted", () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness", "test@test.com");
    const { queryAllByTestId } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
        />
    );
    expect(queryAllByTestId("participant_muted")[0].parentElement).toHaveStyle({ opacity: 0 });
});

test("Should display the participant role change dropdown when canChangeParticipantRole is true and the mouse is over of the component", async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness", "test@test.com");
    renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
            canChangeParticipantRole
            isBreakroom
        />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
                signalR: { signalR: null },
                room: {
                    ...rootReducer.initialState.room,
                    newSpeaker: null,
                },
            },
        }
    );
    await waitFor(() => expect(screen.queryAllByTestId("participant-mask").length > 0).toBeTruthy());
    const participantElement = screen.queryAllByTestId("participant-mask")[0];
    fireEvent.mouseOver(participantElement);
    await waitFor(() => expect(screen.queryAllByTestId("dropdown_options")[0]).toBeInTheDocument());
});

test("Should not display the participant role change dropdown when canChangeParticipantRole is true and the mouse is not hover anymore", async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness", "test@test.com");
    renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
            canChangeParticipantRole
            isBreakroom
        />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
                signalR: { signalR: null },
                room: {
                    ...rootReducer.initialState.room,
                    newSpeaker: null,
                },
            },
        }
    );
    await waitFor(() => expect(screen.queryAllByTestId("participant-mask").length > 0).toBeTruthy());
    const participantElement = screen.queryAllByTestId("participant-mask")[0];
    fireEvent.mouseOver(participantElement);
    await waitFor(() => expect(screen.queryAllByTestId("dropdown_options")[0]).toBeInTheDocument());
    fireEvent.mouseOut(participantElement);
    await waitFor(() => expect(screen.queryAllByTestId("dropdown_options")[0]).toBeUndefined());
});

test("Should not display the participant role change dropdown when canChangeParticipantRole is false", async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness", "test@test.com");
    renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
            isBreakroom
        />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
                signalR: { signalR: null },
                room: {
                    ...rootReducer.initialState.room,
                    newSpeaker: null,
                },
            },
        }
    );
    await waitFor(() => expect(screen.queryAllByTestId("participant-mask").length > 0).toBeTruthy());
    const participantElement = screen.queryAllByTestId("participant-mask")[0];
    fireEvent.mouseOver(participantElement);
    await waitFor(() => expect(screen.queryAllByTestId("dropdown_options")[0]).toBeUndefined);
});

test("Should not display the participant role change dropdown when canChangeParticipantRole is true but the participant is admin", async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness", "test@test.com");
    renderWithGlobalContext(
        <VideoConference
            attendees={participantMapWithAdmin}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
            canChangeParticipantRole
            isBreakroom
        />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
                signalR: { signalR: null },
                room: {
                    ...rootReducer.initialState.room,
                    newSpeaker: null,
                },
            },
        }
    );
    await waitFor(() => expect(screen.queryAllByTestId("participant-mask").length > 0).toBeTruthy());
    const participantElement = screen.queryAllByTestId("participant-mask")[0];
    fireEvent.mouseOver(participantElement);
    await waitFor(() => expect(screen.queryAllByTestId("dropdown_options")[0]).toBeUndefined);
});

test("Should not display the participant role change dropdown when the witness participant has not any role", async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));
    const participant = getParticipant("", "Observer", "");
    renderWithGlobalContext(
        <VideoConference
            attendees={participantMapWithAdmin}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
            canChangeParticipantRole
        />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
                signalR: { signalR: null },
                room: {
                    ...rootReducer.initialState.room,
                    newSpeaker: null,
                },
            },
        }
    );
    await waitFor(() => expect(screen.queryAllByTestId("participant-mask").length > 0).toBeTruthy());
    const participantElement = screen.queryAllByTestId("participant-mask")[0];
    fireEvent.mouseOver(participantElement);
    await waitFor(() => expect(screen.queryAllByTestId("dropdown_options")[0]).toBeUndefined);
});

test("Should display the participant change role modal after click on the Edit Role Button", async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness", "test@test.com");
    renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
            canChangeParticipantRole
            isBreakroom
        />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
                signalR: { signalR: null },
                room: {
                    ...rootReducer.initialState.room,
                    newSpeaker: null,
                },
            },
        }
    );
    await waitFor(() => expect(screen.queryAllByTestId("participant-mask").length > 0).toBeTruthy());
    const participantElement = screen.queryAllByTestId("participant-mask")[0];
    fireEvent.mouseOver(participantElement);
    fireEvent.click(screen.queryAllByTestId("dropdown_options")[0].children[0].firstChild);
    await waitFor(() => expect(screen.queryAllByTestId("option_edit_participant_button")[0]).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByText("Edit Participant")[0]).toBeInTheDocument());
    fireEvent.click(screen.queryAllByText("Edit Participant")[0]);
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-save-button")).toBeInTheDocument());
});

test("Should call edit role endpoint after click on save edit role modal's button", async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));

    const mockEditParticipantRole = jest.fn();
    (useEditParticipantRole as jest.Mock).mockImplementation((onClose = null, onUpdateRole = null, onError) => {
        return {
            editParticipantRole: mockEditParticipantRole,
        };
    });
    const participant = getParticipant("test2", "Observer", "test@test.com");
    renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
            canChangeParticipantRole
            isBreakroom
        />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
                signalR: { signalR: null },
                room: {
                    ...rootReducer.initialState.room,
                    newSpeaker: null,
                },
            },
        }
    );
    await waitFor(() => expect(screen.queryAllByTestId("participant-mask").length > 0).toBeTruthy());
    const participantElement = screen.queryAllByTestId("participant-mask")[0];
    fireEvent.mouseOver(participantElement);
    fireEvent.click(screen.queryAllByTestId("dropdown_options")[0].children[0].firstChild);
    await waitFor(() => expect(screen.queryAllByTestId("option_edit_participant_button")[0]).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByText("Edit Participant")[0]).toBeInTheDocument());
    fireEvent.click(screen.queryAllByText("Edit Participant")[0]);
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-save-button")).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-options")).toBeInTheDocument());
    await act(async () => {
        userEvent.click(await screen.findByRole("combobox"));
        const role = await screen.findByTestId("participant-role-name-Attorney");
        userEvent.click(role);
    });

    fireEvent.click(screen.queryByTestId("edit-participant-role-save-button"));
    await waitFor(() =>
        expect(mockEditParticipantRole).toHaveBeenCalledWith({
            role: "Attorney",
            email: "test@test.com",
        })
    );
});

test("Should disable the save role button if not change the previous select role", async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));

    const participant = getParticipant("test2", "Observer", "test@test.com");
    renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
            canChangeParticipantRole
            isBreakroom
        />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
                signalR: { signalR: null },
                room: {
                    ...rootReducer.initialState.room,
                    newSpeaker: null,
                },
            },
        }
    );
    await waitFor(() => expect(screen.queryAllByTestId("participant-mask").length > 0).toBeTruthy());
    const participantElement = screen.queryAllByTestId("participant-mask")[0];
    fireEvent.mouseOver(participantElement);
    fireEvent.click(screen.queryAllByTestId("dropdown_options")[0].children[0].firstChild);
    await waitFor(() => expect(screen.queryAllByTestId("option_edit_participant_button")[0]).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByText("Edit Participant")[0]).toBeInTheDocument());
    fireEvent.click(screen.queryAllByText("Edit Participant")[0]);
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-save-button")).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-options")).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-save-button")).toBeDisabled);
});

test("Should display error `There is already a witness` when the api return an status code 409", async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));

    (useEditParticipantRole as jest.Mock).mockImplementation((onClose = null, onUpdateRole = null, onError) => {
        return {
            editParticipantRole: () => onError({ status: 409 }),
        };
    });
    const participant = getParticipant("test2", "Observer", "test@test.com");
    renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
            canChangeParticipantRole
            isBreakroom
        />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
                signalR: { signalR: null },
                room: {
                    ...rootReducer.initialState.room,
                    newSpeaker: null,
                },
            },
        }
    );
    await waitFor(() => expect(screen.queryAllByTestId("participant-mask").length > 0).toBeTruthy());
    const participantElement = screen.queryAllByTestId("participant-mask")[0];
    fireEvent.mouseOver(participantElement);
    fireEvent.click(screen.queryAllByTestId("dropdown_options")[0].children[0].firstChild);
    await waitFor(() => expect(screen.queryAllByTestId("option_edit_participant_button")[0]).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByText("Edit Participant")[0]).toBeInTheDocument());
    fireEvent.click(screen.queryAllByText("Edit Participant")[0]);
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-save-button")).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-options")).toBeInTheDocument());
    await act(async () => {
        userEvent.click(await screen.findByRole("combobox"));
        const role = await screen.findByTestId("participant-role-name-Attorney");
        userEvent.click(role);
    });

    fireEvent.click(screen.queryByTestId("edit-participant-role-save-button"));
    await waitFor(() => expect(screen.queryByText(EDIT_PARTICIPANT_ROLE_EXISTING_WITNESS_TITLE)).toBeInTheDocument());
});

test(`Should display error ${EDIT_PARTICIPANT_ROLE_ON_THE_RECORD_TITLE} when the api return an status message that contains "IsOnTheRecord"`, async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));

    (useEditParticipantRole as jest.Mock).mockImplementation((onClose = null, onUpdateRole = null, onError) => {
        return {
            editParticipantRole: () => onError({ status: 400, message: "IsOnTheRecord error" }),
        };
    });

    const participant = getParticipant("test2", "Observer", "test@test.com");
    renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
            canChangeParticipantRole
            isBreakroom
        />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
                signalR: { signalR: null },
                room: {
                    ...rootReducer.initialState.room,
                    newSpeaker: null,
                },
            },
        }
    );
    await waitFor(() => expect(screen.queryAllByTestId("participant-mask").length > 0).toBeTruthy());
    const participantElement = screen.queryAllByTestId("participant-mask")[0];
    fireEvent.mouseOver(participantElement);
    fireEvent.click(screen.queryAllByTestId("dropdown_options")[0].children[0].firstChild);
    await waitFor(() => expect(screen.queryAllByTestId("option_edit_participant_button")[0]).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByText("Edit Participant")[0]).toBeInTheDocument());
    fireEvent.click(screen.queryAllByText("Edit Participant")[0]);
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-save-button")).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-options")).toBeInTheDocument());
    await act(async () => {
        userEvent.click(await screen.findByRole("combobox"));
        const role = await screen.findByTestId("participant-role-name-Attorney");
        userEvent.click(role);
    });

    fireEvent.click(screen.queryByTestId("edit-participant-role-save-button"));
    await waitFor(() => expect(screen.queryByText(EDIT_PARTICIPANT_ROLE_ON_THE_RECORD_TITLE)).toBeInTheDocument());
});

test(`Should display error ${EDIT_PARTICIPANT_ROLE_HAS_BEEN_ON_THE_RECORD_TITLE} when the api return an status message that contains "IsOnTheRecord"`, async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));

    (useEditParticipantRole as jest.Mock).mockImplementation((onClose = null, onUpdateRole = null, onError) => {
        return {
            editParticipantRole: () => onError({ status: 400, message: "HasBeenOnTheRecord error" }),
        };
    });

    const participant = getParticipant("test2", "Observer", "test@test.com");
    renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
            canChangeParticipantRole
            isBreakroom
        />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
                signalR: { signalR: null },
                room: {
                    ...rootReducer.initialState.room,
                    newSpeaker: null,
                },
            },
        }
    );
    await waitFor(() => expect(screen.queryAllByTestId("participant-mask").length > 0).toBeTruthy());
    const participantElement = screen.queryAllByTestId("participant-mask")[0];
    fireEvent.mouseOver(participantElement);
    fireEvent.click(screen.queryAllByTestId("dropdown_options")[0].children[0].firstChild);
    await waitFor(() => expect(screen.queryAllByTestId("option_edit_participant_button")[0]).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByText("Edit Participant")[0]).toBeInTheDocument());
    fireEvent.click(screen.queryAllByText("Edit Participant")[0]);
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-save-button")).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-options")).toBeInTheDocument());
    await act(async () => {
        userEvent.click(await screen.findByRole("combobox"));
        const role = await screen.findByTestId("participant-role-name-Attorney");
        userEvent.click(role);
    });

    fireEvent.click(screen.queryByTestId("edit-participant-role-save-button"));
    await waitFor(() =>
        expect(screen.queryByText(EDIT_PARTICIPANT_ROLE_HAS_BEEN_ON_THE_RECORD_TITLE)).toBeInTheDocument()
    );
});

test(`Should display error "${EDIT_PARTICIPANT_ROLE_ERROR_MESSAGE}" when the api return a different error`, async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));
    customDeps.apiService.editParticipantRole = jest.fn().mockRejectedValue({ status: 400 });
    const participant = getParticipant("test2", "Observer", "test@test.com");
    renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
            canChangeParticipantRole
            isBreakroom
        />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
                signalR: { signalR: null },
                room: {
                    ...rootReducer.initialState.room,
                    newSpeaker: null,
                },
            },
        }
    );
    await waitFor(() => expect(screen.queryAllByTestId("participant-mask").length > 0).toBeTruthy());
    const participantElement = screen.queryAllByTestId("participant-mask")[0];
    fireEvent.mouseOver(participantElement);
    fireEvent.click(screen.queryAllByTestId("dropdown_options")[0].children[0].firstChild);
    await waitFor(() => expect(screen.queryAllByTestId("option_edit_participant_button")[0]).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByText("Edit Participant")[0]).toBeInTheDocument());
    fireEvent.click(screen.queryAllByText("Edit Participant")[0]);
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-save-button")).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-options")).toBeInTheDocument());
    await act(async () => {
        userEvent.click(await screen.findByRole("combobox"));
        const role = await screen.findByTestId("participant-role-name-Attorney");
        userEvent.click(role);
    });

    fireEvent.click(screen.queryByTestId("edit-participant-role-save-button"));
    await waitFor(() => expect(screen.queryByTestId("change-role-error-alert")).toBeTruthy);
});

test(`Should display an alert with "${EDIT_PARTICIPANT_ROLE_CHANGED_SUCCESSFULLY_MESSAGE}" when the signalr response ok`, async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));
    customDeps.apiService.editParticipantRole = jest.fn().mockResolvedValue({});
    (useEditParticipantRole as jest.Mock).mockImplementation((onClose = null, onUpdateRole = null) => {
        return {
            editParticipantRole: () => onUpdateRole("token", "role"),
        };
    });

    const participant = getParticipant("test2", "Observer", "test@test.com");
    renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.ET}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
            canChangeParticipantRole
            isBreakroom
            onUpdateParticipantRole={jest.fn()}
        />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                user: {
                    currentUser: {
                        firstName: "First Name",
                        lastName: "Last Name",
                        emailAddress: "test@test.com",
                        isAdmin: true,
                    },
                },
                signalR: { signalR: null },
                room: {
                    ...rootReducer.initialState.room,
                    newSpeaker: null,
                },
            },
        }
    );
    await waitFor(() => expect(screen.queryAllByTestId("participant-mask").length > 0).toBeTruthy());
    const participantElement = screen.queryAllByTestId("participant-mask")[0];
    fireEvent.mouseOver(participantElement);
    fireEvent.click(screen.queryAllByTestId("dropdown_options")[0].children[0].firstChild);
    await waitFor(() => expect(screen.queryAllByTestId("option_edit_participant_button")[0]).toBeInTheDocument());
    await waitFor(() => expect(screen.queryAllByText("Edit Participant")[0]).toBeInTheDocument());
    fireEvent.click(screen.queryAllByText("Edit Participant")[0]);
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-save-button")).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByTestId("edit-participant-role-options")).toBeInTheDocument());
    await act(async () => {
        userEvent.click(await screen.findByRole("combobox"));
        const role = await screen.findByTestId("participant-role-name-Attorney");
        userEvent.click(role);
    });

    fireEvent.click(screen.queryByTestId("edit-participant-role-save-button"));
    await waitFor(() => expect(screen.queryByTestId("change-role-successfully-alert")).toBeInTheDocument());
});
