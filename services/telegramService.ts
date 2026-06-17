import axios from 'axios';
import type {
  TelegramMessage,
  TelegramResponse,
  AmenityRequest,
  ServiceRequest,
} from '@/types/telegram';
import i18n from '@/i18n/config';

class TelegramService {
  private readonly botToken: string;
  private readonly baseUrl: string;
  private readonly chatId: string; // You'll need to set this to your chat/channel ID

  constructor() {
    this.botToken = process.env.EXPO_PUBLIC_API_STUDIO80_TOKEN || '';
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
    // You'll need to replace this with your actual chat ID
    // You can get this by sending a message to your bot and calling getUpdates
    this.chatId = process.env.EXPO_PUBLIC_TELEGRAM_CHAT_ID || '';

    if (!this.botToken) {
      console.warn('Telegram bot token not found in environment variables');
    }

    if (!this.chatId) {
      console.warn('Telegram chat ID not found in environment variables');
    }
  }

  /**
   * Send a message to the Telegram bot
   */
  async sendMessage(message: TelegramMessage): Promise<TelegramResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/sendMessage`,
        message,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      return {
        ok: true,
        result: response.data,
      };
    } catch (error: any) {
      console.error('Failed to send Telegram message:', error);

      if (error.response?.data) {
        return {
          ok: false,
          error_code: error.response.data.error_code,
          description: error.response.data.description,
        };
      }

      return {
        ok: false,
        description: error.message || 'Unknown error occurred',
      };
    }
  }

  /**
   * Send a waiter request notification
   */
  async sendServiceRequest(
    serviceRequest: ServiceRequest
  ): Promise<TelegramResponse> {
    // Try to find group by restaurant name first
    const groupChatId = await this.findGroupByName(
      serviceRequest.restaurantName
    );
    const targetChatId = groupChatId || this.chatId;

    const message = this.formatServiceMessage(serviceRequest);

    return this.sendMessage({
      chat_id: targetChatId,
      text: message,
      parse_mode: 'HTML',
    });
  }

  /**
   * Send an amenity request notification
   */
  async sendAmenityRequest(
    amenityRequest: AmenityRequest
  ): Promise<TelegramResponse> {
    // Try to find group by restaurant name first
    const groupChatId = await this.findGroupByName(
      amenityRequest.restaurantName
    );
    const targetChatId = groupChatId || this.chatId;

    const message = this.formatAmenityMessage(amenityRequest);

    return this.sendMessage({
      chat_id: targetChatId,
      text: message,
      parse_mode: 'HTML',
    });
  }

  /**
   * Find Telegram group by name matching restaurant name
   */
  async findGroupByName(restaurantName: string): Promise<string | null> {
    try {
      // Get all updates to find groups
      const response = await axios.get(`${this.baseUrl}/getUpdates`, {
        timeout: 5000,
      });

      if (!response.data.ok) {
        return null;
      }

      const updates = response.data.result;

      // Look for groups that match the restaurant name
      for (const update of updates) {
        if (
          update.message?.chat?.type === 'group' ||
          update.message?.chat?.type === 'supergroup'
        ) {
          const groupTitle = update.message.chat.title;
          const chatId = update.message.chat.id.toString();

          // Check if group name matches restaurant name (case-insensitive)
          if (
            groupTitle &&
            groupTitle.toLowerCase().includes(restaurantName.toLowerCase())
          ) {
            console.log(
              `Found matching group: ${groupTitle} (${chatId}) for restaurant: ${restaurantName}`
            );
            return chatId;
          }
        }
      }

      console.warn(`No group found for restaurant: ${restaurantName}`);
      return null;
    } catch (error) {
      console.error('Error finding group by name:', error);
      return null;
    }
  }

  /**
   * Get all groups the bot is part of
   */
  async getAllGroups(): Promise<
    Array<{ id: string; title: string; type: string }>
  > {
    try {
      const response = await axios.get(`${this.baseUrl}/getUpdates`, {
        timeout: 5000,
      });

      if (!response.data.ok) {
        return [];
      }

      const updates = response.data.result;
      const groups = new Map();

      // Extract unique groups from updates
      for (const update of updates) {
        if (
          update.message?.chat?.type === 'group' ||
          update.message?.chat?.type === 'supergroup'
        ) {
          const chat = update.message.chat;
          groups.set(chat.id, {
            id: chat.id.toString(),
            title: chat.title,
            type: chat.type,
          });
        }
      }

      return Array.from(groups.values());
    } catch (error) {
      console.error('Error getting all groups:', error);
      return [];
    }
  }

  /**
   * Test message sending to a specific group
   */
  async testGroupMessage(groupName: string): Promise<TelegramResponse> {
    const groupChatId = await this.findGroupByName(groupName);

    if (!groupChatId) {
      return {
        ok: false,
        description: `Group not found: ${groupName}`,
      };
    }

    return this.sendMessage({
      chat_id: groupChatId,
      text: `🧪 Test message pentru grupul: ${groupName}`,
      parse_mode: 'HTML',
    });
  }

  /**
   * Format the waiter request message
   */
  private formatServiceMessage(request: ServiceRequest): string {
    // const tableInfo = request.tableNumber ? `\n📋 <b>${i18n.t('telegram.table')}:</b> ${request.tableNumber}` : '';

    const requestType =
      request.type === 'waiter'
        ? i18n.t('telegram.requestWaiter')
        : request.type === 'bill'
        ? i18n.t('telegram.requestBill')
        : i18n.t('telegram.requestService');

    const clientMessage =
      request.type === 'waiter'
        ? i18n.t('telegram.clientRequestedWaiter')
        : request.type === 'bill'
        ? i18n.t('telegram.clientRequestedBill')
        : i18n.t('telegram.clientRequestedService');

    return `
🔔 <b>${i18n.t('telegram.request')} ${requestType}</b>

🏪 <b>${i18n.t('telegram.restaurant')}:</b> ${request.restaurantName}
🆔 <b>${i18n.t('telegram.restaurantId')}:</b> ${request.restaurantId}
⏰ <b>${i18n.t('telegram.time')}:</b> ${request.timestamp}

${clientMessage}
    `.trim();
  }

  /**
   * Format the amenity request message
   */
  private formatAmenityMessage(request: AmenityRequest): string {
    // const tableInfo = request.tableNumber ? `\n📋 <b>${i18n.t('telegram.table')}:</b> ${request.tableNumber}` : '';

    return `
🛎️ <b>${i18n.t('telegram.serviceRequest')}</b>

🏪 <b>${i18n.t('telegram.restaurant')}:</b> ${request.restaurantName}
🆔 <b>${i18n.t('telegram.restaurantId')}:</b> ${request.restaurantId}
⏰ <b>${i18n.t('telegram.time')}:</b> ${request.timestamp}
🔧 <b>${i18n.t('telegram.service')}:</b> ${request.amenityName}

${i18n.t('telegram.clientRequestedThisService')}
    `.trim();
  }

  /**
   * Test the bot connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/getMe`, {
        timeout: 5000,
      });

      return response.data.ok === true;
    } catch (error) {
      console.error('Telegram bot connection test failed:', error);
      return false;
    }
  }

  /**
   * Get bot info
   */
  async getBotInfo(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/getMe`);
      return response.data.result;
    } catch (error) {
      console.error('Failed to get bot info:', error);
      return null;
    }
  }

  /**
   * Debug: List all available groups
   */
  async listAvailableGroups(): Promise<void> {
    console.log('🔍 Scanning for available Telegram groups...');
    const groups = await this.getAllGroups();

    if (groups.length === 0) {
      console.log('❌ No groups found. Make sure:');
      console.log('   1. Bot is added to groups');
      console.log('   2. Messages have been sent in the groups');
      console.log('   3. Bot has necessary permissions');
      return;
    }

    console.log(`✅ Found ${groups.length} group(s):`);
    groups.forEach((group, index) => {
      console.log(
        `   ${index + 1}. "${group.title}" (ID: ${group.id}, Type: ${
          group.type
        })`
      );
    });
  }
}

// Export a singleton instance
export const telegramService = new TelegramService();
export default telegramService;
