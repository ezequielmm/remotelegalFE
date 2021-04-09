import { waitForDomChange, fireEvent, waitForElement } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { wait } from "../../helpers/wait";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as CONSTANTS from "../../constants/activeDepositionDetails";
import { getDepositionWithOverrideValues } from "../constants/depositions";
import ParticipantListTable from "../../routes/ActiveDepoDetails/components/ParticipantListTable";
import { PARTICIPANT_MOCK } from "../constants/preJoinDepo";

const customDeps = getMockDeps();

describe("Tests the Invited Parties tab", () => {
    test("Should be call a notifieParticipant endpoint", async () => {
        customDeps.apiService.fetchParticipants = jest.fn().mockImplementation(async () => {
            return [PARTICIPANT_MOCK];
        });
        customDeps.apiService.addParticipantToExistingDepo = jest.fn().mockImplementation(async () => {
            return {};
        });
        const deposition = getDepositionWithOverrideValues();
        deposition.status = "Confirmed";

        const { getByText, getByTestId, getAllByText } = renderWithGlobalContext(
            <ParticipantListTable deposition={deposition} activeKey={CONSTANTS.DEPOSITION_DETAILS_TABS[1]} />,
            customDeps
        );
        await waitForDomChange();
        fireEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_BUTTON));
        await waitForDomChange();
        userEvent.click(getByText(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLE_SELECT_PLACEHOLDER));
        const role = await waitForElement(() => getAllByText("Observer"));

        userEvent.click(role[0]);
        await wait(200);
        fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_EMAIL), {
            target: { value: "test@test.com" },
        });
        fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_NAME), {
            target: { value: "A Name" },
        });
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        expect(getByTestId(CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_CONFIRM_MODAL_ID)).toBeInTheDocument();
    });
});
