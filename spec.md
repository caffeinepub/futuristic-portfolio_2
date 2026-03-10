# Futuristic Portfolio Website

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full single-page portfolio website with 7 sections: Hero, About Me, Skills & Technologies, Projects/Portfolio, Experience, Certifications/Achievements, Contact
- 3D animated background using Three.js (floating particles / geometric shapes)
- Contact form that stores submissions in the backend
- Sticky navigation bar with smooth scroll to sections
- Dark mode futuristic tech aesthetic with strong typography
- Responsive layout for desktop, tablet, mobile
- Smooth scroll animations and motion effects on section reveal

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend (Motoko)
- `submitContact(name: Text, email: Text, message: Text): async Result` -- stores contact form submissions
- `getContactSubmissions(): async [ContactSubmission]` -- admin retrieval of messages
- ContactSubmission record: id, name, email, message, timestamp

### Frontend
- Three.js 3D animated background (floating particles + wireframe geometry) rendered on canvas behind all content
- Sticky top nav with section links + smooth scroll
- Hero: Full-screen, name, title badges (Project Manager | QA | Developer), tagline, CTA button
- About Me: Two-column layout, photo placeholder, bio text, philosophy statement
- Skills & Technologies: Category cards (Agile/Scrum, Testing Tools, Programming Languages, Frameworks/Tools)
- Projects: Card grid with project name, description, tech stack tags, outcome metric
- Experience: Vertical timeline with role, company, dates, bullet responsibilities
- Certifications: Badge-style cards with credential name, issuer, year
- Contact: Email link, social icon links, contact form wired to backend submitContact
- Framer Motion or CSS animations for section reveal on scroll
- All interactive elements with data-ocid markers
