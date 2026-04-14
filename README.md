# Phi Delta Theta Chapter Website

A private chapter platform built to strengthen the connection between **current brothers** and **alumni** through a secure, modern web experience.

This website is designed to serve as a long-term digital home for the chapter — combining member access, alumni networking, newsletters, mentorship, administrative tools, and chapter history into one centralized platform.

---

## Overview

The purpose of this project is to help the chapter build a stronger and more lasting network.

Instead of relying on scattered spreadsheets, disconnected social media, or informal communication channels, this platform creates a dedicated system where brothers can:

- stay connected during and after college
- keep their information updated
- discover alumni and chapter opportunities
- engage with newsletters and chapter updates
- preserve chapter history and legacy content
- support long-term chapter growth through a structured digital network

The long-term vision is to create a chapter-specific professional and social network — essentially a personalized LinkedIn-style system for the fraternity.

---

## Core Features

### Member and Alumni Accounts
The website supports account claiming and sign-in flows for verified chapter members.  
Users can access content and tools based on their role and status.

Planned or supported account-related functionality includes:

- member claim flow
- secure login
- role-aware access
- active member vs alumni segmentation
- profile and private detail management

### Alumni Network
The site is meant to become a real alumni network rather than just a static website.

This includes support for:

- alumni directory and searchable records
- maintained graduation data
- professional and contact information
- stronger long-term networking between generations of brothers

### Newsletter System
The platform includes newsletter functionality so chapter communications can be distributed more professionally.

Features include:

- subscriber collection
- member-aware signup logic
- newsletter drafting and sending
- individual newsletter issue pages
- email delivery integration

### Mentorship and Opportunity Sharing
One of the main goals of the website is to make alumni support more actionable.

The mentorship/opportunity system is designed to allow:

- alumni to post mentorship or career opportunities
- members to browse available opportunities
- brothers to apply directly through the platform
- admins to review and manage submissions

### Admin Dashboard
The website includes an admin layer so chapter leadership can manage data and workflows without directly editing the database.

Administrative functionality may include:

- CSV-based member import
- alumni/member management
- newsletter management
- mentorship application review
- legacy content moderation
- protected admin-only routes

### Legacy Vault
The Legacy Vault is intended to preserve chapter history and submissions over time.

This system is designed to support:

- member-submitted memories or archival content
- admin review and moderation
- release scheduling tied to graduation timeline
- long-term preservation of chapter history

---

## Tech Stack

This project is built with a modern full-stack TypeScript web stack.

### Frontend
- **Next.js 13+ / App Router**
- **React**
- **TypeScript**
- **Tailwind CSS**

### Backend / Infrastructure
- **Supabase**
  - database
  - authentication support
  - storage
  - server-side data access
- **Resend**
  - transactional and newsletter email delivery
- **Vercel**
  - deployment and hosting

---

## Why This Project Exists

Many chapters do a good job of building brotherhood while students are on campus, but much of that connection fades after graduation. Information gets lost, communication becomes inconsistent, and future brothers lose access to valuable alumni relationships.

This project aims to solve that by building a dedicated chapter platform that can grow over time.

The website is meant to:

- improve continuity between current members and alumni
- preserve chapter history
- organize communications
- strengthen professional connections
- give the chapter a more permanent digital infrastructure

---

## Project Goals

### Short-Term Goals
- launch a secure member-ready site
- collect accurate member information
- enable account claim/login flows
- support chapter announcements and newsletters
- establish a functional admin workflow

### Long-Term Goals
- create a lasting alumni network
- improve chapter-to-alumni engagement
- support mentorship and professional opportunities
- preserve chapter history in a structured way
- give future leadership a scalable digital foundation

---

## Architecture Summary

At a high level, the platform is structured around a few major systems:

### Public-Facing Website
Public pages communicate the chapter’s identity, mission, and offerings. These pages may include marketing-style content, information for alumni, and entry points into member-specific systems.

### Protected Member Layer
Members and alumni access protected sections of the site after authentication or account claim verification.

### Admin Layer
Administrators can manage content, imports, approvals, and operational workflows through protected admin routes.

### Database Layer
Supabase stores chapter records, application data, newsletter records, private details, and other system data.

### Email Layer
Resend handles outward communication such as newsletter delivery or automated workflow notifications.

---

## Environment Variables

This project relies on environment variables for local development and deployment.

Create a `.env.local` file in the project root and configure the required values.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

NEXT_PUBLIC_SITE_URL=http://localhost:3000

RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_sender_email
