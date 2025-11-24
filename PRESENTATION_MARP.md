---
marp: true
theme: default
paginate: true
backgroundColor: #fff
style: |
  :root {
    --base-font-size: 18px;
    --title-size: calc(var(--base-font-size) * 1.8);
    --subtitle-size: calc(var(--base-font-size) * 1.3);
    --body-size: var(--base-font-size);
    --small-size: calc(var(--base-font-size) * 0.85);
    --tiny-size: calc(var(--base-font-size) * 0.7);
    --primary-blue: #1565C0;
    --secondary-blue: #2196F3;
    --dark-grey: #424242;
    --medium-grey: #757575;
    --light-grey: #E0E0E0;
    --accent-blue: #0D47A1;
  }
  section {
    font-size: var(--body-size);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: var(--dark-grey);
    background-color: #fff;
  }
  h1 {
    font-size: var(--title-size);
    color: var(--primary-blue);
    border-bottom: 3px solid var(--secondary-blue);
    padding-bottom: 0.3em;
  }
  h2 {
    font-size: var(--subtitle-size);
    color: var(--accent-blue);
  }
  h3 {
    font-size: calc(var(--base-font-size) * 1.1);
    color: var(--medium-grey);
  }
  code {
    font-size: var(--small-size);
    background-color: var(--light-grey);
    padding: 0.1em 0.3em;
    border-radius: 3px;
  }
  table {
    font-size: var(--small-size);
    border-collapse: collapse;
  }
  table th {
    background-color: var(--primary-blue);
    color: white;
    padding: 0.5em;
  }
  table td {
    border: 1px solid var(--light-grey);
    padding: 0.5em;
  }
  .small {
    font-size: var(--small-size);
  }
  .tiny {
    font-size: var(--tiny-size);
  }
  .highlight {
    background-color: var(--light-grey);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    border-left: 4px solid var(--secondary-blue);
  }
  .success {
    color: var(--primary-blue);
    font-weight: bold;
  }
  .status-live {
    color: var(--primary-blue);
    font-weight: bold;
  }
  .status-pending {
    color: var(--medium-grey);
    font-weight: bold;
  }
  ul, ol {
    line-height: 1.6;
  }
  strong {
    color: var(--accent-blue);
  }
---

# AI-Powered Food Ordering

**Making food ordering as easy as conversation**

Order food naturally through ChatGPT - no app switching, no forms

<div class="small">

**Status:** Live & Ready to Scale
**Goal:** Default ChatGPT Integration

</div>

---

## The Problem

### Users face friction in food ordering

- **Multiple apps** required (Uber Eats, DoorDash, Grubhub)
- **Context switching** between chat and ordering apps
- **Repetitive forms** for every order
- **No conversational** interface

### The Opportunity

<div class="highlight">70% of users already use ChatGPT daily</div>

**Vision:** Order food where users already are - in ChatGPT

---

## Three Approaches

| Approach | Experience | Setup | Availability | Interactive UI |
|----------|-----------|-------|--------------|----------------|
| **Custom GPT** | Conversational | Low | Public | No |
| **GPT + Web App** | Hybrid | Low | Public | External |
| **MCP Connector** | Conversational + Visual | Medium | Organization | In ChatGPT |

<div class="small">

**Custom GPT:** Quick MVP, text-only, works now
**GPT + Web App:** Redirect to visual interface, immediate deployment
**MCP Connector:** Future-ready, interactive UI in ChatGPT, waiting for public access

</div>

---

## Approach 1: Custom GPT

### Architecture

**User in ChatGPT** → **Custom GPT** → **API Actions** → **Backend API** → **Restaurant Data**

### Intelligent Query Processing

**Complex requests handled naturally:**
- "Tandoori Chicken from an Indian restaurant"
- "Pick my favorite Italian restaurant, order my favorite"
- "I'm hungry, get me something spicy in 15 minutes"
- "Something Italian under $5, delivered in 10 minutes"

**AI understands:** Cuisine, price, time, preferences, favorites

<div class="status-live">LIVE: Ready to publish to GPT Store</div>

---

## Approach 2: GPT + Web App

### Architecture

**User in ChatGPT** → **Custom GPT** → **Directs to Web App** → **User clicks link** → **React Web App** → **Backend API**

### Key Features

- Visual menu browsing with photos
- Restaurant cards with ratings
- Real-time cart management
- Familiar e-commerce UI
- Works without ChatGPT Plus

<div class="status-live">LIVE: Deployed and accessible</div>

**URL:** ai-food-ordering-app-ten.vercel.app

---

## Approach 3: MCP Connector

### Architecture

**User in ChatGPT** → **MCP Protocol** → **MCP Server** → **UI Widget** → **Renders in ChatGPT** → **Backend API**

### Key Features

<div class="highlight">Interactive UI renders INSIDE ChatGPT</div>

- Real clickable buttons with smart filtering
- Restaurant cards with photos
- Complex query processing (price, time, cuisine, favorites)
- No page switching, best user experience

<div class="status-pending">DEPLOYED: Waiting for public MCP access</div>

---


## Deployment & Growth Strategy

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2em;">

<div>

### Phase 1: GPT Store (Now)
- Reach: 200M+ ChatGPT users
- Discoverable in search
- Free to publish
- ChatGPT Plus required

### Phase 2: MCP Registry (Q2-Q3 2025)
- Automatic discovery
- One-click enable
- Default ChatGPT integration

</div>

<div>

### Path to Default Integration

**Featured GPT (6-12 months)**
- 10K+ users, 4.7+ rating
- OpenAI approval

**Partnership (12+ months)**
- 50K+ users, $10K+ revenue
- Strategic value

<div class="status-live">Already built - first-mover advantage</div>

</div>

</div>

---

## 12-Month Roadmap

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2em;">

<div>

### Month 1-3: Launch
- Publish to GPT Store
- Deploy MCP connector
- Reach 100 users

### Month 4-6: Grow
- 1,000 users, 4.6+ rating
- Add 5 cities, 50 restaurants
- Begin monetization

</div>

<div>

### Month 7-9: Scale
- 10,000 users, $5K revenue
- Restaurant partnerships
- 20 cities, 200 restaurants

### Month 10-12: Partner
- 50,000 users, $50K revenue
- MCP public registry
- OpenAI partnership talks

</div>

</div>

---

## Success Metrics & Next Steps

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2em;">

<div>

### Key Metrics
**User:** MAU, Engagement, Retention
**Business:** MRR, AOV, Commission
**Quality:** 4.7+ rating, NPS, 99.9% uptime

<div class="highlight">Goal: 50K users, $50K MRR by Month 12</div>

### GPT Store Publishing
1. Optimize name and description
2. Set access to "Everyone"
3. Test end-to-end flows
4. Submit to GPT Store
5. Wait 1-3 days for approval
6. Launch and market

</div>

<div>

### Immediate Actions

**This Week**
- Review GPT description
- Create profile image
- Test end-to-end
- Publish to GPT Store

**Month 1**
- GPT Store approval
- Create demo video
- Social media launch
- Reach 100 users
- Deploy MCP

</div>

</div>

---

## Business Model & Advantages

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2em;">

<div>

### Revenue Streams

**Commission (Primary)**
- 10-15% per order
- Volume-based tiers

**Restaurant Subscriptions**
- Basic: $/mo
- Pro: $/mo
- Enterprise: $/mo

**Target:** $50K MRR by Month 12

</div>

<div>

### Competitive Advantages

1. **First-mover** in ChatGPT food ordering
2. **Intelligent queries** - understands complex requests
3. **Native integration** - no app switching
4. **Already deployed** - ready to scale
5. **Future-proof** - MCP ready

### Market Opportunity
- 200M+ ChatGPT users
- $150B food delivery market
- AI-powered personalization

</div>

</div>

---

## Risk Mitigation

### Market Risks (Primary Focus)
- **User adoption:** Low-friction onboarding, free to start
- **Restaurant partnerships:** Strong value proposition, commission-based
- **OpenAI changes:** Diversified approach (3 implementations)

### Business Risks
- **Competition:** First-mover advantage, already deployed
- **Monetization:** Multiple revenue streams (commission + subscriptions)
- **Regulations:** Compliance framework in place

### Technical Risks (Low Priority)
- **API limits:** Caching and rate limiting
- **Scaling:** Serverless auto-scales
- **Downtime:** 99.9% SLA monitoring

<div class="small">Strategy: Focus on market validation first, technical challenges are manageable</div>

---


## Demo & Vision

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2em;">

<div>

### Live Demo
1. Custom GPT: Conversational ordering
2. Web App: Visual browsing
3. Backend API: Live endpoints

### Current Status
- Working Custom GPT
- Interactive web app
- MCP connector deployed
- Ready to publish

</div>

<div>

### The Vision

**"Order food as naturally as asking for information"**

No apps. No forms. Just conversation.

### What's Next
- Publish to GPT Store (this week)
- Market to early adopters
- Grow to 10K users (6 months)
- OpenAI partnership (12 months)

</div>

</div>

---

## Questions & Resources

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2em;">

<div>

### Technical Stack
**Frontend:** React 18.3, TypeScript, Vite, Tailwind CSS
**Backend:** FastAPI (Python), Vercel serverless
**MCP:** Node.js 20+, MCP SDK 1.22

### Production URLs
- Web: `ai-food-ordering-app-ten.vercel.app`
- API: `ai-food-ordering-poc.vercel.app`
- MCP: `ai-food-ordering-app-ten.vercel.app/api/mcp`

</div>

<div>

### Documentation
- MCP Setup Guide
- Deployment Strategy
- GPT Instructions

### GitHub
`github.com/premkalyan/ai-food-ordering-app`

### OpenAI
- Partnerships: `partnerships@openai.com`
- GPT Store: `help.openai.com`

</div>

</div>

---

# Thank You

**Let's make food ordering conversational**

<div style="text-align: center; padding: 2em;">

Ready to launch?

Questions?

Let's discuss

</div>

