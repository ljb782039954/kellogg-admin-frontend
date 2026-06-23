import { useState, useEffect, useCallback } from 'react';
import MotionHeaderDark from '../custom/motionHeaderDark';
import type { Translation } from '@/types';

export interface CountdownValues {
  endTime?: string;
  backgroundImage?: string;
}

export interface CountdownProps {
  title?: Translation;
  subtitle?: Translation;
  values?: CountdownValues;
}

interface Props {
  t: (obj: { zh: string; en: string }) => string;
  props: CountdownProps;
}

export default function Countdown({ t, props }: Props) {
  const { title, subtitle, values } = props;
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(values?.endTime) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [values?.endTime]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);



  return (
    <div className="relative py-16 overflow-hidden text-center">
      <img
        src={values?.backgroundImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 to-orange-500/90" />
      <div className="relative text-white">
        <MotionHeaderDark t={t} title={title} subtitle={subtitle} />
        <div className="flex justify-center gap-4 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <span className="text-sm mt-2 opacity-80">{t({ zh: '天', en: 'Days' })}</span>
          </div>
          <div className="text-3xl font-bold self-start mt-4">:</div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span className="text-sm mt-2 opacity-80">{t({ zh: '时', en: 'Hours' })}</span>
          </div>
          <div className="text-3xl font-bold self-start mt-4">:</div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span className="text-sm mt-2 opacity-80">{t({ zh: '分', en: 'Min' })}</span>
          </div>
          <div className="text-3xl font-bold self-start mt-4">:</div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 shadow-lg">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <span className="text-sm mt-2 opacity-80">{t({ zh: '秒', en: 'Sec' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
