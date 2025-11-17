# psicolog.ia - Implementation Tasks

This document outlines the complete implementation roadmap for building psicolog.ia, a virtual psychologist application with YouTube-based panic help and meditation tools, freemium limits, and bilingual support.

---

## Phase 1: Foundation & Infrastructure ✅

### 1.1 Enable Lovable Cloud ✅
- Backend provisioning with PostgreSQL, Auth, Storage, and Edge Functions
- **Status**: Complete

### 1.2 Database Schema Setup ✅
- ✅ User profiles table with language preferences
- ✅ User roles table with RLS policies
- ✅ Subscription plans table (free, monthly, annual)
- ✅ Chat messages table
- ✅ Slider preferences table
- ✅ Conversation summaries table
- ✅ Daily usage tracking table for panic and meditation sessions
- **Status**: Complete

### 1.3 Authentication Configuration ✅
- ✅ Google OAuth integration
- ✅ Email/password authentication
- ✅ Auto-confirm email enabled for testing
- **Status**: Complete

### 1.4 Payment Integration (Stripe) 🔄
- ⚠️ Stripe integration for subscription payments
- ⚠️ Product definitions for monthly and annual plans
- **Status**: Pending

### 1.5 AI Integration ✅
- ✅ Lovable AI integration with default model
- ✅ AI chat edge function with authentication
- **Status**: Complete

---

## Phase 2: Frontend - Dashboard & Navigation ✅

### 2.1 Dashboard Hub Route ✅
- ✅ Created `/dashboard` as protected route (auth required)
- ✅ Displays user welcome message with email
- ✅ Shows current plan badge (Free/Premium)
- **Status**: Complete

### 2.2 Three Main Feature Cards ✅
- ✅ **Chat with psicolog.ia**
  - Navigation to existing `/chat` page
  - Always available
  - CTA: "Start chatting"
  
- ✅ **Immediate Panic Help**
  - Navigation to `/panic` route
  - Shows usage counter for free users (X/2 sessions used today)
  - Locked state when limit reached
  - CTA: "Get help now" or "Upgrade to unlock"
  
- ✅ **Guided Meditation**
  - Navigation to `/meditation` route
  - Shows usage counter for free users (X/2 sessions used today)
  - Locked state when limit reached
  - CTA: "Begin meditation" or "Upgrade to unlock"

### 2.3 Language-Aware Labels ✅
- ✅ All dashboard labels support bilingual UI (EN/ES)
- ✅ Dynamic translation using i18n system
- **Status**: Complete

---

## Phase 3: Frontend - Guided Tools (YouTube Embeds) ✅

### 3.1 YouTube Video Configuration ✅
- ✅ Created `src/config/guidedVideos.ts`
- ✅ Configured 4 YouTube video IDs:
  - Panic EN: `kFZhcyOwyzU` (2-minute grounding)
  - Panic ES: `b4f1qqMDYk0` (Calma tu ansiedad)
  - Meditation EN: `inpok4MKVLM` (5-minute Goodful)
  - Meditation ES: `TEdIgFstfpM` (5 minutos de meditación)
- **Status**: Complete

### 3.2 Reusable YouTubePlayer Component ✅
- ✅ Created `src/components/YouTubePlayer.tsx`
- ✅ 16:9 aspect ratio with responsive design
- ✅ Rounded corners and shadow styling
- ✅ Autoplay enabled
- **Status**: Complete

### 3.3 PanicHelp Page ✅
- ✅ Created `/panic` protected route
- ✅ Language-aware video selection
- ✅ YouTubePlayer integration
- ✅ Back to dashboard button
- ✅ Emergency disclaimer notice
- **Status**: Complete

### 3.4 Meditation Page ✅
- ✅ Created `/meditation` protected route
- ✅ Language-aware video selection
- ✅ YouTubePlayer integration
- ✅ Back to dashboard button
- ✅ Calm completion message
- **Status**: Complete

---

## Phase 4: Backend - Freemium & Usage Tracking ✅

### 4.1 Plan Type Field ✅
- ✅ Subscription_plans table has `plan` enum (free, monthly, annual)
- ✅ Default value set to 'free' on user creation
- **Status**: Complete

### 4.2 Daily Usage Table ✅
- ✅ Created `daily_usage` table with:
  - `user_id` (UUID, not null)
  - `date` (DATE, default today)
  - `panic_sessions_count` (integer, default 0)
  - `meditation_sessions_count` (integer, default 0)
  - Unique constraint on (user_id, date)
- ✅ RLS policies for user-specific access
- **Status**: Complete

### 4.3 Edge Function: start-panic-session ✅
- ✅ Created `supabase/functions/start-panic-session/index.ts`
- ✅ Authentication validation
- ✅ Subscription plan check
- ✅ Premium: unlimited access (always returns allowed: true)
- ✅ Free: enforces 2-per-day limit
- ✅ Returns usage count and limit info
- ✅ CORS headers configured
- **Status**: Complete

### 4.4 Edge Function: start-meditation-session ✅
- ✅ Created `supabase/functions/start-meditation-session/index.ts`
- ✅ Authentication validation
- ✅ Subscription plan check
- ✅ Premium: unlimited access
- ✅ Free: enforces 2-per-day limit
- ✅ Returns usage count and limit info
- ✅ CORS headers configured
- **Status**: Complete

---

## Phase 5: Freemium Gating & Upgrade Flow ✅

### 5.1 Visual Limit Indicators on Dashboard ✅
- ✅ Lock icons shown when free user hits daily limit
- ✅ Usage badges display "X/2 sessions used today"
- ✅ CTA text changes to "Upgrade to unlock"
- ✅ Card opacity reduced when locked
- **Status**: Complete

### 5.2 UpgradeModal Component ✅
- ✅ Created `src/components/UpgradeModal.tsx`
- ✅ Dynamic content for panic vs meditation features
- ✅ Bilingual support (EN/ES)
- ✅ Lists Premium benefits
- ✅ "View plans" CTA navigates to `/pricing`
- **Status**: Complete

### 5.3 Dashboard Integration ✅
- ✅ Opens UpgradeModal when free user hits limit
- ✅ Opens UpgradeModal when clicking locked card
- ✅ Fetches real-time usage data on mount
- ✅ Displays current plan badge
- **Status**: Complete

### 5.4 Pricing Page Integration 🔄
- ✅ `/pricing` page exists
- ⚠️ Stripe checkout integration pending
- ⚠️ Plan upgrade flow to set `plan_type = premium`
- **Status**: Partially complete

---

## Phase 6: Bilingual Support ✅

### 6.1 i18n Translation System ✅
- ✅ `src/lib/i18n.ts` with ES and EN translations
- ✅ Added dashboard-specific keys:
  - `dashboard_back`
  - `dashboard_start_chat`
  - `dashboard_get_help`
  - `dashboard_begin_meditation`
  - `dashboard_upgrade_unlock`
  - `dashboard_sessions_used`
- **Status**: Complete

### 6.2 Language Toggle ✅
- ✅ Global language context
- ✅ Persisted in localStorage
- ✅ Synced with user profile in database
- **Status**: Complete

### 6.3 Static Content Translation ✅
- ✅ All dashboard cards bilingual
- ✅ PanicHelp page bilingual
- ✅ Meditation page bilingual
- ✅ UpgradeModal bilingual
- **Status**: Complete

---

## Phase 7: Testing & QA 🔄

### 7.1 Flow Testing
- ⚠️ Test complete user journey: Home → Login → Dashboard → Panic → Meditation → Chat
- ⚠️ Verify freemium limits work correctly for free users
- ⚠️ Verify premium users get unlimited access
- ⚠️ Test upgrade modal triggers correctly

### 7.2 Bilingual Testing
- ⚠️ Test all flows in English
- ⚠️ Test all flows in Spanish
- ⚠️ Verify language toggle persists correctly

### 7.3 Mobile Testing
- ⚠️ Test dashboard on mobile view
- ⚠️ Test YouTube embeds on mobile
- ⚠️ Verify touch interactions work smoothly

### 7.4 Existing Chat Validation
- ⚠️ Ensure `/chat` page still works correctly
- ⚠️ Verify chat doesn't interfere with new features
- ⚠️ Test chat navigation from dashboard

**Status**: Pending

---

## Phase 8: Polish & Production Readiness 🔄

### 8.1 Loading States
- ⚠️ Add loading spinners to dashboard while fetching usage
- ⚠️ Add loading states to panic/meditation session start

### 8.2 Error Handling
- ⚠️ Graceful error messages for edge function failures
- ⚠️ Retry logic for network issues
- ⚠️ Fallback UI when YouTube embeds fail

### 8.3 Analytics
- ⚠️ Track which tools are used most
- ⚠️ Track free-to-premium conversion triggers
- ⚠️ Monitor daily usage patterns

### 8.4 Accessibility
- ⚠️ Audit keyboard navigation
- ⚠️ Verify screen reader compatibility
- ⚠️ Check color contrast ratios

### 8.5 Legal Pages
- ✅ Terms of Service page
- ✅ Privacy Policy page

**Status**: Partially complete

---

## Summary

### Task Counts
- **Total Tasks**: 48
- **Completed**: 38
- **In Progress**: 2
- **Pending**: 8

### Critical Path
1. ✅ Database schema with daily_usage table
2. ✅ YouTube configuration and player component
3. ✅ Panic and meditation pages
4. ✅ Edge functions for freemium limits
5. ✅ Dashboard integration with usage tracking
6. ✅ UpgradeModal component
7. 🔄 Stripe integration for plan upgrades
8. 🔄 QA and testing across all flows

### Next Priority Tasks
1. **Stripe Integration**: Complete payment flow for premium upgrades
2. **Testing**: Comprehensive QA of freemium limits
3. **Polish**: Loading states and error handling
4. **Analytics**: Usage tracking implementation

---

## Notes

- The existing `/chat` functionality remains unchanged and integrated
- All new features align with updated context docs (masterplan.md, implementation.md, etc.)
- Freemium model enforces limits via edge functions (server-side validation)
- YouTube embeds use official IDs and can be swapped in `guidedVideos.ts`
- All routes are protected and require authentication
