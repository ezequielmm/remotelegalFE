import { renderHook } from "@testing-library/react-hooks";
import wrapper from "../mocks/wrapper";

import useJoinDepositionLink from "../../hooks/InDepo/useJoinDepositionLink";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({ depositionID: "depoId" }),
    useLocation: () => ({ pathname: "deposition/join/depoId" }),
}));

test("It calls dispatch with proper actions", async () => {
    const { result } = renderHook(() => useJoinDepositionLink(), { wrapper });
    const depoLink = result.current;

    expect(depoLink).toEqual("http://localhost/deposition/pre-join/depoId");
});
