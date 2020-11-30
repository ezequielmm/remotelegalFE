import { useContext, useEffect } from "react";
import { DataTrack } from "twilio-video";
import { GlobalStateContext } from "../../state/GlobalState";
import actions from "../../state/videoChat/videoChatAction";

const useDataTrack = (tracks: DataTrack[]): void => {
    const { dispatch } = useContext(GlobalStateContext);
    useEffect(() => {
        const parseMessage = (data: string) => {
            try {
                dispatch(actions.sendMessage(JSON.parse(data)));
            } catch {
                // TODO: Decide how to handle errors
            }
        };
        const handleMessages = (on: boolean) => {
            return tracks.forEach((track) =>
                on ? track.on("message", parseMessage) : track.off("message", parseMessage)
            );
        };
        handleMessages(true);
        return () => {
            handleMessages(false);
        };
    }, [tracks, dispatch]);
};
export default useDataTrack;
