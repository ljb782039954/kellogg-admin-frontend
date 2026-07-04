import { useState, useEffect, useCallback } from 'react';
import OptimizedImage from '@/runtime/components/OptimizedImage';

export interface CountdownProps {
  titleText?: string;
  subtitleText?: string;
  endTime?: string;
  backgroundImage?: string;
  labels?: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
}

export default function Countdown({
  titleText,
  subtitleText,
  endTime,
  backgroundImage,
  labels = {
    days: "Days",
    hours: "Hours",
    minutes: "Min",
    seconds: "Sec",
  },
}: CountdownProps) {
  const calculateTimeLeft = useCallback(() => {
    if (!endTime) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const difference = +new Date(endTime) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [endTime]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className="relative py-16 overflow-hidden text-center">
      <OptimizedImage
        src={backgroundImage}
        alt=""
        width={1920}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 to-orange-500/90" />
      <div className="relative text-white">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          {titleText && <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">{titleText}</h2>}
          {subtitleText && <p className="text-md md:text-lg text-white/70">{subtitleText}</p>}
        </div>
        <div className="flex justify-center gap-4 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <span className="text-sm mt-2 opacity-80">{labels.days}</span>
          </div>
          <div className="text-3xl font-bold self-start mt-4">:</div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span className="text-sm mt-2 opacity-80">{labels.hours}</span>
          </div>
          <div className="text-3xl font-bold self-start mt-4">:</div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span className="text-sm mt-2 opacity-80">{labels.minutes}</span>
          </div>
          <div className="text-3xl font-bold self-start mt-4">:</div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <span className="text-sm mt-2 opacity-80">{labels.seconds}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
