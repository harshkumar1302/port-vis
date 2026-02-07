import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

const AudioPlayer = forwardRef((props, ref) => {
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);

    useImperativeHandle(ref, () => ({
        toggle: () => {
            if (playing) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            }
            setPlaying(!playing);
        },
        isPlaying: playing
    }));

    useEffect(() => {
        // Optional: Loop
        if (audioRef.current) {
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;
        }
    }, []);

    return (
        <audio ref={audioRef} src="/radhekrishna.mp3" />
    );
});

export default AudioPlayer;
