import { LocalTrack } from "twilio-video";

const stopAllTracks = (tracks: LocalTrack[] | MediaStreamTrack[]) => {
    if (!tracks || !tracks.length) {
        return;
    }
    tracks.forEach((trackPublication: LocalTrack | MediaStreamTrack) => {
        return trackPublication.kind === "audio" || trackPublication.kind === "video" ? trackPublication.stop() : null;
    });
};

export default stopAllTracks;
