## 🛠️ psicolog.ia – Implementation Plan

This plan assumes a Lovable Cloud project with:

- React + TypeScript frontend
- Lovable managed backend (auth, database, storage)
- OpenAI API for chat
- Embedded YouTube videos for panic help and meditation

Focus: add a **dashboard hub** with three tools (chat, panic help, meditation) and **freemium limits** based on `plan_type`.

---

### 1. Setup and infrastructure

- [ ] Confirm Lovable Cloud project is configured with:
  - Auth (email and optionally Google)
  - Database tables for `users`, `chat_sessions` and new usage tracking for guided tools

- [ ] Create or align shared UI primitives:
  - `Button`, `Input`, `Card`, `LangToggle`, `Slider`, `Modal`
  - `YouTubePlayer` component for safe YouTube embeds

- [ ] Set up basic i18n:
  - JSON files for `en` and `es`
  - User language stored on profile or in a settings table

---

### 2. Public pages (pre-login)

- [ ] Homepage `/`:
  - Hero section explaining psicolog.ia as an AI mental health companion
  - Feature highlights:
    - 24/7 chat
    - Panic help button (short grounding video)
    - Guided meditation (5 minute reset)
  - CTA: “Start free trial”

- [ ] Pricing `/pricing`:
  - Comparison table for Free vs Premium:
    - Free:
      - Limited panic help sessions per day
      - Limited meditation sessions per day
    - Premium:
      - Unlimited sessions
      - Memory and full sliders
  - Clear “Upgrade now” button

- [ ] Auth pages `/register`, `/login`:
  - Email + password form, optional social login
  - After success: redirect to `/dashboard`

---

### 3. Dashboard hub `/dashboard`

- [ ] Create `/dashboard` route (private, auth required).
- [ ] Layout:
  - Welcome message, for example: “Welcome back, {name}”
  - Three main `Card` components:
    1. **Chat with psicolog.ia**
       - Short description (emotional support chat).
       - Button: “Start chatting” → navigate to `/chat`.

    2. **Immediate Panic Help**
       - Short description (1–2 minute grounding video).
       - Button: “Get help now” → open panic help screen.

    3. **Guided Meditation**
       - Short description (5 minute meditation).
       - Button: “Begin meditation” → open meditation screen.

- [ ] Cards must:
  - Follow design guidelines (soft colors, rounded corners, mobile-friendly).
  - Show a small lock icon and “Upgrade to unlock unlimited sessions” hint when feature is blocked due to free limits.

---

### 4. Chat interface `/chat`

- [ ] Implement chat UI:
  - Scrollable message history
  - Distinct styles for user vs AI `ChatBubble`
  - Text input with send button

- [ ] Connect to backend route that calls OpenAI:
  - Include user language, tone and mood slider values in the system prompt.

- [ ] Load user language on mount and answer in that language by default.

---

### 5. Guided tools via YouTube embeds

#### 5.1 YouTube config

- [ ] Create `src/config/guidedVideos.ts`:

  ```ts
  export const GUIDED_VIDEOS = {
    panic: {
      en: "sw7M0i_jL-s",    // 2-minute grounding exercise
      es: "b4f1qqMDYk0",    // Calma tu ansiedad en 2 minutos
    },
    meditation: {
      en: "inpok4MKVLM",    // 5-minute meditation (Goodful)
      es: "LDZQH0Tp4IE",    // Meditación de 5 minutos en español
    },
  } as const;
  ```
