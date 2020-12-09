import { fireEvent, waitForDomChange, waitForElement } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import MyDepositions from "../../routes/MyDepositions";
import * as CONSTANTS from "../constants/depositions";
import * as ERRORS_CONSTANTS from "../../constants/errors";
import * as COMPONENTS_CONSTANTS from "../../constants/depositions";
import * as AUTH from "../mocks/Auth";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { createMemoryHistory } from "history";
import getMockDeps from "../utils/getMockDeps";

const customDeps = getMockDeps();
const history = createMemoryHistory();

describe("MyDepositions", () => {
    beforeEach(() => {
        AUTH.VALID();
    });

    it("shows empty state screen when no depositions loaded and go to add deposition modal", async () => {
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue(CONSTANTS.getNoDepositions());
        const { getByText } = renderWithGlobalContext(<MyDepositions />, customDeps);
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({});

        const emptyStateTitle = await waitForElement(() => getByText(COMPONENTS_CONSTANTS.EMPTY_STATE_TITLE));
        expect(emptyStateTitle).toBeTruthy();
    });

    it("shows a table with 1 record with a constant name when backend returns 1 deposition", async () => {
        customDeps.apiService.fetchDepositions = jest.fn().mockResolvedValue(CONSTANTS.getDepositions1());
        const { getAllByText } = renderWithGlobalContext(<MyDepositions />, customDeps);
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({});

        const courtReporter = await waitForElement(() => getAllByText(CONSTANTS.PARTICIPANT_NAME));
        expect(courtReporter.length).toBe(1);
    });

    it.each(
        COMPONENTS_CONSTANTS.getDepositionColumns(history)
            .filter(({ sorter }) => sorter !== false)
            .filter(({ title }) => title)
            .map((column) => [column.title, column])
    )("should sort %s tab  when clicks on it", async (title, { field }: COMPONENTS_CONSTANTS.TableColumn) => {
        const { getByText, deps } = renderWithGlobalContext(<MyDepositions />);
        expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({});
        await waitForDomChange();
        const sortButton = getByText(title);
        userEvent.click(sortButton);

        await waitForDomChange();
        expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({
            sortDirection: "descend",
            sortedField: field,
        });

        userEvent.click(sortButton);
        await waitForDomChange();
        expect(deps.apiService.fetchDepositions).toHaveBeenCalledWith({
            sortDirection: "ascend",
            sortedField: field,
        });
    });

    it("shows error and try again button when get an error on fetch", async () => {
        customDeps.apiService.fetchDepositions = jest.fn().mockRejectedValue("Error");

        const { getByText, getByTestId } = renderWithGlobalContext(<MyDepositions />, customDeps);

        await waitForElement(() => getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE));
        const refreshButton = getByTestId("error_modal_button");
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({});
        fireEvent.click(refreshButton);
        await waitForDomChange();
        expect(customDeps.apiService.fetchDepositions).toHaveBeenCalledWith({});
    });
});
