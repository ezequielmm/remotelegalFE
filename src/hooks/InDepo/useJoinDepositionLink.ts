import { useParams } from "react-router";
import { DepositionID } from "../../state/types";

const useJoinDepositionLink = (): string => {
    const { depositionID } = useParams<DepositionID>();
    const joinPath = `/deposition/pre-join/${depositionID}`;

    return `${window.location.origin}${joinPath}`;
};
export default useJoinDepositionLink;
