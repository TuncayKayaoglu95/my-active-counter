import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const intervalRef = useRef<number | null>(null);

  const startCounter = () => {
    if (intervalRef.current !== null) return;
    intervalRef.current = window.setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 1000);
  };

  const stopCounter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsActive(true);
        startCounter();
      } else {
        setIsActive(false);
        stopCounter();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (document.visibilityState === 'visible') {
      startCounter();
    }
    return () => {
      stopCounter();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="bg-slate-900 text-white h-full w-full flex flex-col items-center justify-center font-sans p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl text-center w-full max-w-md">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">Aktif Sekme Sayacı</h1>
        <p className="text-slate-400 mb-6">Bu sayaç sadece bu sekme aktifken çalışır.</p>
        <div className="mb-8">
          <p className="text-lg text-slate-300">Durum:</p>
          <span 
            className={`px-4 py-2 mt-2 inline-block rounded-full font-semibold text-sm transition-all duration-300 ${
              isActive 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-red-500/20 text-red-300'
            }`}
          >
            {isActive ? 'Aktif' : 'Pasif'}
          </span>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-6">
          <p className="text-6xl font-mono font-extrabold tracking-widest text-white">
            {count}
          </p>
        </div>
      </div>
      <footer className="absolute bottom-4 text-slate-500 text-sm">
        Başka bir sekmeye geçin veya pencereyi küçültün.
      </footer>
    </div>
  );
}

export default App;
