import { SUPPORTED_AUDIO_VIDEO_FILES } from "../constants/exhibits";

const isAudioOrVideoFileType = (fileName: string = "") => {
    const extension = fileName.split(".").pop();
    return SUPPORTED_AUDIO_VIDEO_FILES.some((ext) => ext === extension);
};

export default isAudioOrVideoFileType;
