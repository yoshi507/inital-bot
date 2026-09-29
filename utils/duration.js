/**
 * Parse a duration string into milliseconds.
 * Supports: 30s, 5m, 2h, 1d
 * Max Discord timeout: 28 days
 */
function parseDuration(input) {
  if (!input) return null;

  const match = input.trim().toLowerCase().match(/^(\d+)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days)?$/);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2] || 'm'; // default to minutes

  let ms;
  if (['s', 'sec', 'secs', 'second', 'seconds'].includes(unit)) {
    ms = value * 1000;
  } else if (['m', 'min', 'mins', 'minute', 'minutes'].includes(unit)) {
    ms = value * 60 * 1000;
  } else if (['h', 'hr', 'hrs', 'hour', 'hours'].includes(unit)) {
    ms = value * 60 * 60 * 1000;
  } else if (['d', 'day', 'days'].includes(unit)) {
    ms = value * 24 * 60 * 60 * 1000;
  } else {
    return null;
  }

  // Discord max timeout is 28 days
  const MAX = 28 * 24 * 60 * 60 * 1000;
  if (ms > MAX) return MAX;
  if (ms < 1000) return 1000; // min 1 second

  return ms;
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

module.exports = { parseDuration, formatDuration };
