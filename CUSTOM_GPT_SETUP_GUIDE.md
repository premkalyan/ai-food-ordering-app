# 🚀 Custom GPT Setup Guide - Complete Instructions

## Overview

Custom GPT requires **TWO separate configurations:**

1. **Instructions** - How GPT should behave (≤8,000 characters)
2. **Actions** - API endpoints GPT can call (OpenAPI schema)

---

## Step 1: Create/Edit Your Custom GPT (2 minutes)

1. Go to ChatGPT: https://chatgpt.com
2. Click your profile → **"My GPTs"**
3. Click **"Create a GPT"** (or edit existing one)
4. Give it a name: **"AI Food Ordering Assistant"**
5. Add description: **"Order food using natural language with intelligent search"**

---

## Step 2: Add Instructions (3 minutes)

### What to Use:

**File:** `CUSTOM_GPT_INSTRUCTIONS_CONDENSED.md`  
**Character count:** ~2,400 (well under 8,000 limit)

### How to Add:

1. In GPT editor, click **"Configure"** tab
2. Find **"Instructions"** field
3. Copy **ALL content** from `CUSTOM_GPT_INSTRUCTIONS_CONDENSED.md`
4. Paste into Instructions field
5. ✅ Done!

### What This Does:

- Tells GPT when to use intelligentSearch vs standard flow
- Shows how to format responses
- Includes iframe integration for interactive UI
- Provides example conversations

---

## Step 3: Add Actions (5 minutes)

### What to Use:

**File:** `CUSTOM_GPT_ACTIONS_SCHEMA.json`  
**Format:** OpenAPI 3.1.0 schema

### How to Add:

1. In GPT editor, click **"Configure"** tab
2. Scroll to **"Actions"** section
3. Click **"Create new action"**
4. Click **"Import from URL"** OR **"Schema"**
5. Choose **"Schema"** option
6. Copy **ALL content** from `CUSTOM_GPT_ACTIONS_SCHEMA.json`
7. Paste into schema editor
8. Click **"Save"**

### What This Does:

GPT can now call these APIs:
- ✅ `getCities` - Get available cities
- ✅ `getCuisines` - Get cuisines by city
- ✅ `searchRestaurants` - Search by city + cuisine
- ✅ `intelligentSearch` - Natural language search
- ✅ `getMenu` - Get restaurant menu
- ✅ `createOrder` - Place order
- ✅ `trackOrder` - Track order status

---

## Step 4: Configure Action Settings (2 minutes)

After adding the schema:

1. **Authentication:** Select **"None"** (API is public)
2. **Privacy:** Select your preference
3. Click **"Save"**

---

## Step 5: Test Your GPT (10 minutes)

### Test 1: Intelligent Search
```
You: "Show me Indian food in New York"

Expected:
- GPT calls intelligentSearch API
- Shows text summary
- Shows iframe with interactive app
- You can click buttons OR type
```

### Test 2: Standard Flow
```
You: "I want to order food"

Expected:
- GPT calls getCities API
- Shows numbered list of cities
- You select city
- GPT calls getCuisines
- Continues flow
```

### Test 3: Complex Query
```
You: "Something spicy under $15 in 20 minutes"

Expected:
- GPT calls intelligentSearch with query
- Shows matching restaurants
- Shows suggested items
- Shows iframe
```

### Test 4: Menu View
```
You: "Show me the menu for restaurant 1"

Expected:
- GPT calls getMenu API
- Shows categorized menu
- Shows prices and tags
- Shows iframe
```

---

## Troubleshooting

### Issue: GPT Not Calling APIs

**Symptom:** GPT responds with generic text, doesn't call APIs

**Solution:**
1. Check Actions are saved correctly
2. Verify API URL: `https://ai-food-ordering-poc.vercel.app/api/v1`
3. Test API directly in browser
4. Check GPT instructions mention API calls

### Issue: iframe Not Showing

**Symptom:** No iframe in GPT responses

**Possible Causes:**
- ChatGPT may strip iframes (security)
- Instructions not followed

**Solutions:**
1. Check instructions are saved
2. Try asking explicitly: "Show me the interactive view"
3. Fall back to text-only version if needed

### Issue: Instructions Too Long

**Symptom:** Can't save instructions (>8,000 chars)

**Solution:**
- Use `CUSTOM_GPT_INSTRUCTIONS_CONDENSED.md` (2,400 chars)
- NOT the full version (9,465 chars)

### Issue: API Errors

**Symptom:** GPT says "API error" or "Can't connect"

**Solutions:**
1. Test API directly: `https://ai-food-ordering-poc.vercel.app/api/v1/cities`
2. Check Vercel deployment is live
3. Verify API endpoints in schema match actual endpoints

---

## File Reference

| File | Purpose | Size | Use For |
|------|---------|------|---------|
| `CUSTOM_GPT_INSTRUCTIONS_CONDENSED.md` | GPT Instructions | 2.4KB | ✅ Use this |
| `CUSTOM_GPT_ACTIONS_SCHEMA.json` | API Actions | 8KB | ✅ Use this |
| `CUSTOM_GPT_INSTRUCTIONS_WITH_IFRAME.md` | Full instructions | 9.5KB | ❌ Too long |
| `CUSTOM_GPT_INSTRUCTIONS_TEXT_ONLY.md` | Backup (no iframe) | 3.2KB | Backup only |

---

## Quick Checklist

**Setup:**
- [ ] Create/edit Custom GPT
- [ ] Add name and description
- [ ] Copy instructions from `CUSTOM_GPT_INSTRUCTIONS_CONDENSED.md`
- [ ] Paste into Instructions field
- [ ] Copy schema from `CUSTOM_GPT_ACTIONS_SCHEMA.json`
- [ ] Paste into Actions → Schema
- [ ] Set Authentication to "None"
- [ ] Save GPT

**Testing:**
- [ ] Test intelligent search: "Indian food in New York"
- [ ] Test standard flow: "I want to order food"
- [ ] Test complex query: "Spicy food under $15"
- [ ] Test menu view: "Show me the menu"
- [ ] Verify iframe appears (if supported)
- [ ] Complete full order flow

**If Issues:**
- [ ] Check API is live
- [ ] Verify schema is correct
- [ ] Test APIs directly in browser
- [ ] Check instructions are saved
- [ ] Try text-only version as backup

---

## Expected Behavior

### What GPT Will Do:

1. **Understand natural language:**
   - "I want tandoori chicken" → intelligentSearch
   - "Show me restaurants" → standard flow

2. **Call appropriate APIs:**
   - Complex queries → intelligentSearch
   - Simple browsing → getCities → getCuisines → searchRestaurants

3. **Show interactive UI:**
   - Text summary (always)
   - iframe with buttons (when appropriate)
   - Both options available

4. **Guide users:**
   - Numbered options
   - Clear next steps
   - Confirm before ordering

### What Users Can Do:

- ✅ Type natural language queries
- ✅ Click buttons in iframe (if supported)
- ✅ Browse step-by-step
- ✅ Complete full order flow
- ✅ Track orders

---

## Success Criteria

Your Custom GPT is working when:

- [ ] ✅ GPT calls APIs automatically
- [ ] ✅ Shows restaurant results
- [ ] ✅ Displays menus
- [ ] ✅ Can place orders
- [ ] ✅ Shows iframe (if ChatGPT supports it)
- [ ] ✅ Responds conversationally
- [ ] ✅ Handles errors gracefully

---

## Next Steps After Setup

1. **Test thoroughly** - Try all scenarios
2. **Share with team** - Get feedback
3. **Iterate** - Improve based on usage
4. **Monitor** - Check API logs for issues
5. **Enhance** - Add features as needed

---

## Support

**API Issues:**
- Check: `https://ai-food-ordering-poc.vercel.app/api/v1/cities`
- Logs: Vercel dashboard

**GPT Issues:**
- Test: Direct API calls
- Verify: Instructions and schema are saved
- Fallback: Use text-only version

**iframe Issues:**
- Test: `https://ai-food-ordering-app-ten.vercel.app/?embed=true`
- Note: ChatGPT may not support iframes yet
- Fallback: Text-only mode still works great

---

**Ready to set up? Start with Step 1!** 🚀

