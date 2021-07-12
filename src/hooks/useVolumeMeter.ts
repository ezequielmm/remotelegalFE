import { useEffect, useRef, useState } from "react";

const useVolumeLevel = (stream?: MediaStream) => {
    const isMounted = useRef(true);
    const [volumeLevel, setVolumeLevel] = useState(0);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        let volumeCallback = null;
        let interval;
        let audioSource;
        let analyser;
        const AvailableAudioContext =
            window.AudioContext || // Default
            (window as any).webkitAudioContext; // Safari and old versions of Chrome
        const audioContext = AvailableAudioContext && new AvailableAudioContext();
        if (audioContext && stream) {
            audioSource = audioContext.createMediaStreamSource(stream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.4;
            audioSource.connect(analyser);
            const volumes = new Uint8Array(analyser.frequencyBinCount);
            volumeCallback = () => {
                analyser.getByteFrequencyData(volumes);
                let volumeSum = 0;
                volumes.forEach((volume) => {
                    volumeSum += volume;
                    return volume;
                });
                const averageVolume = volumeSum / 100;
                if (averageVolume > 40) {
                    return setVolumeLevel(averageVolume);
                }
                return setVolumeLevel(0);
            };
        }
        if (volumeCallback) {
            interval = setInterval(volumeCallback, 100);
        }
        return () => {
            if (volumeCallback) {
                clearInterval(interval);
            }
            if (audioContext) {
                analyser?.disconnect();
                audioSource?.disconnect();
                audioContext.close();
            }
            if (isMounted.current) {
                setVolumeLevel(0);
            }
        };
    }, [stream]);
    return { volumeLevel };
};
export default useVolumeLevel;
