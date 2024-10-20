import React, { useState, useEffect, useCallback } from 'react';

const Timer = ({ isRunning, onTimerUpdate }) => {
  const [time, setTime] = useState(0);

  const updateTimer = useCallback(() => {
    if (typeof onTimerUpdate === 'function') {
      onTimerUpdate(time + 1);
    }
    setTime(prevTime => prevTime + 1);
  }, [time, onTimerUpdate]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(updateTimer, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, updateTimer]);

  useEffect(() => {
    if (!isRunning) {
      setTime(0);
    }
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return <div>{formatTime(time)}</div>;
};

export default Timer;
