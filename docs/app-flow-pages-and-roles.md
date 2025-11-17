## 🧭 psicolog.ia - App Flow, Pages and Roles

### Site map (top level pages)

- `/` - Homepage
- `/pricing` - Plans and comparison
- `/register` - Create account
- `/login` - Log in
- `/dashboard` - Main user hub (chat, panic help, meditation)
- `/chat` - Main chat interface (private)
- `/settings` - Preferences and language
- `/terms` + `/privacy` - Legal info

---

### Purpose of each page (one liners)

- **Homepage** - Explain value, highlight features, invite to try free
- **Pricing** - Compare free vs paid, encourage upgrades
- **Register/Login** - Quick entry via email or Google
- **Dashboard** - Safe space with three core options: chat, panic help, guided meditation
- **Chat** - Core therapy like interaction with mood and tone sliders
- **Settings** - Update language, tone presets, and plan
- **Terms/Privacy** - Reinforce transparency and user trust

---

### User roles and access levels

#### 1. Visitor (not logged in)

- ✅ Access: Homepage, Pricing, Auth, Language toggle
- 🚫 Restricted: Dashboard, Chat, saved sessions, panic help, meditation

#### 2. Free User (registered)

- ✅ Access: Dashboard, Chat, panic help, guided meditation
- ✅ Sliders: basic tone and mood range
- ✅ Guided tools (via embedded YouTube videos):
  - Panic help: up to **2 sessions per day**
  - Guided meditation: up to **2 sessions per day**
- ❌ No: long term memory, full slider range
- 🟡 Gated: encouraged to upgrade for:
  - Unlimited panic help sessions
  - Unlimited meditation sessions
  - Full tone and mood controls
  - Memory and early access features

#### 3. Paid User (monthly or annual)

- ✅ Access: Everything
- 🎁 Perks:
  - Persistent memory
  - Full slider range
  - Unlimited panic help sessions
  - Unlimited guided meditations
  - Early access to new features
  - Referral credits (annual only)

---

### Primary user journeys (max 3 steps each)

#### 🧠 1. Start chatting instantly

1. Visit homepage
2. Sign up with email or Google
3. Redirect to `/dashboard` and click the "Chat with psicolog.ia" card to open `/chat`

#### 🫁 2. Get immediate panic help

1. Log in and land on `/dashboard`
2. Click the "Immediate Panic Help" card
3. The app opens a dedicated panic help screen and embeds a **1 to 2 minute YouTube grounding video** in the user language

Free users:

- If they have used panic help fewer than 2 times today, show the embedded YouTube player and let it play.
- If they already used it twice today, show an upgrade modal and keep the card visible with a lock icon.

Premium users:

- Always show the embedded video, no limit.

#### 🌿 3. Practice guided meditation

1. Log in and land on `/dashboard`
2. Click the "Guided Meditation" card
3. The app opens a meditation screen and embeds a **5 minute YouTube meditation video** in the user language

Free users:

- Up to 2 meditation sessions per day. After that, show an upgrade prompt and a lock icon on the card.

Premium users:

- Unlimited meditation sessions.

#### 🚀 4. Upgrade for full experience

1. From the dashboard or chat, click "Upgrade" or any locked feature with a lock icon
2. Go to `/pricing`
3. Choose a plan, complete payment, and return to `/dashboard` with premium unlocked

---

### Routes overview

- `/` - Public marketing page
- `/pricing` - Public pricing page
- `/register` and `/login` - Public auth pages, redirect to `/dashboard` on success
- `/dashboard` - Private hub (auth required) that shows three main cards:
  - Chat with psicolog.ia
  - Immediate Panic Help (embedded YouTube video)
  - Guided Meditation (embedded YouTube video)
- `/chat` - Private chat interface
- `/settings` - Private, language and plan controls
- `/terms` and `/privacy` - Public legal pages
