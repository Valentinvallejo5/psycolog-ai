## 🛠️ psicologia – Implementation Plan

### Step-by-step build sequence

#### 🧱 Setup & Infrastructure
- [ ] Create GitHub repo with `vite + react + ts` starter
- [ ] Install Tailwind, shadcn/ui, and configure design tokens
- [ ] Set up Supabase project: enable Auth and Postgres
- [ ] Configure Google OAuth + email/password login
- [ ] Connect frontend to Supabase via SDK

#### 🎨 UI Foundation
- [ ] Build mobile-first layout wrapper with page slots
- [ ] Create base components: `Button`, `Input`, `Card`, `LangToggle`, `Slider`
- [ ] Add bilingual support (EN + ES) using JSON i18n

#### 📄 Public Pages (Pre-login)
- [ ] Homepage: Hero section, CTA, features, testimonials, FAQ, signup form
- [ ] Pricing page: Compare plans, show upgrade options
- [ ] Auth pages: Register/Login with redirect to `/chat`

#### 💬 Chat Interface MVP
- [ ] Create chat panel with scrollable history
- [ ] Add distinct AI vs. user bubbles
- [ ] Add input field with send button (text only)
- [ ] Integrate GPT-4 via backend proxy function

#### 🎚️ Sidebar: Real-Time Controls
- [ ] Build sliders: tone, mood, interaction mode
- [ ] Sync values to Supabase session or local state
- [ ] Dynamically inject values into system prompt

#### 🔁 Persistence & Sync
- [ ] Store slider preferences per user
- [ ] Save chat sessions per login with timestamps
- [ ] Load latest chat on login, persist session history

#### 🚦 Freemium Plan Gating
- [ ] Add `plan_type` metadata to users in Supabase
- [ ] Restrict full tone/mood range to premium users
- [ ] Show upsell CTAs for locked features

#### ✅ Final Polish
- [ ] Run accessibility sweep (keyboard, contrast, ARIA)
- [ ] Translate all static content (EN/ES)
- [ ] Add legal pages (Terms, Privacy)
- [ ] Deploy to production (e.g. Vercel + Supabase)

---

### Timeline with checkpoints

| Week | Focus                                | Deliverable                        |
|------|--------------------------------------|------------------------------------|
| 1    | Project setup, auth, Supabase link   | Login & register flow live         |
| 2    | Homepage + Pricing + Auth UI         | Public-facing MVP site             |
| 3    | Chat UI with GPT-4 integration       | Functional AI chatbot              |
| 4    | Sliders + real-time state logic      | Adaptive tone/mood chat behavior   |
| 5    | Plan gating + memory storage         | Freemium working with persistence  |
| 6    | Polish + QA + soft launch            | MVP complete, ready to market      |

---

### Team roles & rituals

#### 🧑‍💻 Team Roles
- **Product Owner** – defines priorities, slider logic, and UX clarity
- **Frontend Dev** – builds layout, components, and state management
- **Backend Dev** – sets up Supabase, chat storage, prompt pipeline
- **UX/UI Designer** – designs calming, mobile-first interface and icons
- **Prompt Engineer (optional)** – fine-tunes AI personality + slider integration

#### 🔁 Weekly Rituals
- **Twice-weekly async standups** (Slack or Notion)
- **Weekly design check-in** – review usability, update UI/UX
- **Bi-weekly user testing** – test 3 real users, log top 3 issues

---

### Optional integrations & stretch goals
- 🧾 **Stripe** – real payment flow for Monthly + Annual plans
- 🧠 **GPT-4 Turbo** – cost-efficient memory-enabled model
- 📊 **PostHog** – analytics on slider use, upgrade triggers
- 🎙️ **Voice input** – future mood detection from tone
- 🪄 **PWA install prompt** – mobile-native experience
