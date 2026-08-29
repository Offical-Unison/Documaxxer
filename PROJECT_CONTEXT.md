# DOCUMAXXER PROJECT CONTEXT
## Complete Development Handoff

You are taking over development of an existing web application called **Documaxxer**.

Treat this document as the project's current source of truth unless the existing codebase clearly contradicts it. Before changing code, inspect the existing implementation and preserve working functionality.

============================================================
1. PROJECT OVERVIEW
============================================================

App name:

Documaxxer

Concept:

A modern, Philippines-focused document builder platform for creating Resumes, Curriculum Vitae (CVs), Cover Letters, and professional career documents.

The user should be able to:

1. Enter the website landing page.
2. Select a target document type (Resume, Curriculum Vitae, Cover Letter).
3. Choose a document template.
4. Fill out their document details through a guided multi-step builder or modular block manager.
5. Customize layout, typography, colors, and block arrangement.
6. See a live, real-time document preview.
7. See basic document statistics (Word Count, Completion Rate, Estimated Page Count).
8. Generate and download the document as:
   - PDF
   - Fully editable DOCX

The application does NOT require an account for the current MVP.

The entire current MVP operates client-side.

============================================================
2. PRODUCT POSITIONING
============================================================

Documaxxer is primarily designed for:

- Philippine users
- College students
- Fresh graduates
- Internship applicants
- Entry-level job seekers
- Experienced professionals needing tailored career documents

The product should feel modern and slightly playful through its branding ("Documaxxer" = Document + Max + -er -> "Max your documents"), but the rendered document output must remain crisp and professional.

Do not make the UI itself childish or overly meme-like.

============================================================
3. PHILIPPINES-FOCUSED EXPERIENCE
============================================================

The application should use Philippine-oriented examples and placeholders across forms and sample views.

Use:

Name:
John Doe

Phone:
0917 123 4567

Location:
Cebu City, Philippines

Email:
john.doe@email.com

LinkedIn:
linkedin.com/in/johndoe

GitHub:
github.com/johndoe

Portfolio:
johndoe.dev

These are PLACEHOLDERS ONLY. Do not insert them as actual document data.

Avoid US-specific defaults such as:

- +1 phone numbers
- US addresses
- US ZIP codes

Use Philippine conventions where appropriate (e.g., K-12 strands like STEM/ABM/HUMSS, Philippine university names).

============================================================
4. TARGET DOCUMENT TYPES & SECTIONS
============================================================

Documaxxer supports flexible document types:

1. **Resume**: Concise, 1-2 page career document focused on targeted work history, core skills, and key accomplishments.
2. **Curriculum Vitae (CV)**: Comprehensive document detailing academic achievements, research, publications, and professional trajectory.
3. **Cover Letter**: Targeted introduction letter complementing job applications.

The document builder should not assume every document or profession requires identical sections. Sections are customizable and modular.

Core sections:

- Personal Information
- Professional Summary
- Work Experience
- Education
- Skills

Optional / Dynamic sections:

- Projects
- Certifications
- Awards
- Volunteer Experience
- Languages
- Interests

Projects are especially useful for:

- IT / CS students
- Engineering students
- Fresh graduates
- Applicants building early-career portfolios

Projects are optional and configurable.

============================================================
5. CURRENT TECH STACK
============================================================

The current stack is:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Context + useReducer
- Lucide React (Icons)
- docx (Native DOCX Generation)

State management:

React Context + useReducer as the single client-side source of truth.

Do NOT introduce:

- Redux
- Zustand
- External state stores

Architecture:

100% Client-side for the current MVP. No backend, database, authentication, or user accounts.

============================================================
6. STATE & DOCUMENT DATA MODEL
============================================================

The application maintains a central document state.

The builder form uses this shared state as the single source of truth.

The document state contains:

- Document Type (`resume`, `cv`, `cover-letter`)
- Selected Template & Styling options (primary color, typography font family, text size)
- Personal Information
- Summary / Cover Letter body
- Work Experience entries
- Education entries
- Skills entries
- Additional section entries & block order configuration

The reducer supports operations such as updating fields, adding/editing/removing list entries, switching templates/styles, and reordering document blocks.

============================================================
7. BUILDER FORM FLOW
============================================================

The builder features a multi-step sequential workflow:

STEP 1: Personal Information + Summary
STEP 2: Work Experience
STEP 3: Education
STEP 4: Skills
STEP 5: Additional Sections & Layout Customization

Navigation rules:

- Free backward navigation.
- Forward navigation requires passing validation rules for the current step.
- User data persists across steps without duplication or unintended resets.

============================================================
8. STEP 1: PERSONAL INFORMATION + SUMMARY
============================================================

Fields:

- Full Name
- Professional Title
- Email
- Phone Number
- City / Country
- LinkedIn
- GitHub
- Portfolio Website
- Professional Summary (multiline textarea)

Required:
- Full Name
- Professional Title
- Email
- Phone Number
- Location
- Summary

Optional:
- LinkedIn, GitHub, Portfolio

============================================================
9. STEP 2: WORK EXPERIENCE
============================================================

Work experience is OPTIONAL (catering to students/fresh grads).

Fields per entry:
- Company / Organization
- Job Title
- Location
- Start Date & End Date
- "Currently Working" checkbox (disables End Date)
- Description / Responsibilities

Supports dynamic Add, Edit, Remove actions.

============================================================
10. STEP 3: EDUCATION
============================================================

Supports multiple education categories:
1. College / University (School, Degree, Field of Study, Dates, Currently Studying, Academic Awards)
2. High School (School, Strand / Program, Dates, Currently Studying, Academic Awards)

At least one education entry is required. Academic awards/honors (e.g. Dean's Lister, Cum Laude, Best Thesis) can be attached directly to education entries.

============================================================
11. STEP 4: SKILLS
============================================================

Interactive chip / tag input for skills (e.g. React, TypeScript, Java, SQL).

Behavior:
- Type skill & press Enter / click Add.
- Chip creation with individual removal capability.
- Duplicate prevention & validation. At least one skill required.

============================================================
12. STEP 5: ADDITIONAL SECTIONS & BLOCK MANAGEMENT
============================================================

Card-based grid UI allowing users to activate optional sections:

- Projects ("Recommended for students")
- Certifications
- Awards
- Volunteer Experience
- Languages
- Interests

Each section supports structured entry additions, editing, and deletion.

============================================================
13. CURRENT UI DIRECTION
============================================================

The application employs a dual-design system approach:

1. **APP UI (Documaxxer Platform)**:
   - Modern glassmorphism inspiration (translucency, subtle blur, depth, thin borders, soft dark/light contrast).
   - Primary accents: Indigo / Blue palette (`#2563EB`).
   - Clean navigation, responsive layouts, interactive card grids.

2. **DOCUMENT OUTPUT (Rendered Preview & Exports)**:
   - Clean, highly readable, printable, and ATS-friendly layout.
   - Traditional typography and crisp document spacing.
   - Completely free of glassmorphism, translucency, or non-standard visual effects.

============================================================
14. LIVE PREVIEW & STYLING CONTROLS
============================================================

- Instant, real-time live preview updates as form fields or section blocks change.
- Styling customization controls:
  - Primary color palette selection.
  - Typography font family selection (Inter, Roboto, Merriweather, etc.).
  - Font size & line height adjustments.
  - Dynamic block reordering.

============================================================
15. DOCUMENT EXPORT
============================================================

1. **PDF Export**: Clean print rendering matching the live preview template.
2. **DOCX Export**: Genuine editable Microsoft Word document generated via the `docx` library with proper paragraph, table, and list structures.

============================================================
16. DEVELOPMENT RULES & WORKFLOW
============================================================

- Client-side MVP focus. Do not add backend/database/auth unless requested.
- Token efficiency & minimal code churn: modify existing components rather than rewriting from scratch.
- Maintain existing state architecture and TypeScript typings.
- Work incrementally and test changes thoroughly.

============================================================
END OF DOCUMAXXER PROJECT CONTEXT
============================================================
