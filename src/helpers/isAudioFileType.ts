import { SUPPORTED_AUDIO_FILES } from "../constants/exhibits";

const isAudioFileType = (fileName: string = "") => {
    const extension = fileName.split(".").pop();
    return SUPPORTED_AUDIO_FILES.some((ext) => ext === extension);
};

export default isAudioFileType;
