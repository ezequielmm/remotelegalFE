// We have to type the audioElement as any because setSinkId is not part of the TS HTMLMediaElement interface
const changeSpeakers = async (mediaElement: any, deviceId: string) => {
    if (mediaElement?.setSinkId) {
        await mediaElement?.setSinkId(deviceId);
    }
};
export default changeSpeakers;
