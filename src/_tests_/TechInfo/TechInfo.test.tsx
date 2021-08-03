import { fireEvent, screen, waitFor } from "@testing-library/react";
import * as COMPONENTS_CONSTANTS from "../../constants/techInfo";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import getMockDeps from "../utils/getMockDeps";
import TechInfo from "../../routes/TechInfo";
import { DEPOSITION_INFO_MOCK, DEPOSITION_PARTICIPANT_MOCK } from "../constants/techInfo";
import { wait } from "../../helpers/wait";

let deps;

beforeEach(() => {
    deps = getMockDeps();
});

test("Shows error toast if info fetch fails", async () => {
    deps.apiService.getDepositionInfo = jest.fn().mockRejectedValue({});
    renderWithGlobalContext(<TechInfo />, deps);
    await waitFor(() => expect(screen.getByText(COMPONENTS_CONSTANTS.NETWORK_ERROR)).toBeInTheDocument());
});

test("Shows spinner on mount", async () => {
    deps.apiService.getDepositionInfo = jest.fn().mockImplementation(() => wait(200));
    renderWithGlobalContext(<TechInfo />, deps);
    await waitFor(() => expect(screen.getByTestId("spinner")).toBeInTheDocument());
});

test("Shows proper info if depositionInfo values are false", async () => {
    const newDepositionInfo = {
        ...DEPOSITION_INFO_MOCK,
        sharingExhibit: "",
        isVideoRecordingNeeded: false,
        isRecording: false,
    };
    deps.apiService.getDepositionInfo = jest.fn().mockResolvedValue(newDepositionInfo);
    renderWithGlobalContext(<TechInfo />, deps);
    await waitFor(() => {
        expect(screen.getByText(COMPONENTS_CONSTANTS.NO_EXHIBIT_INFO)).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.AUDIO)).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.NO_TAG)).toBeInTheDocument();
    });
});

test("Shows proper Overview info", async () => {
    renderWithGlobalContext(<TechInfo />, deps);
    const overviewHeaders = Object.values(COMPONENTS_CONSTANTS.OVERVIEW_INFO_HEADERS);
    await waitFor(() => {
        overviewHeaders.forEach((header) => expect(screen.getByText(header)).toBeInTheDocument());
        expect(screen.getByText(COMPONENTS_CONSTANTS.TECH_TAB_HEADER)).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.TECH_TAB_PILL)).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.OVERVIEW_SUBHEADER)).toBeInTheDocument();
        expect(screen.getAllByText(COMPONENTS_CONSTANTS.OVERVIEW_HEADER)).toHaveLength(2);
        expect(screen.getAllByText(DEPOSITION_INFO_MOCK.roomId)).toHaveLength(2);
        expect(screen.getByText(DEPOSITION_INFO_MOCK.sharingExhibit)).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.VIDEO)).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.YES_TAG)).toBeInTheDocument();
    });
});
test("Shows Participant tab when clicking the menu option", async () => {
    renderWithGlobalContext(<TechInfo />, deps);

    await waitFor(() => {
        expect(screen.getByText(COMPONENTS_CONSTANTS.TECH_TAB_HEADER)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId(DEPOSITION_PARTICIPANT_MOCK.name));

    await waitFor(() => {
        expect(
            screen.getByText(`${DEPOSITION_PARTICIPANT_MOCK.name} | ${DEPOSITION_PARTICIPANT_MOCK.role}`)
        ).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.PARTICIPANT_TAB_SUBHEADER)).toBeInTheDocument();

        Object.values(COMPONENTS_CONSTANTS.PARTICIPANT_INFO_HEADERS).map((header) =>
            expect(screen.getByText(header)).toBeInTheDocument()
        );
        expect(screen.getByText(COMPONENTS_CONSTANTS.PARTICIPANT_TAB_GENERAL_SUBHEADER)).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.PARTICIPANT_TAB_SYSTEM_SUBHEADER)).toBeInTheDocument();
        Object.values(COMPONENTS_CONSTANTS.PARTICIPANT_INFO_DEVICES_HEADERS).map((header) =>
            expect(screen.getByText(header)).toBeInTheDocument()
        );
        expect(screen.getByText(COMPONENTS_CONSTANTS.PARTICIPANT_INFO_SYSTEM_HEADERS.BROWSER)).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.PARTICIPANT_INFO_SYSTEM_HEADERS.DEVICE)).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.PARTICIPANT_INFO_SYSTEM_HEADERS.IP)).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.PARTICIPANT_INFO_SYSTEM_HEADERS.OS)).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.PARTICIPANT_TAB_DEVICES_SUBHEADER)).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.PARTICIPANT_TAB_SYSTEM_SUBHEADER)).toBeInTheDocument();
        expect(screen.getAllByText(DEPOSITION_PARTICIPANT_MOCK.name)).toHaveLength(2);
        expect(screen.getByText(DEPOSITION_PARTICIPANT_MOCK.role)).toBeInTheDocument();
        expect(screen.getByText(DEPOSITION_PARTICIPANT_MOCK.email)).toBeInTheDocument();
        expect(screen.getByText(DEPOSITION_PARTICIPANT_MOCK.operatingSystem)).toBeInTheDocument();
        expect(screen.getByText(DEPOSITION_PARTICIPANT_MOCK.browser)).toBeInTheDocument();
        expect(
            screen.getByText(
                DEPOSITION_PARTICIPANT_MOCK.device
                    .toLowerCase()
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
            )
        ).toBeInTheDocument();
        expect(screen.getByText(DEPOSITION_PARTICIPANT_MOCK.ip)).toBeInTheDocument();
        expect(screen.getByText(DEPOSITION_PARTICIPANT_MOCK.devices.camera.status)).toBeInTheDocument();
        expect(screen.getByText(DEPOSITION_PARTICIPANT_MOCK.devices.microphone.name)).toBeInTheDocument();
        expect(screen.getByText(DEPOSITION_PARTICIPANT_MOCK.devices.microphone.name)).toBeInTheDocument();
        expect(screen.getAllByText(COMPONENTS_CONSTANTS.YES_TAG)).toHaveLength(2);
    });
});
test("Shows Proper Participant info is values are false", async () => {
    const newParticipant = {
        ...DEPOSITION_PARTICIPANT_MOCK,
        hasJoined: false,
        isAdmitted: false,
        devices: {
            ...DEPOSITION_PARTICIPANT_MOCK.devices,
            camera: {
                name: null,
                status: null,
            },
            microphone: {
                name: null,
            },
        },
    };
    const newDepositionInfo = { ...DEPOSITION_INFO_MOCK, participants: [newParticipant] };
    deps.apiService.getDepositionInfo = jest.fn().mockResolvedValue(newDepositionInfo);
    renderWithGlobalContext(<TechInfo />, deps);

    await waitFor(() => {
        expect(screen.getByText(COMPONENTS_CONSTANTS.TECH_TAB_HEADER)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId(DEPOSITION_PARTICIPANT_MOCK.name));

    await waitFor(() => {
        expect(
            screen.getByText(`${DEPOSITION_PARTICIPANT_MOCK.name} | ${DEPOSITION_PARTICIPANT_MOCK.role}`)
        ).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.PARTICIPANT_TAB_SUBHEADER)).toBeInTheDocument();
        expect(screen.getAllByText(COMPONENTS_CONSTANTS.NO_TAG)).toHaveLength(2);
        expect(screen.getByText(COMPONENTS_CONSTANTS.NO_CAMERA_INFO)).toBeInTheDocument();
        expect(screen.getByText(COMPONENTS_CONSTANTS.NO_MIC_INFO)).toBeInTheDocument();
    });
});
