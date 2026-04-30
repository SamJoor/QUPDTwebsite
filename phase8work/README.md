# Phi Delta Theta Site - Phase 7

Phase 7 focuses on the member account system.

## New in this phase
- Supabase-backed alumni email/password sign-in for member access
- claim-your-profile flow that links an auth account to an alumni record
- self-service member profile editing
- privacy settings for public vs member-only visibility

## Required environment for full Phase 7 behavior
Create `.env.local` in the app root:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_LOGIN_PASSWORD=
SESSION_SECRET=
```

`ALUMNI_LOGIN_PASSWORD` is now only a legacy fallback if Supabase Auth is not configured.

## Supabase setup
1. Run `supabase/schema.sql` if starting fresh.
2. If you already have an existing Phase 6 database, run `supabase/phase7.sql`.
3. Run `supabase/seed.sql` if you want the demo alumni/event/newsletter data.
4. Make sure `admin@example.org` exists in `admin_users` or replace it with your own email.
5. Use the contact email in `alumni_private_details` when claiming a member profile.

## Phase 7 member flow
1. Officers seed or import alumni profiles.
2. Alumni private details include the alumnus email.
3. Alumni goes to `/member/claim`.
4. After claiming, the alumnus signs in at `/member/login`.
5. The alumnus manages the profile at `/member/profile`.

## Notes
- Admin login still uses the local env password for now.
- Member login uses Supabase Auth when your project keys are present.
- Member route protection still uses the app's signed cookie session after successful authentication.

## Google Form / spreadsheet automation
If you want new form responses to go directly into Supabase without a manual CSV upload, use the webhook at:

`POST /api/integrations/alumni-import`

Authenticate with either:

- `Authorization: Bearer $FORM_IMPORT_SECRET`
- or `x-import-secret: $FORM_IMPORT_SECRET`

The route accepts either a single row object, `{ row: {...} }`, or `{ records: [{...}] }`.

Example payload:

```json
{
  "row": {
    "full_name": "Samuel Joor",
    "email": "samuel.joor@quinnipiac.edu",
    "phone": "9789124177",
    "major": "Data Science",
    "graduation_year": "2026",
    "graduation_term": "Spring"
  }
}
```

This is designed to work well with Google Apps Script, Zapier, Make, or Power Automate after a Google Form / spreadsheet submission.
