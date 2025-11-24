# 📊 Presentation Guide

## Two Presentation Formats Available

### 1. **AI_FOOD_ORDERING_PRESENTATION.md** (Comprehensive Document)
- **Format:** Markdown document
- **Use case:** Deep dive, documentation, reference
- **Length:** 1,512 lines, 14 detailed slides
- **Audience:** Technical teams, detailed review
- **Best for:** Reading, documentation, comprehensive understanding

### 2. **PRESENTATION_MARP.md** (Slide Deck) ⭐ **NEW**
- **Format:** Marp presentation (renders as slides)
- **Use case:** Live presentations, stakeholder demos
- **Length:** 25 crisp slides
- **Audience:** Executives, investors, quick demos
- **Best for:** Presenting, pitching, meetings

---

## Using the Marp Presentation

### What is Marp?

Marp is a markdown-based presentation tool that converts markdown to beautiful slides.

### Installation & Setup

#### Option 1: VS Code Extension (Recommended)

1. **Install Marp Extension:**
   - Open VS Code
   - Go to Extensions (Cmd+Shift+X)
   - Search for "Marp for VS Code"
   - Install by Marp Team

2. **Open Presentation:**
   - Open `PRESENTATION_MARP.md` in VS Code
   - Click "Open Preview to the Side" (Cmd+K V)
   - See live slide preview

3. **Present:**
   - Click "Open in Browser" in preview
   - Use arrow keys to navigate
   - Press F11 for fullscreen

#### Option 2: Marp CLI

```bash
# Install Marp CLI
npm install -g @marp-team/marp-cli

# Convert to HTML
marp PRESENTATION_MARP.md -o presentation.html

# Convert to PDF
marp PRESENTATION_MARP.md -o presentation.pdf

# Convert to PowerPoint
marp PRESENTATION_MARP.md -o presentation.pptx

# Watch mode (auto-refresh)
marp -w PRESENTATION_MARP.md
```

#### Option 3: Online (No Installation)

1. Go to https://web.marp.app/
2. Copy contents of `PRESENTATION_MARP.md`
3. Paste into editor
4. Present directly from browser

---

## Font System

### Global Font Hierarchy

The presentation uses a **relative font sizing system** based on a 28px base:

```css
Base Font:     28px  (body text)
Title:         50px  (1.8x base)
Subtitle:      36px  (1.3x base)
Small:         24px  (0.85x base)
Tiny:          20px  (0.7x base)
```

### Why This System?

- **Consistent scaling:** All fonts scale together
- **Easy adjustments:** Change base size, everything scales
- **Professional look:** Harmonious proportions
- **Accessibility:** Readable at any screen size

### Customizing Font Size

To change the overall size, edit the `--base-font-size` in the style section:

```css
:root {
  --base-font-size: 28px;  /* Change this value */
}
```

**Recommendations:**
- **Large room:** 32px base
- **Small room:** 28px base (default)
- **Online meeting:** 24px base

---

## Slide Navigation

### Keyboard Shortcuts

- **Next slide:** → (right arrow) or Space
- **Previous slide:** ← (left arrow)
- **First slide:** Home
- **Last slide:** End
- **Fullscreen:** F11
- **Exit fullscreen:** Esc

### Slide Structure

```
Total: 25 slides

1-2:    Problem & Vision
3-5:    Approaches (Custom GPT, MCP)
6-7:    Technical Stack
8-9:    Deployment Strategy
10-11:  Roadmap & Metrics
12-13:  Publishing & Next Steps
14-17:  Monetization & Advantages
18-20:  Team & Investment
21:     Demo
22-23:  Takeaways & Vision
24-25:  Q&A & Thank You
```

---

## Presentation Tips

### For Live Demos

**Slide 21: Demo Time**
- Have tabs ready:
  1. Custom GPT in ChatGPT
  2. Web app: `ai-food-ordering-app-ten.vercel.app`
  3. API docs: `ai-food-ordering-poc.vercel.app/docs`
  4. MCP health: `ai-food-ordering-app-ten.vercel.app/api/mcp`

**Demo Flow:**
1. Show Custom GPT conversation (2 mins)
2. Show web app visual browsing (1 min)
3. Show API docs (30 secs)
4. Show MCP health check (30 secs)

### For Different Audiences

#### Executives (15 mins)
Focus on: Slides 1-2, 8-9, 10-11, 14-15, 22-23

#### Technical Teams (30 mins)
Focus on: Slides 3-7, 12-13, 17-20

#### Investors (20 mins)
Focus on: Slides 1-2, 8-9, 10-11, 14-16, 18-19, 22-23

#### Quick Pitch (5 mins)
Focus on: Slides 1-2, 8, 10, 22-23

---

## Exporting Options

### HTML (Best for Sharing)

```bash
marp PRESENTATION_MARP.md -o presentation.html
```

**Pros:**
- Interactive (clickable links)
- Works in any browser
- Small file size
- Easy to share via email/link

### PDF (Best for Printing)

```bash
marp PRESENTATION_MARP.md -o presentation.pdf
```

**Pros:**
- Universal compatibility
- Print-ready
- Easy to distribute
- Consistent rendering

### PowerPoint (Best for Editing)

```bash
marp PRESENTATION_MARP.md -o presentation.pptx
```

**Pros:**
- Editable in PowerPoint
- Add animations
- Customize further
- Corporate standard

---

## Customization

### Changing Colors

Edit the style section to change colors:

```css
h1 {
  color: #2196F3;  /* Blue - change to your brand color */
}
h2 {
  color: #FF9800;  /* Orange */
}
h3 {
  color: #4CAF50;  /* Green */
}
```

### Adding Your Logo

Add to the style section:

```css
section::after {
  content: '';
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 50px;
  background: url('your-logo.png') no-repeat;
  background-size: contain;
}
```

### Changing Theme

Replace the theme line:

```yaml
theme: default  # Options: default, gaia, uncover
```

---

## Troubleshooting

### Mermaid Diagrams Not Rendering

**Solution:** Ensure you're using Marp CLI or VS Code extension with Mermaid support.

```bash
# Install with Mermaid support
npm install -g @marp-team/marp-cli
```

### Fonts Look Wrong

**Solution:** Ensure the font is installed on your system or use web fonts.

```css
@import url('https://fonts.googleapis.com/css2?family=Segoe+UI&display=swap');
```

### Slides Too Small/Large

**Solution:** Adjust the base font size in the style section.

---

## Best Practices

### Do's ✅

- **Test beforehand:** Run through the entire presentation
- **Have backup:** Export to PDF in case of tech issues
- **Practice timing:** Aim for 1-2 minutes per slide
- **Use speaker notes:** Add notes in HTML comments
- **Check links:** Ensure all URLs work before presenting

### Don'ts ❌

- **Don't read slides:** Use them as talking points
- **Don't rush:** Give audience time to absorb
- **Don't skip demo:** It's the most compelling part
- **Don't ignore questions:** Address them or note for later
- **Don't go over time:** Respect the schedule

---

## Quick Start Checklist

### Before Presenting

- [ ] Install Marp extension or CLI
- [ ] Open `PRESENTATION_MARP.md`
- [ ] Preview slides
- [ ] Test navigation
- [ ] Check all links work
- [ ] Prepare demo tabs
- [ ] Export backup PDF
- [ ] Practice once through

### During Presentation

- [ ] Start with slide 1
- [ ] Maintain eye contact
- [ ] Use arrow keys to navigate
- [ ] Pause for questions
- [ ] Show live demo on slide 21
- [ ] End with Q&A

### After Presentation

- [ ] Share HTML/PDF version
- [ ] Follow up on questions
- [ ] Gather feedback
- [ ] Update slides based on feedback

---

## Resources

### Marp Documentation
- Official site: https://marp.app/
- VS Code extension: https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode
- CLI docs: https://github.com/marp-team/marp-cli

### Presentation Tips
- Slide design: https://www.canva.com/learn/presentation-design/
- Public speaking: https://www.toastmasters.org/

### Our Documentation
- `AI_FOOD_ORDERING_PRESENTATION.md` - Full detailed version
- `PRESENTATION_MARP.md` - This slide deck
- `DOCS_INDEX.md` - All documentation index

---

## Support

### Need Help?

**Technical Issues:**
- Check Marp documentation
- VS Code extension issues: GitHub issues
- Font/styling: Edit style section

**Content Questions:**
- Refer to `AI_FOOD_ORDERING_PRESENTATION.md`
- Check other docs in `DOCS_INDEX.md`

**Presentation Coaching:**
- Practice with colleagues
- Record yourself
- Get feedback

---

**Ready to present? Let's make food ordering conversational! 🚀**

