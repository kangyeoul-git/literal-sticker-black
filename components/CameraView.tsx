import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TimerCount } from '../types';
import { RefreshCw } from 'lucide-react';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  isCounting: boolean;
  count: TimerCount;
  startCountdown: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  onCapture, 
  isCounting, 
  count, 
  startCountdown 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 1280 }, // Square aspect ratio preference
            aspectRatio: 1
          },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError('Unable to access camera. Please allow permissions.');
        console.error(err);
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to handle actual capture when count hits 0
  useEffect(() => {
    if (count === 0 && isCounting) {
      capturePhoto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, isCounting]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Calculate square crop
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;
        
        const xOffset = (video.videoWidth - size) / 2;
        const yOffset = (video.videoHeight - size) / 2;

        // Flip horizontally for mirror effect if using front camera usually
        context.translate(size, 0);
        context.scale(-1, 1);

        context.drawImage(
          video,
          xOffset, yOffset, size, size, // Source
          0, 0, size, size // Destination
        );

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
      }
    }
  }, [onCapture]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500 p-4 text-center">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 border border-white/20 rounded-full text-white text-sm hover:bg-white/10"
        >
          <RefreshCw className="inline w-4 h-4 mr-2" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Video Feed */}
      <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
         <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1]" // CSS Mirror
        />
        
        {/* Countdown Overlay */}
        {isCounting && count > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20">
            <span className="text-9xl font-bold text-white animate-pulse">
              {count}
            </span>
          </div>
        )}

        {/* Flash effect on capture */}
        {count === 0 && isCounting && (
          <div className="absolute inset-0 bg-white z-50 animate-ping" />
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Controls */}
      {!isCounting && (
        <div className="absolute bottom-12 z-10">
          <button
            onClick={startCountdown}
            className="group relative flex items-center justify-center"
            aria-label="Capture"
          >
            {/* Outer Ring */}
            <div className="w-20 h-20 rounded-full border-4 border-white transition-transform group-hover:scale-110" />
            {/* Inner Circle */}
            <div className="absolute w-16 h-16 bg-white rounded-full transition-all group-active:scale-90" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraView;