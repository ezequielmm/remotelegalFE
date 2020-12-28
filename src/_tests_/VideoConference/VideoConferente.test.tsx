import React from "react";
import { TimeZones } from "../../models/general";
import VideoConference from "../../routes/InDepo/VideoConference";
import * as CONSTANTS from "../constants/InDepo";
import { getParticipant, participantMap, participantMapIdentity } from "../mocks/participant";

import renderWithGlobalContext from "../utils/renderWithGlobalContext";

const participant = getParticipant("test1");

test("Shows waiting for witness and participant identity", async () => {
    const { queryByTestId, queryByText } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.EST}
            layoutSize={1}
            localParticipant={participant}
            witnessID=""
        />
    );
    expect(queryByText(CONSTANTS.WAITING_FOR_WITNESS)).toBeTruthy();
    expect(queryByText(participant.identity)).toBeTruthy();
    expect(queryByTestId("participant_time")).toBeTruthy();
});

test("Shows both participants´ identities", async () => {
    const { queryByTestId, queryByText } = renderWithGlobalContext(
        <VideoConference
            attendees={participantMap}
            timeZone={TimeZones.EST}
            layoutSize={1}
            localParticipant={participant}
            witnessID="test1"
        />
    );
    expect(queryByText(participant.identity)).toBeTruthy();
    expect(queryByText(participantMapIdentity)).toBeTruthy();
    expect(queryByText(CONSTANTS.WAITING_FOR_WITNESS)).toBeFalsy();
    expect(queryByTestId("participant_time")).toBeTruthy();
});
