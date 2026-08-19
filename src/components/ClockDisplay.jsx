import React from 'react';

/**
 * ClockDisplay component
 * Receives the current time, theme, and country via props and displays the digital clock.
 */
function ClockDisplay({ time, theme, timezone, clockType = 'digital' }) {
  // Format the time parts using native Intl API
  const getTimeParts = (date, tz) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      const parts = formatter.formatToParts(date);
      let hours = '', minutes = '', seconds = '', ampm = '';

      parts.forEach(({ type, value }) => {
        if (type === 'hour') hours = value;
        if (type === 'minute') minutes = value;
        if (type === 'second') seconds = value;
        if (type === 'dayPeriod') ampm = value;
      });

      return { hours, minutes, seconds, ampm };
    } catch (e) {
      let h = date.getHours();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12;
      return {
        hours: String(h).padStart(2, '0'),
        minutes: String(date.getMinutes()).padStart(2, '0'),
        seconds: String(date.getSeconds()).padStart(2, '0'),
        ampm
      };
    }
  };

  const { hours, minutes, seconds, ampm } = getTimeParts(time, timezone);

  if (clockType === 'analog') {
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    const s = parseInt(seconds, 10);

    const secondDeg = s * 6;
    const minuteDeg = m * 6 + s * 0.1;
    const hourDeg = (h % 12) * 30 + m * 0.5;

    const renderTicks = () => {
      const ticks = [];
      for (let i = 1; i <= 12; i++) {
        ticks.push(
          <div
            key={i}
            className="clock-tick"
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <span style={{ transform: `rotate(-${i * 30}deg)` }}>{i}</span>
          </div>
        );
      }
      return ticks;
    };

    return (
      <div className="clock-display-wrapper text-center my-4">
        <div className="analog-clock">
          {renderTicks()}
          <div className="hand hour" style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }} />
          <div className="hand minute" style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }} />
          <div className="hand second" style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }} />
          <div className="center-dot" />
        </div>
        <div className="clock-ampm">{ampm}</div>
      </div>
    );
  }

  return (
    <div className="clock-display-wrapper text-center my-4">
      <div className="clock-digits">
        <span className="digit-segment">{hours}</span>
        <span className="digit-colon">:</span>
        <span className="digit-segment">{minutes}</span>
        <span className="digit-colon">:</span>
        <span className="digit-segment">{seconds}</span>
      </div>
      <div className="clock-ampm">{ampm}</div>
    </div>
  );
}

export default ClockDisplay;
