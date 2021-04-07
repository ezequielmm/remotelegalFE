export const AUDIO_FORMATS = ["mp3", "ogg"];

export const isAudioFromUrl = (url: string) => AUDIO_FORMATS.includes(url?.split(".").pop());
