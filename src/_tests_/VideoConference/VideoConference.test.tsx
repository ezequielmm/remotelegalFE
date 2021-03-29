import React from "react";
import { TimeZones } from "../../models/general";
import VideoConference from "../../routes/InDepo/VideoConference";
import * as CONSTANTS from "../constants/InDepo";
import { getParticipant, participantMap, participantMapIdentity } from "../mocks/participant";
import { useGetParticipantStatus } from "../../hooks/InDepo/useParticipantStatus";
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

import renderWithGlobalContext from "../utils/renderWithGlobalContext";

test("Shows waiting for witness and participant identity", async () => {
    const participant = getParticipant("test1", "Attorney");
    const { queryByTestId, queryByText } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.EST}
            layoutSize={1}
            localParticipant={participant}
        />
    );
    expect(queryByText(CONSTANTS.WAITING_FOR_WITNESS)).toBeTruthy();
    expect(queryByText(JSON.parse(participant.identity).name)).toBeTruthy();
    expect(queryByTestId("participant_time")).toBeTruthy();
});

test("Shows both participants´ identities", async () => {
    const participant = getParticipant("test2", "Witness");
    const { queryByTestId, queryByText } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.EST}
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

test("Should display the muted microphone icon when the enableMuteUnmute is true and the participant is muted", async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test@test.com",
                isMuted: true,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness", "test@test.com");
    const { queryByTestId } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.EST}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
        />
    );
    expect(queryByTestId("participant_muted")).toBeInTheDocument();
});

test("Should not display the muted microphone icon when the enableMuteUnmute is false", async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test@test.com",
                isMuted: true,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness", "test@test.com");
    const { queryByTestId } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.EST}
            layoutSize={1}
            localParticipant={participant}
        />
    );
    expect(queryByTestId("participant_muted")).not.toBeInTheDocument();
});

test("Should not display the muted microphone icon when the enableMuteUnmute is true but the participant is muted", async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test@test.com",
                isMuted: false,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness", "test@test.com");
    const { queryByTestId } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.EST}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
        />
    );
    expect(queryByTestId("participant_muted")).not.toBeInTheDocument();
});

test("Should not display the muted microphone icon when the enableMuteUnmute is true but the a different participant is muted", async () => {
    useGetParticipantStatus.mockImplementation(() => ({
        participantsStatus: {
            "test@test.com": {
                email: "test2@test.com",
                isMuted: false,
            },
        },
    }));
    const participant = getParticipant("test2", "Witness", "test@test.com");
    const { queryByTestId } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.EST}
            layoutSize={1}
            localParticipant={participant}
            enableMuteUnmute
        />
    );
    expect(queryByTestId("participant_muted")).not.toBeInTheDocument();
});
