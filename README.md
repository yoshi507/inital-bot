# 🤖 Inital Bot

A simple and clean Discord moderation bot with essential slash commands.

## ✨ Commands

| Command | Description | Permission |
|---------|-------------|------------|
| `/ban @user [reason]` | Ban a user | Ban Members |
| `/kick @user [reason]` | Kick a user | Kick Members |
| `/timeout @user [duration] [reason]` | Timeout a user (e.g. `10m`, `1h`, `1d`) | Moderate Members |
| `/warn @user [reason]` | Warn a user (saved to file) | Moderate Members |
| `/warnings @user` | View a user's warnings | Moderate Members |
| `/clear [amount]` | Delete 1-100 messages | Manage Messages |
| `/slowmode [seconds]` | Set channel slowmode (0 to disable) | Manage Channels |
| `/lock` | Lock the channel | Manage Channels |
| `/unlock` | Unlock the channel | Manage Channels |
| `/say [message] [embed]` | Make the bot say something | Manage Messages |

## 🚀 Setup

### 1. Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application** → name it whatever you want
3. Go to **Bot** → click **Add Bot**
4. Under **Privileged Gateway Intents**, enable:
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent** (optional but recommended)
5. Click **Reset Token** and copy your bot token

### 2. Invite the Bot

1. Go to **OAuth2 → URL Generator**
2. Select scopes: `bot` + `applications.commands`
3. Select permissions:
   - Ban Members
   - Kick Members
   - Moderate Members
   - Manage Messages
   - Manage Channels
   - Send Messages
   - Embed Links
   - Read Message History
4. Copy the generated URL and open it to invite the bot to your server

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
GUILD_ID=your_server_id_here   # optional, for instant command updates while testing
```

- **DISCORD_TOKEN** → Bot page → Reset Token / Copy
- **CLIENT_ID** → General Information → Application ID
- **GUILD_ID** → Right-click your server → Copy Server ID (enable Developer Mode in Discord settings first)

### 4. Install & Run

```bash
npm install
npm run deploy    # Register slash commands
npm start         # Start the bot
```

## 📁 Project Structure

```
inital-bot/
├── commands/          # All slash commands
├── utils/             # Helpers (warnings storage, duration parser)
├── index.js           # Main bot entry point
├── deploy-commands.js # Registers slash commands
├── .env.example       # Environment variable template
└── package.json
```

## ⚠️ Notes

- Warnings are stored in a local `warnings.json` file.
- Timeout duration supports `s`, `m`, `h`, `d` (max 28 days).
- `/clear` cannot delete messages older than 14 days (Discord limitation).
- Make sure the bot's role is **above** the roles of users you want to moderate.

## 📜 License

MIT
