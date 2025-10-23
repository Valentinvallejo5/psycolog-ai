## 🎨 psicologia – Design Guidelines

### Brand voice & tone

#### Voice traits
- **Warm and empathetic** – like a caring friend
- **Non-judgmental** – avoids labels or clinical language
- **Simple and supportive** – short, reassuring, clear
- **Bilingual by default** – fully native Spanish + English support

#### Tone examples by context
| Context         | Tone Style                        |
|----------------|-----------------------------------|
| Homepage        | Calm, hopeful, welcoming          |
| Chat responses  | Matches user sliders (tone/mood)  |
| Error messages  | Reassuring, gentle                |
| FAQs & pricing  | Clear, friendly, transparent      |

---

### Color, typography, spacing

#### Color palette
- **Primary**: `#C9A6FF` – soft lavender (buttons, sliders)
- **Accent**: `#FFD8F2` – light pink (hover states, backgrounds)
- **Backgrounds**: `#FFFFFF` and `#F8F7FC` – clean, subtle
- **Text**: `#1A1A1A` – strong contrast, accessible

> ✅ All colors pass WCAG AA contrast guidelines for body text.

#### Typography
- **Fonts**: `Inter` or `Nunito` – rounded, soft sans-serifs
- **Sizes**:
  - Body: 14–16pt
  - Headings: 24–32pt
- **Weights**: Use 400 / 600 / 700 only
- **Line height**: 1.5 for readability

#### Spacing system
- Use **4pt baseline grid**
- Padding/margin units: 8, 16, 24, 32
- Max content width: 640px on mobile

---

### Layout best practices

#### Layout rules
- **Mobile-first** – vertical stacks, no sidebars on small screens
- **Card-first UI** – everything lives in clean, visual cards
- **Sticky footer CTA** – "Start Free Trial" always visible
- **Sidebar on chat** – live sliders, collapsible on mobile
- **Avoid dropdowns** – sliders, toggles, and tabs instead

#### Must-have UI components
- [ ] `Button` (primary, secondary, ghost)
- [ ] `Input` (email, password)
- [ ] `ChatBubble` (AI + user)
- [ ] `Slider` (tone, mood, advice mode)
- [ ] `Card` (pricing, testimonials, features)
- [ ] `Accordion` (FAQ)
- [ ] `LanguageToggle`

---

### Accessibility must-dos

- All inputs and buttons must:
  - Be reachable with Tab key
  - Show focus styles clearly
  - Use descriptive ARIA labels
- Language toggle must:
  - Change `lang` attribute (`<html lang="es">`)
  - Update all static text accordingly
- Sliders must:
  - Include ARIA labels in both languages
  - Announce current value for screen readers
- Semantic HTML:
  - Use `<main>`, `<section>`, `<button>`, `<nav>`

---

### Content style guide

#### Headings
- Use sentence case (e.g. “Start free trial”)
- Only one H1 per page, followed by H2/H3

#### Lists
- Bullet points start with a **keyword or verb**
- Avoid full sentences in bullets

#### Links & CTAs
- Use **descriptive** text like:
  - ✅ “View pricing”
  - ✅ “Start chatting now”
- Avoid:
  - 🚫 “Click here”
  - 🚫 “Learn more”

#### Button copy cheat sheet
| Action               | Label              |
|----------------------|--------------------|
| Start trial          | Start free trial   |
| Return to chat       | Continue chatting  |
| Upgrade plan         | Upgrade now        |
| Switch to Spanish    | Usar en español    |
