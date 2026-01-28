import React, { useState, useCallback, useEffect } from 'react';
import { AppState, TimerCount } from './types';
import CameraView from './components/CameraView';
import ProcessingView from './components/ProcessingView';
import ResultView from './components/ResultView';
import IntroView from './components/IntroView';
import { processImageBackground } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<TimerCount>(3);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // State to keep IntroView mounted during fade-out
  const [showIntro, setShowIntro] = useState(true);

  const startProcess = useCallback(() => {
    setAppState(AppState.COUNTDOWN);
    setCountdown(3);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (appState === AppState.COUNTDOWN && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => (prev - 1) as TimerCount);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [appState, countdown]);

  const handleCapture = useCallback(async (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setAppState(AppState.PROCESSING);

    try {
      const result = await processImageBackground(imageSrc);
      setProcessedImage(result);
      setAppState(AppState.COMPLETE);
    } catch (error) {
      console.error("Processing Failed", error);
      setErrorMessage("Failed to process image. Please try again.");
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setProcessedImage(null);
    setErrorMessage(null);
    setAppState(AppState.IDLE);
  }, []);

  return (
    <main className="w-full h-screen bg-black text-white overflow-hidden flex flex-col font-sans relative">
      
      {/* Intro Overlay */}
      {showIntro && (
        <IntroView 
          onStart={() => setAppState(AppState.IDLE)} 
          onUnmount={() => setShowIntro(false)} 
        />
      )}

      {/* Main App Content - Only render structure when not in INTRO state (or fading out of it) */}
      {appState !== AppState.INTRO && (
        <>
            {/* Top Bar / Branding */}
            <header className="absolute top-0 left-0 w-full p-6 z-20 pointer-events-none flex justify-between items-start animate-[fadeIn_1s_ease-out]">
                <div>
                <h1 className="text-xl font-bold tracking-tighter leading-none">Literal Sticker</h1>
                </div>
                <div className="text-[10px] font-mono border border-white/20 px-2 py-1 rounded text-white/50">
                    BLACK_VER_1.0
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 relative">
                {(appState === AppState.IDLE || appState === AppState.COUNTDOWN) ? (
                <CameraView 
                    onCapture={handleCapture}
                    isCounting={appState === AppState.COUNTDOWN}
                    count={countdown}
                    startCountdown={startProcess}
                />
                ) : null}

                {appState === AppState.PROCESSING && (
                <ProcessingView />
                )}

                {appState === AppState.COMPLETE && processedImage && (
                <ResultView 
                    imageSrc={processedImage} 
                    onRetake={handleRetake}
                />
                )}

                {appState === AppState.ERROR && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <p className="text-red-500 font-mono">{errorMessage}</p>
                    <button 
                        onClick={handleRetake}
                        className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold"
                    >
                        Try Again
                    </button>
                </div>
                )}
            </div>
        </>
      )}
    </main>
  );
};

export default App;