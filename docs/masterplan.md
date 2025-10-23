## 🧠 psicologia – Masterplan

### 30-second elevator pitch
psicologia is a 24/7 AI-powered mental health companion for Spanish and English-speaking users. It offers confidential, customizable therapy-like chat sessions with real-time mood and tone controls—always available, stigma-free, and intuitively bilingual.

### Problem & mission
**Problem:** Millions face barriers to mental health support—language, cost, availability, and stigma.  
**Mission:** Offer an accessible, emotionally intelligent AI companion that feels safe, personal, and always there.

### Target audience
- Spanish-speaking individuals seeking discreet support
- Gen Z and Millennials comfortable with digital-first therapy
- People who want to choose the *style* of their support (friendly vs. clinical, listener vs. advisor)

### Core features
- AI-powered chat interface, 24/7 access
- Real-time customization: tone, mood, and interaction mode
- Bilingual support for Spanish and English users
- Persistent user memory for continuity and empathy
- Freemium plans with upgrade incentives
- Mobile-friendly, calming interface with supportive visuals
- FAQ, testimonials, and pricing built into the public site

### High-level tech stack
- **Frontend**: React + TypeScript + Vite → modern, fast, and scalable  
- **UI Components**: shadcn/ui + Tailwind CSS → composable and accessible  
- **Backend & Storage**: Supabase → handles auth, chat logs, and user settings  
- **AI Engine**: GPT-4 via OpenAI API → strong contextual understanding and multilingual fluency  
- **Auth**: Supabase OAuth (Google + email) → seamless and secure  

### Conceptual data model
- **User**
  - `id`, `email`, `language`, `plan_type`, `slider_settings`, `created_at`
- **ChatSession**
  - `id`, `user_id`, `timestamp`, `session_settings`, `messages[]`
- **Message**
  - `id`, `session_id`, `role (user|ai)`, `content`, `timestamp`
- **Subscription**
  - `user_id`, `plan`, `billing_status`, `renewal_date`

### UI design principles
- **Don’t Make Me Think**: Clear, intuitive navigation with mobile-first flow  
- **Tone as Therapy**: Sliders give emotional agency back to users  
- **Scannable Simplicity**: Cards, icons, and whitespace dominate over text blocks  
- **Warmth by Default**: Lavender and pink tones, rounded fonts, friendly illustrations  
- **Trust Signals**: Testimonials, FAQs, and transparent pricing reduce hesitation  

### Security & compliance notes
- All data stored with Supabase (Postgres + RLS)
- GDPR-ready: opt-out, data deletion, privacy-first defaults
- End-to-end encryption for chat messages in storage
- Anonymous sessions possible (with limitations on memory)

### Phased roadmap
#### MVP
- AI chat in Spanish + English
- Mood, tone, and interaction sliders
- Manual language toggle
- Freemium pricing page
- Persistent chat history (for logged-in users)

#### V1
- Long-term memory (user-specific context retention)
- Referral system (Annual plan incentive)
- Language auto-detect on input
- Mobile-native PWA polish

#### V2
- Voice input with sentiment detection
- Adaptive tone based on text sentiment
- Community features (Slack-style group check-ins)
- Therapist-trained AI fine-tuning

### Risks & mitigations
- **AI hallucinations** → Add system prompts and session boundaries  
- **Privacy fears** → Transparent data handling + anonymous access  
- **Misuse as medical advice** → Clear disclaimers and boundaries in onboarding and UI  
- **Overpromising emotional intelligence** → Set honest expectations early  

### Future expansion ideas
- Text-to-speech with voice that adapts tone
- Journaling and mood graphs
- Human escalation partner network
- Peer support forums with AI moderation
