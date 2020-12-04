import React from "react";
import Participant from "../../components/Participant";
import * as CONSTANTS from "../constants/InDepo";
import getParticipant from "../mocks/participant";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

const participant = getParticipant("test1");

test("Shows waiting for witness if participant doesn´t have an identity", async () => {
    const { queryByText } = renderWithGlobalContext(<Participant participant={null} />);
    expect(queryByText(CONSTANTS.WAITING_FOR_WITNESS)).toBeTruthy();
});

test("Shows participant identity if participant has an identity", async () => {
    const { queryByText } = renderWithGlobalContext(<Participant participant={participant} />);
    expect(queryByText(participant.identity)).toBeTruthy();
});
