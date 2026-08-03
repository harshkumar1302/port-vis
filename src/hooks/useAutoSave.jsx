import { useEffect, useRef, useState } from 'react';

/** Debounced auto-save — skips the first render after `ready` becomes true */
export function useAutoSave(snapshot, saveFn, { delay = 800, ready = true } = {}) {
  const [status, setStatus] = useState('idle');
  const skipRef = useRef(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!ready) {
      skipRef.current = true;
      return;
    }
    if (skipRef.current) {
      skipRef.current = false;
      return;
    }

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setStatus('saving');
      try {
        await saveFn();
        setStatus('saved');
        setTimeout(() => setStatus((s) => (s === 'saved' ? 'idle' : s)), 2000);
      } catch {
        setStatus('error');
      }
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [snapshot, saveFn, delay, ready]);

  return status;
}

export const AutoSaveStatus = ({ status }) => {
  if (status === 'idle') return null;
  const label =
    status === 'saving' ? 'Saving…' :
    status === 'saved' ? 'Saved' :
    'Couldn’t save';
  const color =
    status === 'error' ? 'text-red-500' :
    status === 'saved' ? 'text-green-600' :
    'text-ghibli-wood/60';

  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>
      {label}
    </span>
  );
};

export default useAutoSave;
