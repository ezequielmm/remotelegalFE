import { waitFor, screen } from "@testing-library/react";
import Participant from "../../routes/InDepo/Participant";
import * as CONSTANTS from "../constants/InDepo";
import getParticipant from "../mocks/participant";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

let participant;

beforeEach(() => {
    jest.useFakeTimers();
    participant = getParticipant("test1", "Attorney");
    participant.on.mockImplementation((arg, func) => {
        if (arg === "networkQualityLevelChanged") {
            return func(2);
        }
        return jest.fn();
    });
});

afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
});

test("Shows witness name and role if participant is a witness", () => {
    const participant = getParticipant("test1", "Witness");
    const { queryByText } = renderWithGlobalContext(<Participant participant={participant} isWitness />);
    expect(queryByText(JSON.parse(participant.identity).name)).toBeTruthy();
    expect(queryByText(JSON.parse(participant.identity).role)).toBeTruthy();
});

test("Shows waiting for witness if participant is supposed to be a witness but is not logged in yet", () => {
    const { queryByText } = renderWithGlobalContext(<Participant participant={null} isWitness />);
    expect(queryByText(CONSTANTS.WAITING_FOR_WITNESS)).toBeTruthy();
});

test("Shows  participant role and identity if participant is not a witness", () => {
    const participant = getParticipant("test1", "Attorney");
    const { queryByText } = renderWithGlobalContext(<Participant participant={participant} />);
    expect(queryByText(JSON.parse(participant.identity).name)).toBeTruthy();
    expect(queryByText(JSON.parse(participant.identity).role)).toBeTruthy();
});

test("Expect Court Reporter to appear as role with a space in between", () => {
    const participant = getParticipant("test1", "CourtReporter");
    const { queryByText } = renderWithGlobalContext(<Participant participant={participant} />);
    expect(queryByText(CONSTANTS.COURT_REPORTER)).toBeTruthy();
});

test("Expect Tech Expert to appear as role with a space in between", () => {
    const participant = getParticipant("test1", "TechExpert");
    const { queryByText } = renderWithGlobalContext(<Participant participant={participant} />);
    expect(queryByText(CONSTANTS.TECH_EXPERT)).toBeTruthy();
});

test("Not Expect muted microphone icon by default", () => {
    const participant = getParticipant("test1", "TechExpert");
    const { queryByTestId } = renderWithGlobalContext(<Participant participant={participant} />);
    expect(queryByTestId("participant_muted").parentElement).toHaveStyle({ opacity: 0 });
});

test("Expect muted microphone icon when the participant is muted", () => {
    const participant = getParticipant("test1", "TechExpert");
    const { queryByTestId } = renderWithGlobalContext(<Participant participant={participant} isMuted />);
    expect(queryByTestId("participant_muted")).toBeTruthy();
    expect(queryByTestId("participant_muted").parentElement).toHaveStyle({ opacity: 1 });
});

test("Expect muted microphone icon when the witness is muted", () => {
    const participant = getParticipant("test1", "Witness");
    const { queryByTestId } = renderWithGlobalContext(<Participant participant={participant} isMuted />);
    expect(queryByTestId("participant_muted")).toBeTruthy();
});

test("Expect show network indicator", async () => {
    renderWithGlobalContext(<Participant participant={participant} isMuted />);
    await waitFor(() => expect(screen.getByTestId(CONSTANTS.NETWORK_INDICATOR_TEST_ID)).toBeInTheDocument());
});
// TODO: improve the test in order to avoid using this timeout
jest.setTimeout(50000);
test("Expect toast message when network level is less than 3 and for it to show again after 5 minutes", async () => {
    renderWithGlobalContext(<Participant participant={participant} isMuted isLocal />);
    await waitFor(() => expect(screen.getAllByText(CONSTANTS.CONNECTION_UNSTABLE)).toHaveLength(1));
    await waitFor(() => expect(screen.queryByText(CONSTANTS.CONNECTION_UNSTABLE)).toBeFalsy());
    await waitFor(() => expect(screen.getAllByText(CONSTANTS.CONNECTION_UNSTABLE)).toHaveLength(1), {
        timeout: 50000,
    });
});
