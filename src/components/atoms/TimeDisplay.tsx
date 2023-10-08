import React, { useState, useEffect } from 'react';

interface Props {
  time: number;
  className?: string;
}

const TimeDisplay: React.FC<Props> = ({ time, className }) => {
  const [formattedTime, setFormattedTime] = useState<string>(InitialDate(time));

  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date(time * 1000);
      const currentTime = Math.floor(Date.now() / 1000);
      const difference = currentTime - time;

      if (difference >= 31536000) {
        // Lebih dari 1 tahun
        const formattedDate = date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        setFormattedTime(formattedDate);
      } else if (difference >= 604800) {
        // Lebih dari 1 minggu
        const formattedDate = date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
        });
        setFormattedTime(formattedDate);
      } else if (difference >= 86400) {
        // Lebih dari 1 hari
        const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
        setFormattedTime(dayName);
      } else if (difference >= 60) {
        // Lebih dari 1 menit
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        setFormattedTime(`${hours}:${minutes}`);
      } else {
        setFormattedTime(`Now`);
      }
    }, 500); // Update every second

    return () => clearInterval(intervalId);
  }, [time]);

  return <p className={className}>{formattedTime}</p>;
};

export default TimeDisplay;

const InitialDate = (time: number): string => {
  const date = new Date(time * 1000);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
