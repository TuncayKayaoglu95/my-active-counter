import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState<number>(0);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(true);
  const [isWindowFocused, setIsWindowFocused] = useState<boolean>(document.hasFocus());

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
      setIsTabVisible(document.visibilityState === 'visible');
    };

    const handleFocus = () => {
      setIsWindowFocused(true);
    };

    const handleBlur = () => {
      setIsWindowFocused(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    if (isTabVisible && isWindowFocused) {
      startCounter();
    } else {
      stopCounter();
    }
    
    return () => {
      stopCounter();
    }
  }, [isTabVisible, isWindowFocused]);

  const isCounterRunning = isTabVisible && isWindowFocused;

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl text-center w-full max-w-md">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">Akıllı Sayaç</h1>
        <p className="text-slate-400 mb-6">Bu sayaç, sadece sekme görünür ve pencere odakta iken çalışır.</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div className="flex flex-col items-center bg-slate-700/50 p-3 rounded-lg">
            <p className="text-slate-300 mb-2">Sekme Görünürlüğü</p>
            <span 
              className={`px-3 py-1 rounded-full font-semibold transition-all ${
                isTabVisible 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}
            >
              {isTabVisible ? 'Görünür' : 'Gizli'}
            </span>
          </div>
          
          <div className="flex flex-col items-center bg-slate-700/50 p-3 rounded-lg">
            <p className="text-slate-300 mb-2">Pencere Odağı</p>
            <span 
              className={`px-3 py-1 rounded-full font-semibold transition-all ${
                isWindowFocused 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}
            >
              {isWindowFocused ? 'Odakta' : 'Odak Dışı'}
            </span>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-6 relative">
          <span 
            className={`absolute top-3 right-3 px-3 py-1 text-xs rounded-full font-semibold transition-all ${
              isCounterRunning
                ? 'bg-green-500/20 text-green-300'
                : 'bg-red-500/20 text-red-300'
            }`}
          >
            {isCounterRunning ? 'Çalışıyor' : 'Duraklatıldı'}
          </span>
          <p className="text-6xl font-mono font-extrabold tracking-widest text-white">
            {count}
          </p>
        </div>
      </div>
      <footer className="absolute bottom-4 text-slate-500 text-sm">
        Başka bir pencereye geçerek veya sekmeyi değiştirerek test edin.
      </footer>
    </div>
  );
}

export default App;

