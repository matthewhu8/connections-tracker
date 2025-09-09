# Networking Tracker MVP — Fields, Features, and Architecture

**Summary:**  
A lightweight, purpose-built CRM for recruiting that replaces messy spreadsheets. Users can add contacts (person, job, firm, role), track outreach and responses, capture notes, record who referred whom, and log any new contacts they were introduced to. The app surfaces a clean table view with filters, a detail page per contact, and CSV import/export. Phase-2 adds reminders, a dashboard, visual referral chains, and simple recommendations (“who to follow up with next” or “new coffee chats to try”).

---

## Recommended Tech Stack (pragmatic, fast to ship)

- **Frontend:** Next.js (App Router) + React + Tailwind CSS  
- **Auth:** NextAuth (email magic link) or Clerk (simpler UX)  
- **Database:** Postgres (Supabase or Railway)  
- **ORM:** Prisma  
- **File/CSV Handling:** Papaparse (client) or server-side CSV parsing (e.g., `csv-parse`)  
- **APIs:** Next.js Route Handlers (REST)  
- **Jobs/Cron:** Vercel Cron (or Supabase Scheduled Jobs)  
- **Hosting:** Vercel (FE+API) + Supabase/Railway (DB)

**Phase-2 microservice (optional):**
- **Service:** Python FastAPI (for nightly recommendations & referral analytics)  
- **Queue/Worker:** Celery/RQ or simple scheduled task (Railway/Fly.io)  
- **Storage add-ons:** pgvector (semantic similarity/ranking later)

---

## System Architecture (MVP → Phase 2)

### MVP (single app)
- All CRUD (contacts, notes, referrals) lives in Next.js API.
- Auth via NextAuth/Clerk; user-only row access patterns enforced in API.
- Vercel Cron hits a protected API route nightly (e.g., refresh follow-up flags, precompute simple “Next Actions”).

- Nightly worker reads interactions/edges, updates aggregates & recommendation tables.
- Optional pgvector for “fit” (school, role, division similarity).

---

## Core Fields
For each connection, the app stores:

- **Person** → full name  
- **Job** → title/position (e.g., “Analyst”)  
- **Firm** → company (e.g., Goldman Sachs)  
- **Role** → division/group (e.g., M&A, LevFin)  
- **Contact Info** → email, phone, LinkedIn  
- **Reached Out** → yes/no toggle  
- **Responded** → yes/no toggle  
- **Contacts Provided** → list of names/contact info they referred you to  
- **Notes** → free text for coffee chat takeaways, resume advice, etc.  
- **Referred By** → who introduced you (friend, professor, another contact)  

---

## Core Features (MVP)

### Add/Edit Contacts
- Simple form with all the fields above.  
- Option to quickly check boxes for *Reached Out* / *Responded*.  

### View Contacts Table
- Table with sortable columns: Person, Firm, Role, Reached Out, Responded.  
- Filter by Firm, Role, or Response status.  

### Contact Detail Page
- Shows all fields neatly.  
- Includes timeline of notes and a section for “Contacts Provided.”  

### Notes & Referrals
- Notes are logged like a journal entry.  
- “Contacts Provided” lets you link new people to this one.  

### Import/Export
- Upload a CSV (Excel-like).  
- Download everything back to CSV for backup.  

---

## Nice-to-Haves (Phase 2)
- **Reminders** → set “follow up in X days” per person.  
- **Dashboard** → show:  
  - Total reached out vs not  
  - Total responded vs not  
  - Top firms/groups contacted  
- **Referral Chains** → visualize “who introduced you to who.”  
- **Recommendations** (later) → system suggests who to follow up with or new contacts to pursue.  

---

## Example User Flow
1. Add *Jane Doe* (Analyst, Goldman Sachs M&A, email: jane@gs.com).  
2. Check “Reached Out.”  
3. Later, mark “Responded.”  
4. Log note: “Coffee chat 9/3, referred me to John Smith.”  
5. Under “Contacts Provided,” add *John Smith*.  
6. Under “Referred By,” mark *Professor Lee*.  
7. Jane now shows up in the table as *Reached Out = ✅, Responded = ✅*.  

---

