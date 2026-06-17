# Telegram Group Setup for Restaurant-Specific Notifications

## 🎯 **Goal: Send Messages to Groups Based on Restaurant Name**

The bot will automatically find and send messages to Telegram groups that match your restaurant names.

## 📋 **Setup Process**

### **Step 1: Create Groups for Each Restaurant**

For each restaurant in your app:

1. **Create a new Telegram group**
2. **Name it EXACTLY like your restaurant** (case-insensitive matching)

   - ✅ Good: "Arena24 Downtown" (matches location.name)
   - ✅ Good: "Restaurant Otopeni" (matches location.name)
   - ❌ Bad: "Arena24 Staff Chat" (doesn't match location.name)

3. **Add your bot to the group**

   - Make the bot an admin (required for sending messages)
   - Grant "Send Messages" permission

4. **Add restaurant staff** to the group

### **Step 2: Activate Groups (Important!)**

For the bot to find groups, **someone must send at least one message** in each group:

1. **Send a message** in each group (any message works)
2. **Mention the bot** (optional): @your_bot_name
3. This ensures the group appears in bot's update history

### **Step 3: Test Group Detection**

Add this to your app for testing:

```typescript
import telegramService from "@/services/telegramService";

// List all available groups
await telegramService.listAvailableGroups();

// Test specific restaurant
await telegramService.testGroupMessage("Arena24 Downtown");
```

## 🔍 **How It Works**

### **Automatic Group Matching:**

```typescript
// When a waiter is requested:
// 1. location.name = "Arena24 Downtown"
// 2. Bot searches for groups containing "Arena24 Downtown"
// 3. Finds group "Arena24 Downtown Staff" → Match!
// 4. Sends message to that group
```

### **Fallback System:**

- ✅ **Group found**: Message sent to restaurant-specific group
- ❌ **No group found**: Message sent to default chat (EXPO_PUBLIC_TELEGRAM_CHAT_ID)

## 🛠️ **Manual Method: Get Group Chat IDs**

If you prefer manual configuration:

### **Method 1: Browser**

1. Send a message in your group
2. Visit: `https://api.telegram.org/bot8325243153:AAFcieO71Y17BUB_O81jv5IRq6yuTkL_HiY/getUpdates`
3. Find your group in the response:

```json
{
  "message": {
    "chat": {
      "id": -1001234567890,    ← GROUP CHAT ID
      "title": "Arena24 Downtown",
      "type": "supergroup"
    }
  }
}
```

### **Method 2: Using the Service**

```typescript
// Get all groups
const groups = await telegramService.getAllGroups();
console.log(groups);

// Output:
// [
//   { id: "-1001234567890", title: "Arena24 Downtown", type: "supergroup" },
//   { id: "-1001234567891", title: "Restaurant Otopeni", type: "group" }
// ]
```

## ✅ **Testing Checklist**

### **Before Testing:**

- [ ] Groups created with exact restaurant names
- [ ] Bot added to all groups as admin
- [ ] At least one message sent in each group
- [ ] Bot has "Send Messages" permission

### **Test Commands:**

```typescript
// 1. List all available groups
await telegramService.listAvailableGroups();

// 2. Test specific restaurant group
await telegramService.testGroupMessage("Your Restaurant Name");

// 3. Test waiter request (end-to-end)
await telegramService.sendWaiterRequest({
  restaurantName: "Arena24 Downtown",
  restaurantId: 1,
  timestamp: new Date().toLocaleString("ro-RO"),
});
```

## 🚨 **Troubleshooting**

### **"No groups found"**

- ✅ Make sure bot is added to groups
- ✅ Send at least one message in each group
- ✅ Check bot has admin permissions

### **"Group not found for restaurant"**

- ✅ Check group name matches location.name exactly
- ✅ Try partial matching (group contains restaurant name)
- ✅ Check case sensitivity (matching is case-insensitive)

### **Message not delivered**

- ✅ Verify bot is admin in the group
- ✅ Check "Send Messages" permission is enabled
- ✅ Ensure group is active (recent messages)

## 🎯 **Example Setup**

### **Your Restaurants:**

- Restaurant 1: "Arena24 Downtown"
- Restaurant 2: "Arena24 Airport"
- Restaurant 3: "Restaurant Otopeni"

### **Telegram Groups to Create:**

- Group 1: "Arena24 Downtown"
- Group 2: "Arena24 Airport"
- Group 3: "Restaurant Otopeni"

### **How Messages Route:**

```
Waiter request from "Arena24 Downtown" → "Arena24 Downtown" group
Waiter request from "Arena24 Airport" → "Arena24 Airport" group
Waiter request from "Restaurant Otopeni" → "Restaurant Otopeni" group
```

Perfect! Now your bot automatically sends waiter requests to the right restaurant group! 🚀
