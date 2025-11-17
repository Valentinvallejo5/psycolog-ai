## 🎨 psicolog.ia – Design Guidelines

### Brand voice and tone

#### Voice traits

- Warm and empathetic, like a caring friend
- Non-judgmental, avoids heavy clinical labels
- Simple and supportive, short and clear
- Bilingual by default, fully natural Spanish and English

#### Tone examples by context

| Context           | Tone Style                              |
| ----------------- | --------------------------------------- |
| Homepage          | Calm, hopeful, welcoming                |
| Dashboard         | Safe, reassuring, clear choices         |
| Chat responses    | Matches user sliders (tone and mood)    |
| Panic help screen | Very grounding, concrete, slow and soft |
| Meditation screen | Spacious, gentle, present               |
| Error messages    | Reassuring, gentle                      |
| FAQs and pricing  | Clear, friendly, transparent            |

---

### Color, typography, spacing

#### Color palette

- **Primary:** `#C9A6FF` – soft lavender (main buttons, sliders, key CTAs)
- **Accent:** `#FFD8F2` – light pink (background accents, hover states)
- **Backgrounds:** `#FFFFFF` and `#F8F7FC` – clean and subtle
- **Text:** `#1A1A1A` – strong contrast, accessible
- **Supportive green (optional):** `#B6E3C8` – success / calm states

All colors must keep good contrast for body text and important UI elements.

#### Typography

- **Fonts:** `Inter` or `Nunito`
- **Sizes:**
  - Body: 14–16 px
  - Headings: 24–32 px
- **Weights:** 400, 600, 700
- **Line height:** 1.5 for readability

#### Spacing system

- 4 px baseline grid
- Common spacing tokens: 8, 16, 24, 32 px
- Max content width for text blocks: ~640 px on mobile/desktop

---

### Layout best practices

#### General layout rules

- Mobile-first design
- Vertical stacks on small screens, avoid permanent sidebars
- Card-first UI:
  - Dashboard shows three main cards: Chat, Panic Help, Guided Meditation
- Clear separation between:
  - Marketing area (homepage, pricing)
  - Safe space (dashboard, chat, panic, meditation)

Use whitespace generously to create a calm and breathable interface.

#### Panic help and meditation screens

- Each screen should feel like a **safe room**:
  - Soft background (`#F8F7FC` or white)
  - Centered content with clear hierarchy:
    - Title
    - Short paragraph explaining what will happen
    - Embedded YouTube player inside a rounded card
    - Small disclaimer text at the bottom (especially on panic help)

- YouTube player:
  - Full width container with fixed aspect ratio (16:9)
  - Rounded corners, no harsh borders
  - No extra clutter around the player

---

### Core UI components

The design system should include:

- `Button` (primary, secondary, ghost)
- `Input` (email, password)
- `Card` (dashboard options, pricing, testimonials, features)
- `ChatBubble` (AI and user messages)
- `Slider` (tone, mood, advice mode)
- `LanguageToggle` (EN/ES)
- `Modal` (upgrade prompts when limits are reached)
- `Badge` or small label for “Premium” features
- `YouTubePlayer` wrapper component (for panic and meditation embeds)
- `Alert` / `Banner` for disclaimers in panic help

Buttons and cards should have rounded corners and subtle shadows, never aggressive or “techy”.

---

### Accessibility guidelines

- All buttons and inputs:
  - Reachable by keyboard (Tab)
  - Have clear focus styles (outline or underline)
  - Use descriptive ARIA labels

- Language toggle:
  - Updates `<html lang="en">` or `<html lang="es">`
  - Switches all static text to the selected language

- Sliders:
  - Include ARIA labels in both languages
  - Announce the current value for screen readers

- Guided YouTube screens:
  - Provide a clear text description of what will happen (for example, “You will see a short grounding video”).
  - Include a visible “Stop” or “Back to dashboard” button.

Use semantic HTML elements wherever possible:  
`<main>`, `<section>`, `<header>`, `<button>`, `<nav>`, `<footer>`.

---

### Content style guide

#### Headings

- Use sentence case (for example, “Start free trial”)
- Only one `<h1>` per page, then `<h2>`, `<h3>` as needed

#### Lists

- Bullet points start with a **keyword or verb**
- Avoid long paragraphs inside lists

#### Links and CTAs

Use descriptive labels, for example:

- “Start chatting now”
- “View pricing”
- “Begin meditation”
- “Get panic help now”
- “Upgrade to unlimited sessions”

Avoid vague copy like “Click here”.

#### Button copy cheat sheet

| Action            | Label             |
| ----------------- | ----------------- |
| Start trial       | Start free trial  |
| Return to chat    | Continue chatting |
| Open panic help   | Get help now      |
| Start meditation  | Begin meditation  |
| Upgrade plan      | Upgrade now       |
| Switch to Spanish | Usar en español   |
| Switch to English | Use in English    |

---

### Emotional consistency

- The interface should always feel:
  - Soft, not overwhelming
  - Clear, not technical
  - Supportive, not alarmist

- Panic help:
  - Copy must be slow, direct, and reassuring.
  - Avoid catastrophizing language.

- Meditation:
  - Copy must invite, not pressure.
  - Emphasize permission to take a break and breathe.
