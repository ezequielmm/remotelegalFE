import { LocalTrack } from "twilio-video";

const stopAllTracks = (tracks: LocalTrack[]) => {
    if (!tracks || !tracks.length) {
        return;
    }
    tracks.forEach((trackPublication: LocalTrack) => {
        return trackPublication.kind === "audio" || trackPublication.kind === "video" ? trackPublication.stop() : null;
    });
};

export default stopAllTracks;
