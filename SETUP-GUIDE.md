# Call Roster — Setup Guide

A one-time setup, about 15 minutes, completely free. After this, you and your
staff open one web link, tap **Continue with Google** once, and share the same
live patient list from any phone or computer. You (vrajkundariya9876@gmail.com)
are the owner — only you can decide which emails get access, right from inside
the app.

**What's in this folder**

- `index.html` — the whole app
- `sw.js`, `manifest.json`, `icon.png` — make it installable like a real app, with its own icon and reminders
- `firestore.rules` — the security rules that keep patient data private to your team
- `SETUP-GUIDE.md` — this guide

Everything below uses free tiers only — no credit card anywhere.

---

## Step 1 — Create your free Firebase project (~3 min)

1. Go to **console.firebase.google.com** and sign in with **vrajkundariya9876@gmail.com**.
2. Click **Create a project**, name it anything (e.g. `call-roster`).
3. If asked about Google Analytics, turn it **off**. Create the project.

## Step 2 — Turn on Google sign-in (~1 min)

1. Left menu: **Build → Authentication** → **Get started**.
2. Choose **Google** from the sign-in providers → toggle **Enable** →
   pick your email as support email → **Save**.

That's the entire login system. No accounts to create, no passwords —
staff use their own Gmail.

## Step 3 — Create the database and paste the rules (~3 min)

1. Left menu: **Build → Firestore Database** → **Create database**.
2. Location: **asia-south1 (Mumbai)**. Start in **production mode**. Create.
3. Open the **Rules** tab, delete what's there, paste the full contents of
   `firestore.rules` from this folder, and click **Publish**.

The rules already name you as owner. Only emails you approve in the app can
ever see or change patient data — even someone with the link gets nothing.

## Step 4 — Connect the app to your project (~2 min)

1. **Gear icon → Project settings** → scroll to **Your apps** → click the
   **`</>` (Web)** icon → any nickname → **Register app** (skip the Hosting checkbox).
2. Firebase shows a config block. You need three values: `apiKey`,
   `authDomain`, `projectId`.
3. Open `index.html` in a text editor (TextEdit is fine), find this near the
   top of the script:

   ```js
   var CONFIG = {
     apiKey: "PASTE_YOUR_API_KEY",
     authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
     projectId: "PASTE_YOUR_PROJECT_ID"
   };
   ```

   Replace the three values with yours and save.

   (The apiKey isn't a secret password — it just names your project. The
   Google login + the rules from Step 3 are the real protection.)

## Step 5 — Put it online, free (~3 min)

1. Go to **app.netlify.com/drop** (make the free account) and drag this whole
   folder onto the page. You'll get a link like `https://something.netlify.app`.
2. Back in Firebase: **Authentication → Settings → Authorized domains →
   Add domain** → paste your `something.netlify.app` domain.
   *(Without this, the Google sign-in popup refuses to open on your site.)*

Open your link, tap **Continue with Google**, sign in as yourself — you're in,
and you'll see the **"Who can access"** panel in the sidebar.

## Step 6 — Add your staff (~1 min)

In the **Who can access** panel, type each staff member's Gmail and press
**Add**. Send them the link. They tap **Continue with Google** once and they're
in — synced live with you. Remove anyone anytime with the ✕.

If someone signs in before you've added them, they see a polite "ask Dr. Vraj
to add your email" screen — nothing is visible to them.

---

## How the reminders work

- **On open:** a pop-up summary of today's patients and how many still need calls.
- **One hour before** each procedure: a heads-up alert (while the app is open
  on any of your devices — keep the tab open at the clinic desk).
- **Teamwork:** when a staff member adds a patient for *today*, everyone else
  gets an alert.
- **Tab badge:** the browser tab shows e.g. "(3) Call Roster" — calls left today.
- **On Android phones** installed via "Add to Home Screen", the app can also
  show a daily reminder in the background where the phone supports it.

Each person taps **"Turn on today's alerts"** once (sidebar) to allow pop-ups.
One honest limit: a phone that never opens the app can't be pinged for free —
so make opening it (or keeping it open at reception) the morning habit.

## Daily use tips

- **Phones:** open the link → browser menu → **Add to Home Screen**. It gets
  the teal phone icon and opens full-screen like an app.
- **Overbooking:** set your daily limit in the sidebar — heavy days turn red
  everywhere, and the add form warns you *while* booking.
- **After a procedure:** mark the patient **Done**; delete old records from the
  edit screen whenever you like. Data lives in Google's cloud — reloading,
  closing, or losing a phone never loses the list.
- **Names:** each person taps "Set your name" once so you can see who added or
  called each patient (it's pre-filled from their Google name).

## Is it really free?

Yes, at your scale, permanently. Firebase's free tier: 50,000 reads +
20,000 writes per day, 1 GB storage — a 4-person clinic uses well under 1% of
that. Netlify free hosting easily covers the site. No card required for either.
