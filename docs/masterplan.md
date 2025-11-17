## 🧠 psicolog.ia – Masterplan

### 30-second elevator pitch

psicolog.ia is a 24/7 AI-powered mental health companion for Spanish and English speakers. It offers confidential, customizable therapy-like chat sessions with real-time mood and tone controls, plus an immediate panic help button and short guided meditations using embedded YouTube videos, all inside a calm and friendly interface.

---

### Problem and mission

**Problem:**  
Millions of people face barriers to mental health support: language, cost, availability, time zones, and stigma. Many don’t feel ready for traditional therapy, but still need a safe space to talk and simple tools to handle anxiety.

**Mission:**  
Offer an accessible, emotionally intelligent AI companion that feels safe, personal, and always there, with quick tools to survive panic moments and small daily rituals to reset.

---

### Target audience

- Spanish-speaking individuals who want discreet emotional support.
- Gen Z and Millennials comfortable with digital-first mental health tools.
- People who want to choose the _style_ of their support (friendly vs clinical, listener vs advisor).
- Users who struggle with anxiety and want:
  - A panic button they can press when everything feels “too much”.
  - Short guided meditations they can use in 5 minutes between tasks.

---

### Core features

- **AI chat interface, 24/7 access**
  - Therapy-like conversations, not a replacement for a human therapist.
  - Customizable tone, mood, and advice mode via sliders.

- **Bilingual support (EN/ES)**
  - Fully natural Spanish and English.
  - Language chosen by user, with simple toggle in settings.

- **Immediate panic help button**
  - When pressed, it opens a dedicated screen with:
    - A short explanation.
    - A **1–2 minute grounding YouTube video** in the user’s language.
  - Designed to be extremely simple: one tap, one video, no extra thinking.

- **Guided meditation (5 minutes)**
  - A separate screen for a **5-minute YouTube guided meditation** in the user’s language.
  - Ideal for breaks, end of day, or after stressful events.

- **Usage-based freemium model**
  - **Free plan:**
    - Access to chat.
    - Panic button: up to 2 sessions per day.
    - Guided meditation: up to 2 sessions per day.
  - **Premium plan:**
    - Unlimited panic and meditation sessions.
    - Full tone/mood slider ranges.
    - Long-term memory and better continuity in chat.
    - Early access to new features.

- **Persistent memory (for premium)**
  - The system remembers key preferences and context over time.
  - Creates a sense of continuity and recognition.

- **Mobile-friendly, calming interface**
  - Card-based dashboard with three main options: Chat, Panic Help, Meditation.
  - Soft lavender and pastel color palette.

- **Public site elements**
  - Homepage with clear explanation and emotional safety.
  - Pricing with transparent free vs premium comparison.
  - FAQ, Terms, and Privacy pages emphasizing trust and boundaries.

---

### High-level tech stack

- **Frontend:** React + TypeScript (Lovable Cloud generated structure)
- **UI Components:** Tailwind CSS + custom components (Buttons, Cards, ChatBubbles, Modals, YouTubePlayer)
- **Backend:** Lovable Cloud managed backend (auth, database, storage)
- **AI engine:** OpenAI models (chat, bilingual responses, tone adaptation)
- **Auth:** Lovable Cloud auth (email/password, optional OAuth) with `plan_type` field on user
- **Guided tools:** Embedded YouTube videos for panic and meditation (IDs configured in code)

---

### Conceptual data model

- **User**
  - `id`
  - `email`
  - `language` (en|es)
  - `plan_type` (free|premium)
  - `slider_settings` (tone, mood, advice mode)
  - `created_at`

- **ChatSession**
  - `id`
  - `user_id`
  - `timestamp`
  - `session_settings` (language, slider snapshot)
  - `messages[]`

- **Message**
  - `id`
  - `session_id`
  - `role` (`user` | `ai`)
  - `content`
  - `timestamp`

- **GuidedUsage** (or `daily_usage`)
  - `id`
  - `user_id`
  - `date` (YYYY-MM-DD)
  - `panic_sessions_count`
  - `meditation_sessions_count`

- **Subscription**
  - `user_id`
  - `plan` (for example, monthly, annual)
  - `billing_status`
  - `renewal_date`

---

### UI design principles

- **Don’t make me think**
  - Clear, linear flow: Homepage → Login → Dashboard → choose between Chat / Panic / Meditation.

- **Safe hub**
  - `/dashboard` works as a “safe space” with three cards only:
    - Chat with psicolog.ia
    - Immediate Panic Help
    - Guided Meditation

- **Tone as therapy**
  - Sliders let users adjust how the AI talks: warmer, more direct, more validating.

- **Scannable simplicity**
  - Short sentences, bullet points, and cards instead of dense blocks of text.

- **Warmth by default**
  - Soft colors, rounded corners, friendly microcopy, no aggressive UI patterns.

- **Trust signals**
  - Transparent copy about limitations (not a human therapist).
  - Clear explanation of data handling and privacy.

---

### Security and compliance notes

- All sensitive data is stored in Lovable Cloud’s database with secure defaults.
- Provide clear ways for users to:
  - Delete their account and associated data.
  - Request data export if needed.
- Show disclaimers:
  - The AI is **not** a human therapist.
  - The panic button is **not** a crisis or emergency service.
- Suggest crisis hotlines or local resources in panic-related flows (static text by region or general guidance).
- Allow anonymous or pseudonymous accounts when possible (reduced friction for people afraid of stigma).

---

### Phased roadmap

#### MVP

- Bilingual AI chat in Spanish and English.
- Manual language toggle and language stored per user.
- `/dashboard` with three cards:
  - Chat with psicolog.ia
  - Immediate Panic Help (YouTube grounding video)
  - Guided Meditation (5-minute YouTube video)
- Basic free vs premium distinction:
  - Free: 2 panic + 2 meditation sessions per day.
  - Premium: unlimited.
- Simple daily usage tracking for guided tools.
- Marketing pages: homepage, pricing, basic FAQ, terms, privacy.

#### V1

- More polished freemium model and upgrade flow.
- Memory for premium users (longer history and preferences).
- Automatic language detection on user input with fallback to user preference.
- Better visuals for panic and meditation (breathing animations, progress indicators).
- Analytics on usage (which tools are used most, at what times).

#### V2

- Voice input for chat (and possibly for panic help).
- Smarter sentiment detection and automatic tone adjustments.
- Journaling and mood tracking with simple graphs.
- Optional human escalation network (partner therapists or services) for users who want to transition from AI to human support.
- Push/PWA style reminders for daily check-ins or meditation sessions.

---

### Risks and mitigations

- **AI hallucinations or unsafe advice**
  - Strong system prompts with clear safety instructions.
  - Explicit boundaries: no diagnosis, no medication recommendations.
  - Filters for self-harm or crisis language that redirect to crisis resources.

- **Privacy fears**
  - Transparent explanation of data use during onboarding.
  - Easy controls for deleting chats or the whole account.

- **Over-reliance on AI instead of human help**
  - Repeated reminders that this is a tool, not a replacement for a therapist.
  - Gentle nudges toward human help in long-term or intense situations.

- **Misunderstanding “panic button” as emergency line**
  - Very clear copy: “This is a short self-guided exercise, not an emergency service.”
  - Always show a small disclaimer at the bottom of panic help screen.

---

### Future expansion ideas

- Text-to-speech for AI responses in chat (read-aloud mode).
- Customizable panic and meditation flows (select type: breathing, body scan, visualization).
- Community check-in features with AI moderation (“How are you feeling today?” wall).
- Integration with wearables (heart rate / sleep) to suggest tools when stress is detected.
- Partner programs with therapists or clinics who can be recommended after sustained app usage.
