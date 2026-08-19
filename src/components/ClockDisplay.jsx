import React from 'react';

/**
 * ClockDisplay component
 * Receives the current time, theme, and country via props and displays the digital clock.
 */
function ClockDisplay({ time, theme, country }) {
  // Map countries to representative IANA timezones
  const getCountryTimezone = (countryName) => {
    switch (countryName) {
      case 'India': return 'Asia/Kolkata';
      case 'UK (London)': return 'Europe/London';
      case 'Japan': return 'Asia/Tokyo';
      case 'Canada': return 'America/Toronto';
      case 'USA': return 'America/New_York';
      case 'Australia': return 'Australia/Sydney';
      case 'Brazil': return 'America/Sao_Paulo';
      case 'South Africa': return 'Africa/Johannesburg';
      case 'France': return 'Europe/Paris';
      case 'UAE': return 'Asia/Dubai';
      default: return undefined;
    }
  };

  // Format the time parts using native Intl API
  const getTimeParts = (date, countryName) => {
    try {
      const timeZone = getCountryTimezone(countryName);
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
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

  const { hours, minutes, seconds, ampm } = getTimeParts(time, country);

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
