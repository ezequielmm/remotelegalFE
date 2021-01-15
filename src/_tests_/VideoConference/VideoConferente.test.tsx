import React from "react";
import { TimeZones } from "../../models/general";
import VideoConference from "../../routes/InDepo/VideoConference";
import * as CONSTANTS from "../constants/InDepo";
import { getParticipant, participantMap, participantMapIdentity } from "../mocks/participant";

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
