# 🔌 MCP Connector Setup Guide

## Prerequisites

### Account Requirements
- ✅ ChatGPT **Business**, **Enterprise**, or **Education** plan
- ❌ Not available for Plus or Free plans
- ✅ Developer Mode enabled by admin

---

## Step 1: Request Developer Mode Access

### Send This to Your Admin

```
Subject: Request for ChatGPT Developer Mode Access

Hi [Admin Name],

I've built an MCP connector for our food ordering system that integrates 
with ChatGPT. I need Developer Mode enabled to test and deploy it.

Connector Details:
- Name: Food Ordering MCP
- Server URL: https://ai-food-ordering-app-ten.vercel.app/api/mcp
- Purpose: AI-powered food ordering with interactive UI
- Authentication: None (public demo)
- Actions: Search restaurants, view menus, create orders
- Safety: Read-only operations with user confirmation for orders

Reference Documentation:
https://help.openai.com/en/articles/12584461

Can you enable Developer Mode for my account? I'll test it first 
before requesting organization-wide publishing.

Thanks!
```

### What Admin Needs to Do

**For Business Plans:**
1. Go to **Workspace Settings → Permissions & Roles**
2. Enable **"Connected Data Developer Mode"**
3. Grant access to your user account

**For Enterprise/Education Plans:**
1. Go to **Workspace Settings → RBAC**
2. Create or update role with Developer Mode permissions
3. Assign role to your user account

---

## Step 2: Enable Developer Mode

Once admin grants access:

1. Open **ChatGPT**
2. Click your **profile** (bottom left)
3. Go to **Settings**
4. Navigate to **Apps & Connectors**
5. Click **Advanced Settings**
6. Toggle **"Developer mode"** to **ON**

✅ You should see a confirmation message.

---

## Step 3: Create MCP Connector

### In ChatGPT:

1. Go to **Settings → Apps & Connectors**
2. Click on **Connectors** section
3. Look for **"Create connector"** or **"Add custom connector"** button
4. Click it

### Fill in Connector Details:

```
Name: Food Ordering

Endpoint URL: https://ai-food-ordering-app-ten.vercel.app/api/mcp

Description: Interactive food ordering system with AI. Browse restaurants, 
view menus, and place orders through natural conversation with visual UI.

Authentication: None
```

5. Click **"Create"** or **"Save"**

✅ Connector is now in **draft mode** (only you can see it).

---

## Step 4: Test the Connector

### In ChatGPT:

1. Open a **new chat** (not Custom GPT)
2. Click the **"+"** button (next to message input)
3. Click **"More"** in the popup
4. Find and select **"Food Ordering"** from the list
5. The connector is now active for this chat

### Test Scenarios:

**Test 1: Browse Cities**
```
You: "What cities do you deliver to?"

Expected: GPT calls get_cities tool, shows list of 5 cities
```

**Test 2: Search Restaurants**
```
You: "Show me Indian restaurants in Bangalore"

Expected: GPT calls search_restaurants tool, displays restaurant cards
```

**Test 3: View Menu**
```
You: "Show me the menu for Spice Garden"

Expected: GPT calls get_menu tool, displays menu with categories
```

**Test 4: Place Order**
```
You: "I want to order Butter Chicken and Garlic Naan"

Expected: GPT collects details, shows confirmation modal, creates order
```

### What to Look For:

- ✅ Tools are being called (you'll see "Using Food Ordering" indicator)
- ✅ Structured data is returned
- ✅ Interactive UI components appear (if supported)
- ✅ Confirmation modals for write actions (create order)
- ✅ Error handling works gracefully

---

## Step 5: Iterate and Improve

### If Issues Occur:

1. **Check MCP Server Logs**:
   ```bash
   vercel logs --project=ai-food-ordering-app
   ```

2. **Test MCP Endpoint**:
   ```bash
   curl https://ai-food-ordering-app-ten.vercel.app/api/mcp
   ```

3. **Use MCP Inspector**:
   ```bash
   npx @modelcontextprotocol/inspector@latest \
     https://ai-food-ordering-app-ten.vercel.app/api/mcp
   ```

### Common Issues:

| Issue | Solution |
|-------|----------|
| Connector not appearing | Refresh ChatGPT, check Developer Mode is ON |
| Tools not being called | Verify MCP endpoint is accessible |
| 404 errors | Check Vercel deployment status |
| Timeout errors | Check MCP server response time |

---

## Step 6: Request Publishing (Optional)

Once testing is successful and you want to make it available to your entire organization:

### Send This to Admin:

```
Subject: Request to Publish Food Ordering MCP Connector

Hi [Admin Name],

I've successfully tested the Food Ordering MCP connector and it's working well.
Can you please publish it to make it available for the entire workspace?

Connector Name: Food Ordering
Status: Tested and verified
Safety: All write actions require user confirmation

This will allow everyone in our organization to use the AI food ordering system.

Thanks!
```

### What Admin Does:

1. Go to **Workspace Settings → Connectors**
2. Find your connector in draft connectors
3. Click **"Review"**
4. Verify safety and functionality
5. Click **"Publish"**

✅ Connector now appears in workspace's approved connectors list.

---

## Step 7: Organization-Wide Access

Once published:

### For All Users:

1. Open ChatGPT
2. Settings → Apps & Connectors → Connectors
3. **"Food Ordering"** appears in approved connectors
4. Click to enable it
5. Use in any chat by selecting it from "+" menu

### No Developer Mode Required:

Regular users don't need Developer Mode to **use** published connectors, only to **create** them.

---

## 🎯 Quick Reference

### MCP Server Details

```
Production URL: https://ai-food-ordering-app-ten.vercel.app/api/mcp
Health Check: https://ai-food-ordering-app-ten.vercel.app/api/mcp
Status: ✅ Running

Tools Available:
1. get_cities - List available cities
2. get_cuisines - List cuisine types
3. search_restaurants - Find restaurants
4. get_menu - Get restaurant menu
5. create_order - Place food order
```

### Testing Commands

```bash
# Test MCP endpoint
curl https://ai-food-ordering-app-ten.vercel.app/api/mcp

# Test with MCP Inspector
npx @modelcontextprotocol/inspector@latest \
  https://ai-food-ordering-app-ten.vercel.app/api/mcp

# View Vercel logs
vercel logs --project=ai-food-ordering-app

# Check deployment status
vercel ls --project=ai-food-ordering-app
```

---

## 📊 Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| MCP Server | ✅ Live | https://ai-food-ordering-app-ten.vercel.app/api/mcp |
| Web App | ✅ Live | https://ai-food-ordering-app-ten.vercel.app |
| Backend API | ✅ Live | https://ai-food-ordering-poc.vercel.app/api/v1 |
| Custom GPT | ✅ Working | (Your Custom GPT) |
| MCP Connector | ⏸️ Pending | Waiting for Developer Mode |

---

## 🔒 Security & Privacy

### Current Setup:
- ✅ No authentication required (public demo)
- ✅ No personal data stored
- ✅ Mock data only
- ✅ User confirmation for orders

### For Production:
- 🔄 Add OAuth authentication
- 🔄 Implement user sessions
- 🔄 Connect to real payment gateway
- 🔄 Add data encryption
- 🔄 Implement rate limiting

---

## ⚠️ Important Notes

### Limitations:
1. **Cannot update published connectors** - Must recreate and republish
2. **Beta feature** - Expect changes and improvements
3. **Write actions** - Always show confirmation modals
4. **Organization-only** - Not available to public users (yet)

### Best Practices:
1. ✅ Test thoroughly in draft mode
2. ✅ Verify all tools work correctly
3. ✅ Test error scenarios
4. ✅ Document for users
5. ✅ Monitor usage and feedback

---

## 🎉 Success Criteria

Your MCP connector is working when:

- ✅ Connector appears in ChatGPT
- ✅ Tools are called successfully
- ✅ Data is returned correctly
- ✅ UI components render (if applicable)
- ✅ Orders can be placed
- ✅ Error handling works
- ✅ Users can complete full ordering flow

---

## 📚 Additional Resources

- **OpenAI Help**: https://help.openai.com/en/articles/12584461
- **MCP SDK Docs**: https://github.com/modelcontextprotocol/sdk
- **Apps SDK Guide**: https://developers.openai.com/apps-sdk
- **Vercel Docs**: https://vercel.com/docs

---

## 🆘 Troubleshooting

### Connector Not Appearing
1. Verify Developer Mode is enabled
2. Refresh ChatGPT (Cmd/Ctrl + R)
3. Check admin has granted permissions
4. Try different browser

### Tools Not Working
1. Test MCP endpoint directly
2. Check Vercel deployment logs
3. Verify API backend is running
4. Use MCP Inspector to debug

### Timeout Errors
1. Check MCP server response time
2. Verify Vercel function limits
3. Optimize API calls
4. Add caching if needed

---

## 📞 Support

If you encounter issues:

1. Check Vercel deployment status
2. Review server logs
3. Test with MCP Inspector
4. Contact workspace admin
5. Refer to OpenAI documentation

---

**You're ready to deploy your MCP connector!** 🚀

Once Developer Mode is enabled, follow these steps and you'll have 
interactive food ordering inside ChatGPT in minutes!

