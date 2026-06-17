
/**
 * Utility functions for sending data to external services
 * TODO: Configure actual endpoints in .env file
 */

export interface TelegramMessage {
  type: string;
  location: string;
  data: any;
  timestamp: string;
}

/**
 * Send data to Telegram webhook
 * Requires EXPO_PUBLIC_TELEGRAM_WEBHOOK in .env
 */
export const sendToTelegram = async (messageData: TelegramMessage): Promise<boolean> => {
  try {
    const webhookUrl = process.env.EXPO_PUBLIC_TELEGRAM_WEBHOOK;

    if (!webhookUrl) {
      console.warn('Telegram webhook URL not configured');
      return false;
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return false;
  }
};

/**
 * Send reservation data
 */
export const sendReservation = async (reservationData: any, location: string): Promise<boolean> => {
  const message: TelegramMessage = {
    type: 'reservation',
    location,
    data: reservationData,
    timestamp: new Date().toISOString(),
  };

  return await sendToTelegram(message);
};

/**
 * Send request data (e.g., call waiter, ask for bill)
 */
export const sendRequest = async (requestData: any, location: string): Promise<boolean> => {
  const message: TelegramMessage = {
    type: 'request',
    location,
    data: requestData,
    timestamp: new Date().toISOString(),
  };

  return await sendToTelegram(message);
};

/**
 * Send treat data (buying someone a drink/meal)
 */
export const sendTreat = async (treatData: any, location: string): Promise<boolean> => {
  const message: TelegramMessage = {
    type: 'treat',
    location,
    data: treatData,
    timestamp: new Date().toISOString(),
  };

  return await sendToTelegram(message);
};

/**
 * Send feedback data
 */
export const sendFeedback = async (feedbackData: any, location: string): Promise<boolean> => {
  const message: TelegramMessage = {
    type: 'feedback',
    location,
    data: feedbackData,
    timestamp: new Date().toISOString(),
  };

  return await sendToTelegram(message);
};

/**
 * Send message directly to Telegram bot
 */
export const sendTelegramMessage = async (message: string, location?: string): Promise<boolean> => {
  try {
    let botToken: string;
    let chatId: string;

    // Use specific credentials based on location
    if (location === 'signature') {
      botToken = '7692102843:AAFXeNpZbHb868DIOeP0yzYiraj6QBfG5_U';
      chatId = '-4930029111';
    } else if (location === 'laiancu') {
      botToken = '8045482331:AAGB1llXwJvcOw5cz3EAFsEofLtT78W6aXs';
      chatId = '-4929170488';
    } else if (location === 'luckypizza') {
      botToken = '8062196654:AAFnYQXJtoaKO0hRZsFnT_dVG4UNdbTxdfI';
      chatId = '-4837887877';
    } else {
      // Default credentials for Studio 80
      botToken = '7201854497:AAFewdUbb2F_udHYZtjI1ApM6Ofm1XeW3f8';
      chatId = '-4973994275';
    }

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending to Telegram bot:', error);
    return false;
  }
};
