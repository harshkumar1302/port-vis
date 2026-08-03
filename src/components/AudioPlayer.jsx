import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

const AUDIO_SRC = '/radhekrishna-96k.mp3';

const AudioPlayer = forwardRef((props, ref) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useImperativeHandle(ref, () => ({
    toggle: () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (!audio.src) {
        audio.src = AUDIO_SRC;
      }

      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        audio.play().catch((e) => console.log('Audio play failed:', e));
        setPlaying(true);
      }
    },
    isPlaying: playing,
  }));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.volume = 0.5;
    audio.preload = 'none';
  }, []);

  return <audio ref={audioRef} preload="none" />;
});

export default AudioPlayer;
