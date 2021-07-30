import React from "react";
import { TimeZones } from "../../models/general";
import VideoConference from "../../routes/InDepo/VideoConference";
import * as CONSTANTS from "../constants/InDepo";
import { getParticipant, participantMap, participantMapIdentity } from "../mocks/participant";
import { useGetParticipantStatus } from "../../hooks/InDepo/useParticipantStatus";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

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
