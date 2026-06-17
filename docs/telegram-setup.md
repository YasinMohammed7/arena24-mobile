# Telegram Bot Setup

## Environment Variables

Add these environment variables to your `.env` file:

```env
# Telegram Bot Token (provided)
EXPO_PUBLIC_API_STUDIO80_TOKEN=your_bot_token_here

# Telegram Chat ID (you need to get this)
EXPO_PUBLIC_TELEGRAM_CHAT_ID=your_chat_id_here
```

## Getting the Chat ID

To get your Telegram chat ID:

1. Start a conversation with your bot
2. Send any message to the bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for the `chat.id` value in the response
5. Add this ID to your environment variables

## Alternative: Get Chat ID from Terminal

```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

## Message Format

When a waiter is requested, the bot will send a message like:

```
🔔 CERERE OSPĂTAR

🏪 Restaurant: Restaurant Name
🆔 ID Restaurant: 123
⏰ Timp: 28.08.2024, 15:30

Un client a solicitat un ospătar!
```

## Testing the Service

You can test the Telegram service by calling:

```typescript
import telegramService from "@/services/telegramService";

// Test connection
const isConnected = await telegramService.testConnection();

// Get bot info
const botInfo = await telegramService.getBotInfo();
```
