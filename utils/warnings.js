const fs = require('fs');
const path = require('path');

const WARNINGS_FILE = path.join(__dirname, '..', 'warnings.json');

function loadWarnings() {
  try {
    if (fs.existsSync(WARNINGS_FILE)) {
      return JSON.parse(fs.readFileSync(WARNINGS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading warnings:', err);
  }
  return {};
}

function saveWarnings(data) {
  try {
    fs.writeFileSync(WARNINGS_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving warnings:', err);
  }
}

function addWarning(guildId, userId, reason, moderatorId) {
  const warnings = loadWarnings();
  if (!warnings[guildId]) warnings[guildId] = {};
  if (!warnings[guildId][userId]) warnings[guildId][userId] = [];

  const warning = {
    reason: reason || 'No reason provided',
    moderatorId,
    timestamp: Date.now(),
  };

  warnings[guildId][userId].push(warning);
  saveWarnings(warnings);
  return warnings[guildId][userId].length;
}

function getWarnings(guildId, userId) {
  const warnings = loadWarnings();
  return warnings[guildId]?.[userId] || [];
}

module.exports = { addWarning, getWarnings };
