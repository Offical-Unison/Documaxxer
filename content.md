# DOCUMAXXER — CONTINUATION, RESTRUCTURING, PERSISTENCE & TEMPLATE SYSTEM IMPLEMENTATION PROMPT
 
You are continuing development of an EXISTING application named **Documaxxer**.
 
This is NOT a greenfield project.
 
You MUST NOT rebuild, reset, replace, or unnecessarily rewrite the application.
 
Your first responsibility is to understand the existing project completely, determine what has already been implemented, determine what is partially implemented, identify the current development milestone, and then continue from the earliest milestone that is materially incomplete.
 
The existing project was provided as a ZIP/archive containing the complete current codebase.
 
---
 
# CRITICAL FIRST RULE — DO NOT START CODING IMMEDIATELY
 
Before modifying ANY implementation code:
 
1. Inspect the entire repository.
2. Inspect the existing directory structure.
3. Read all existing documentation.
4. Read `PROJECT_CONTEXT.md`.
5. Inspect the application routes.
6. Inspect reusable components.
7. Inspect the current React Context/reducer architecture.
8. Inspect the document data models.
9. Inspect the current templates.
10. Inspect the live preview implementation.
11. Inspect typography handling.
12. Inspect DOCX export.
13. Inspect PDF/print export.
14. Inspect localStorage/autosave behavior.
15. Inspect package dependencies.
16. Inspect anything related to templates, builder sections, fonts, layouts, document types, and exports.
 
DO NOT assume something is missing just because this prompt mentions it.
 
The codebase is the primary evidence of implementation status.
 
---
 
# EXISTING PROJECT INFORMATION
 
The current project already includes at least the following architecture and capabilities:
 
* Next.js 15 App Router
* React 19
* TypeScript
* Tailwind CSS
* React Context
* `useReducer`
* Client-side document state
* Resume builder
* Curriculum Vitae builder
* Multiple resume/CV templates
* Dynamic document sections
* Live preview
* Font selection
* Shared typography constants
* Document persistence through localStorage
* Native editable DOCX generation using the `docx` package
* Print/PDF-oriented rendering
* Existing builder routes
* Existing template routes
* Existing document form and preview components
 
The project currently contains modules similar to:
 
```text
app/
components/
components/builder/
components/layout/
components/landing/
components/theme/
components/ui/
 
context/
hooks/
lib/
lib/export/
styles/
templates/
types/
utils/
```
 
There is also an existing:
 
```text
PROJECT_CONTEXT.md
```
 
There is currently a shared typography implementation similar to:
 
```text
lib/document-typography.ts
```
 
and a DOCX exporter similar to:
 
```text
lib/export/docx-export.ts
```
 
Do not destroy these systems merely to create newer versions.
 
Refactor them only when necessary.
 
---
 
# CORE DEVELOPMENT PHILOSOPHY
 
Follow these rules throughout the project:
 
## 1. PRESERVE WORKING FEATURES
 
Existing functionality must continue working unless replacing it is absolutely necessary.
 
Do not regress:
 
* Resume editing
* CV editing
* Templates
* Live preview
* Font selection
* Section management
* Dynamic sections
* Autosave
* DOCX export
* PDF export
* Existing responsive behavior
 
---
 
## 2. DO NOT CREATE DUPLICATE SYSTEMS
 
Before creating:
 
* a component
* hook
* context
* utility
* type
* exporter
* renderer
* template engine
* database model
* form abstraction
 
search the repository first.
 
Reuse or extend existing implementations whenever reasonable.
 
---
 
## 3. SINGLE SOURCE OF TRUTH
 
Avoid situations where the preview, PDF exporter, and DOCX exporter each independently define typography or layout.
 
Where possible, centralize document presentation information.
 
Examples:
 
```text
DocumentStyleDefinition
TypographyDefinition
SpacingDefinition
TemplateDefinition
SectionDefinition
DocumentSchema
```
 
The same document configuration should drive:
 
```text
Builder
↓
Live Preview
↓
PDF
↓
DOCX
```
 
rather than maintaining three unrelated implementations.
 
---
 
# MILESTONE 0 — PROJECT AUDIT AND CURRENT-MILESTONE DETECTION
 
This milestone is MANDATORY before implementation.
 
Create a formal audit of the existing repository.
 
Determine:
 
```text
Fully implemented
Partially implemented
Missing
Broken
Technically present but incomplete
Needs refactoring
```
 
for every major feature.
 
---
 
## Determine the Current Milestone
 
You must infer the application's development state from the source code.
 
Do NOT simply begin from Milestone 1.
 
First determine:
 
> "Which milestone does the existing application currently appear to be in?"
 
Then determine:
 
> "What is the EARLIEST milestone that still contains substantial missing or incomplete functionality?"
 
Development resumes from THAT milestone.
 
Example:
 
```text
Milestone 1 — 100%
Milestone 2 — 100%
Milestone 3 — 80%
Milestone 4 — 25%
Milestone 5 — 0%
```
 
Then resume from:
 
```text
Milestone 3
```
 
Complete the missing Milestone 3 functionality before moving forward.
 
---
 
# CREATE A NEW `.context` DIRECTORY
 
The project currently contains `PROJECT_CONTEXT.md`.
 
Do NOT delete it.
 
Instead, create:
 
```text
.context/
```
 
at the project root.
 
This directory becomes the structured development knowledge base for Claude and future developers.
 
Recommended structure:
 
```text
.context/
├── README.md
├── PROJECT.md
├── ARCHITECTURE.md
├── FILE_STRUCTURE.md
├── CURRENT_STATE.md
├── MILESTONES.md
├── DATABASE.md
├── AUTHENTICATION.md
├── DOCUMENT_MODEL.md
├── TEMPLATE_SYSTEM.md
├── TEMPLATE_BUILDER.md
├── EXPORT_SYSTEM.md
├── TYPOGRAPHY.md
├── AUTOFILL.md
├── DESIGN_SYSTEM.md
├── DEVELOPMENT_RULES.md
├── DECISIONS.md
└── CHANGELOG.md
```
 
You may add additional context files where useful.
 
---
 
# `.context/README.md`
 
Explain that all AI agents or developers working on Documaxxer MUST read the context directory before making meaningful architectural changes.
 
Recommended reading order:
 
```text
1. .context/PROJECT.md
2. .context/CURRENT_STATE.md
3. .context/MILESTONES.md
4. .context/ARCHITECTURE.md
5. relevant feature-specific context
6. existing source code
```
 
Explicitly state:
 
> Context files are guidance, but the actual source code remains the final authority when documentation and implementation disagree.
 
---
 
# `.context/CURRENT_STATE.md`
 
This is especially important.
 
Document:
 
* current milestone
* completion percentage
* implemented features
* partially implemented features
* missing features
* known technical debt
* known bugs
* current architecture
* next recommended task
 
Use a structure similar to:
 
```md
# Current Development State
 
Current milestone:
Milestone X
 
Overall status:
Approximately XX%
 
## Complete
 
...
 
## Partial
 
...
 
## Missing
 
...
 
## Immediate Next Task
 
...
```
 
Update this file after each milestone.
 
---
 
# `.context/MILESTONES.md`
 
Create the authoritative milestone tracker.
 
Every milestone must have:
 
```text
Purpose
Dependencies
Tasks
Acceptance criteria
Status
Completion %
Implementation notes
```
 
Use checkboxes.
 
Example:
 
```md
## Milestone 4 — Unified Export Rendering
 
Status: IN PROGRESS
Completion: 65%
 
- [x] Shared typography tokens
- [x] DOCX font mapping
- [ ] Shared layout model
- [ ] PDF parity
- [ ] DOCX spacing parity
```
 
---
 
# MILESTONE 1 — PROJECT STRUCTURE CLEANUP
 
Do NOT restructure simply for aesthetic reasons.
 
Improve the codebase where it clearly improves maintainability.
 
The archive currently contains generated directories such as:
 
```text
.next/
```
 
and Git metadata.
 
Make sure generated build files are not treated as project source.
 
Confirm `.gitignore` appropriately excludes:
 
```text
.next
node_modules
.env
.env.local
.env.*.local
*.log
```
 
Do not delete Git functionality from the user's real repository.
 
If the archive itself contains `.git`, simply avoid treating it as application architecture.
 
---
 
# TARGET ARCHITECTURAL DIRECTION
 
The existing structure can evolve toward something similar to:
 
```text
app/
├── auth/
├── builder/
├── dashboard/
├── documents/
├── templates/
├── profile/
└── api/
 
components/
├── auth/
├── builder/
├── documents/
├── templates/
├── export/
├── layout/
├── landing/
└── ui/
 
context/
 
features/
├── auth/
├── documents/
├── templates/
├── builder/
└── export/
 
lib/
├── auth/
├── database/
├── documents/
├── export/
├── templates/
└── validation/
 
types/
 
.context/
```
 
However:
 
DO NOT blindly force this structure.
 
Move files only when it meaningfully improves boundaries.
 
Preserve working imports and functionality.
 
---
 
# MILESTONE 2 — FORMALIZE THE DOCUMENT ENGINE
 
Before implementing accounts and database persistence, formalize what constitutes a document.
 
The existing `DocumentData` types should be inspected and extended instead of arbitrarily replaced.
 
Documaxxer must eventually support:
 
```text
User
Template
Saved Document
Template Schema
Template Sections
Template Fields
User Profile Data
Document Styling
Document Content
```
 
Clearly separate:
 
```text
template definition
```
 
from:
 
```text
user-entered document content
```
 
and from:
 
```text
user profile/account information
```
 
---
 
# IMPORTANT DISTINCTION
 
There are TWO major persisted objects.
 
## TEMPLATE
 
A template defines the STRUCTURE of a document.
 
It may define:
 
* sections
* fields
* labels
* required fields
* optional fields
* repeating groups
* ordering
* typography
* page settings
* margins
* spacing
* template-specific styling
* placeholders
* default values
 
A template should NOT contain the user's actual finalized resume/CV information.
 
Example:
 
```text
Template:
Modern Software Engineer Resume
```
 
The template knows that it needs:
 
```text
Personal Information
Summary
Experience
Education
Skills
Projects
```
 
but does NOT permanently contain:
 
```text
John Doe
john@email.com
Software Engineer at Company X
```
 
---
 
# SAVED DOCUMENT
 
A Saved Document is an instance of a template containing actual data.
 
Example:
 
```text
Template:
Modern Software Engineer Resume
 
Saved Document:
John Doe — Google Application Resume
```
 
The saved document contains the user's information.
 
Therefore:
 
```text
Template ≠ Saved Document
```
 
This distinction MUST exist in:
 
* database architecture
* TypeScript models
* UI
* API
* dashboard
* template builder
* autosave system
 
---
 
# MILESTONE 3 — AUTHENTICATION
 
Add authentication because custom templates, profile data, and saved documents must belong to users.
 
Do not hard-code the database provider unless the existing project already dictates one.
 
Design the system so environment variables can configure the selected provider.
 
Choose an authentication/database approach that fits the existing Next.js architecture and minimizes unnecessary complexity.
 
Prefer a production-appropriate implementation.
 
Authentication should support at minimum:
 
```text
Sign Up
Login
Logout
Session persistence
Protected account routes
Protected saved documents
Protected user templates
```
 
Optional if architecture allows cleanly:
 
```text
Forgot password
Password reset
Email verification
OAuth
```
 
Do not delay the essential system to implement optional authentication features first.
 
---
 
# ENVIRONMENT CONFIGURATION
 
Create:
 
```text
.env.example
```
 
DO NOT place real credentials inside source control.
 
`.env.example` should describe the required variables.
 
For example, depending on the final technology:
 
```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
```
 
or provider-specific equivalents.
 
Also ensure:
 
```text
.env
.env.local
```
 
are ignored by Git.
 
Create:
 
```text
.context/DATABASE.md
.context/AUTHENTICATION.md
```
 
explaining how the user connects their own database.
 
---
 
# MILESTONE 4 — DATABASE & PERSISTENCE
 
Design persistence for at least:
 
```text
User
UserProfile
Template
TemplateVersion or TemplateSchema if required
SavedDocument
```
 
Potential conceptual relationships:
 
```text
User
 ├── UserProfile
 ├── CustomTemplates[]
 └── SavedDocuments[]
```
 
and:
 
```text
Template
 └── SavedDocuments[]
```
 
---
 
# USER PROFILE DATA
 
The user's account/profile should hold reusable information.
 
Examples:
 
```text
First name
Last name
Professional headline
Email
Phone
Location
LinkedIn
GitHub
Portfolio
Education
Skills
Work history
Projects
Certifications
Other reusable data
```
 
Do not require every field.
 
Profile fields should be reusable across document types.
 
---
 
# DATA OWNERSHIP & SECURITY
 
Every custom template must have ownership metadata.
 
Every saved document must have ownership metadata.
 
Users must never be able to retrieve another user's private documents simply by changing an ID in the URL.
 
Perform authorization checks server-side.
 
Never rely solely on:
 
```text
userId from the browser
hidden form values
client-side route protection
```
 
for data ownership.
 
---
 
# MILESTONE 5 — USER DASHBOARD
 
After authentication, create a logged-in workspace.
 
Recommended sections:
 
```text
Dashboard
├── My Documents
├── My Templates
├── Create Document
├── Create Template
└── Profile
```
 
---
 
# MY DOCUMENTS
 
Display Saved Documents.
 
Each should support:
 
```text
Open
Continue editing
Rename
Duplicate
Delete
Export PDF
Export DOCX
```
 
Useful metadata:
 
```text
Document name
Template used
Document type
Created date
Last modified date
```
 
---
 
# MY TEMPLATES
 
This is COMPLETELY DIFFERENT from My Documents.
 
Display templates created or customized by the user.
 
Actions:
 
```text
Use Template
Edit Template
Duplicate Template
Rename Template
Delete Template
```
 
Do not confuse Template editing with Document editing.
 
---
 
# MILESTONE 6 — ONE UNIVERSAL TEMPLATE BUILDER
 
This is an important architectural requirement.
 
DO NOT create:
 
```text
ResumeBuilder
CVBuilder
CoverLetterBuilder
CustomBuilder1
CustomBuilder2
```
 
as separate hardcoded systems.
 
There should ultimately be ONE generalized:
 
```text
Template Builder
```
 
and ONE generalized:
 
```text
Document Builder
```
 
which adapt themselves according to the selected template schema.
 
---
 
# DYNAMIC NUMBER OF SECTIONS
 
The Template Builder must support:
 
```text
N sections
```
 
where N is determined by the selected/template schema.
 
A template may contain:
 
```text
3 sections
7 sections
15 sections
30 sections
```
 
The Template Builder must not assume a fixed number.
 
Example:
 
```text
Template A
 
1. Personal Information
2. Experience
3. Education
4. Skills
```
 
while:
 
```text
Template B
 
1. Personal Information
2. Academic Background
3. Publications
4. Research Experience
5. Teaching Experience
6. Presentations
7. Grants
8. Professional Memberships
9. References
```
 
Both must be rendered by the SAME builder engine.
 
---
 
# TEMPLATE SCHEMA
 
Create a flexible schema.
 
Conceptually:
 
```ts
interface TemplateDefinition {
  id: string;
  ownerId?: string;
  name: string;
  description?: string;
  documentType: string;
 
  sections: TemplateSection[];
 
  styles: DocumentStyles;
 
  createdAt: Date;
  updatedAt: Date;
}
```
 
Example:
 
```ts
interface TemplateSection {
  id: string;
  type: string;
  title: string;
  order: number;
  required: boolean;
 
  fields: TemplateField[];
 
  repeatable?: boolean;
}
```
 
Example:
 
```ts
interface TemplateField {
  id: string;
  key: string;
 
  label: string;
 
  type:
    | "text"
    | "textarea"
    | "email"
    | "phone"
    | "date"
    | "url"
    | "number"
    | "select"
    | "multiselect"
    | "list"
    | "rich-text";
 
  required: boolean;
 
  placeholder?: string;
 
  profileMapping?: string;
}
```
 
Do not treat this exact example as mandatory if a better strongly typed design fits the existing codebase.
 
---
 
# TEMPLATE BUILDER FEATURES
 
Users should be able to:
 
```text
Create template
Rename template
 
Add section
Remove section
Duplicate section
Rename section
Reorder section
 
Add fields
Remove fields
Edit labels
Change field type
Make field required/optional
Set placeholders
Set profile/autofill mapping
 
Set repeatable sections
 
Customize typography
Customize margins
Customize spacing
Customize alignment
Customize section styling
```
 
Prevent destructive configurations wherever possible.
 
---
 
# TEMPLATE PREVIEW
 
Template Builder must have live preview.
 
Changing:
 
```text
font
font size
weight
line height
letter spacing
margins
alignment
section spacing
```
 
must update the preview.
 
---
 
# MILESTONE 7 — CREATE DOCUMENT FROM TEMPLATE
 
When the user chooses:
 
```text
Use Template
```
 
create a NEW Saved Document instance.
 
Do NOT modify the template itself.
 
Conceptually:
 
```text
Template
↓
Instantiate
↓
SavedDocument
↓
User enters information
↓
Autosave
```
 
---
 
# DOCUMENT BUILDER MUST BE SCHEMA-DRIVEN
 
The selected template determines:
 
```text
Which sections exist
Which fields exist
Which fields are required
Their order
Whether they repeat
Their styling
```
 
Do not hard-code the builder around only Resume and CV.
 
Existing Resume/CV forms should be carefully migrated toward the generalized system without destroying their functionality.
 
---
 
# MILESTONE 8 — USER PROFILE & AUTOFILL
 
Implement reusable profile data.
 
This enables convenience autofill.
 
Example:
 
User profile contains:
 
```text
First name: Juan
Last name: Dela Cruz
Email: juan@email.com
Phone: 09171234567
Location: Cebu City
GitHub: github.com/juan
```
 
A template may have fields mapped to:
 
```text
profile.firstName
profile.lastName
profile.email
profile.phone
profile.location
profile.github
```
 
When the user creates a document, Documaxxer detects these mappings.
 
---
 
# AUTOFILL MUST BE A SUGGESTION
 
IMPORTANT:
 
Do not silently overwrite fields.
 
Instead show suggestions.
 
Examples:
 
```text
We found information from your Documaxxer profile.
 
[Fill suggested fields]
```
 
or field-level:
 
```text
Suggested: juan@email.com
 
[Use suggestion]
```
 
Provide:
 
```text
Fill All Suggested
Review Suggestions
Dismiss
```
 
Existing user-entered document information must never be replaced without deliberate action.
 
---
 
# INTELLIGENT PROFILE MAPPING
 
Template creators should be able to associate fields with known profile attributes.
 
Examples:
 
```text
fullName
firstName
lastName
email
phone
location
headline
linkedin
github
portfolio
```
 
Later extensibility may include:
 
```text
workExperience[]
education[]
skills[]
projects[]
certifications[]
```
 
Build the mapping system so it can expand naturally.
 
---
 
# MILESTONE 9 — SAVED DOCUMENT AUTOSAVE
 
The existing builder currently uses localStorage.
 
Once authenticated persistence exists, migrate toward database-backed document saving.
 
Do NOT immediately remove localStorage.
 
Instead use it intelligently for resilience if useful.
 
Recommended behavior:
 
```text
User edits
↓
Client state updates immediately
↓
Debounced autosave
↓
Database
```
 
Possible local fallback:
 
```text
localStorage draft
```
 
for unsynchronized changes.
 
Display save states such as:
 
```text
Saving...
Saved
Unsaved changes
Offline draft
Save failed
```
 
Never save on every keystroke without debouncing.
 
---
 
# MILESTONE 10 — TRUE 1:1 EXPORT PARITY
 
THIS IS A MAJOR FEATURE.
 
Documaxxer must aim for extremely high visual consistency between:
 
```text
LIVE PREVIEW
PDF
DOCX
```
 
The existing application already contains shared typography values and a native DOCX exporter.
 
Build upon that architecture.
 
Do NOT simply create another unrelated exporter.
 
---
 
# DEFINITION OF 1:1
 
The following attributes should remain consistent wherever the output format supports them:
 
```text
Text content
Capitalization
Font family
Font size
Font weight
Italic
Underline
Text color
Alignment
Line height
Letter spacing
Paragraph spacing
Section spacing
Bullet indentation
List spacing
Margins
Page size
Header spacing
Column widths
Borders
Section order
Section labels
Dates
Links
Page breaks
Tab stops
Content ordering
```
 
The user should not create something in Preview and receive a visibly different layout in PDF or DOCX.
 
---
 
# EXPORT ARCHITECTURE
 
Avoid:
 
```text
Preview Renderer
with separate styling logic
 
PDF Renderer
with separate styling logic
 
DOCX Renderer
with separate styling logic
```
 
Instead move toward:
 
```text
Document Data
+
Template Schema
+
Normalized Style Tokens
+
Normalized Layout Model
        ↓
 ┌──────────────┐
 │ Render Model │
 └──────────────┘
       ↓
Preview Renderer
PDF Renderer
DOCX Renderer
```
 
Create shared objects such as:
 
```ts
interface TypographyToken {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  italic?: boolean;
  underline?: boolean;
  lineHeight: number;
  letterSpacing?: number;
}
```
 
and:
 
```ts
interface DocumentStyleTokens {
  page: ...
  body: ...
  name: ...
  heading: ...
  entryTitle: ...
  subtitle: ...
  date: ...
  bullet: ...
}
```
 
Use whatever strongly typed model best fits the existing implementation.
 
---
 
# FONT PARITY
 
The application currently supports fonts similar to:
 
```text
Arial
Calibri
Times New Roman
Georgia
Helvetica
Verdana
```
 
Ensure correct mapping between:
 
```text
CSS font-family
PDF rendering
DOCX font names
```
 
Be aware:
 
A user's computer may not have every font.
 
Document this limitation.
 
When exact font embedding is technically possible and legally appropriate, architecture may support it later.
 
Do not silently claim perfect font rendering across machines when the underlying format cannot guarantee it.
 
---
 
# PDF EXPORT
 
PDF should represent the live document as precisely as practical.
 
Confirm:
 
```text
A4 dimensions
margins
font sizes
page breaks
spacing
section borders
columns
alignment
```
 
Do not accidentally export:
 
```text
Builder UI
buttons
navigation
form controls
background effects
glassmorphism
```
 
Only export the actual document.
 
---
 
# DOCX EXPORT
 
DOCX must remain:
 
```text
genuinely editable
```
 
Do NOT export the entire document as an image inside Word.
 
Do NOT convert a screenshot into DOCX.
 
Use actual OOXML structures:
 
```text
Paragraph
TextRun
Tables where necessary
Bullets
Tabs
Page settings
Borders
Spacing
```
 
The existing native `docx` implementation should be extended.
 
---
 
# EXPORT REGRESSION TESTING
 
Create sample documents that stress the exporter.
 
Test:
 
```text
Very long names
Long summaries
Multiple experiences
Multiple education records
Multiple optional sections
Many bullets
URLs
Long URLs
Different fonts
Different templates
Multi-page documents
Special characters
Unicode
Philippine addresses
Very long organization names
```
 
Create export parity tests wherever realistically possible.
 
Document known format limitations.
 
---
 
# MILESTONE 11 — CUSTOM TEMPLATE VERSIONING & SAFETY
 
Custom templates may eventually change after documents have been created from them.
 
Avoid this problem:
 
```text
User edits template
↓
Old saved documents unexpectedly change
```
 
Saved Documents should preserve the template/layout state needed to render themselves.
 
Possible strategies:
 
```text
Template versioning
```
 
or:
 
```text
SavedDocument contains a template snapshot
```
 
Choose the cleaner approach for the application.
 
Document the decision in:
 
```text
.context/DECISIONS.md
```
 
---
 
# MILESTONE 12 — DOCUMENT MANAGEMENT QUALITY
 
Improve document management.
 
Support:
 
```text
Rename
Duplicate
Delete
Autosave
Last updated
Template association
Search
Sort
```
 
Potential sorting:
 
```text
Last modified
Created date
Name
Document type
```
 
Do not overbuild this before the foundational data model is stable.
 
---
 
# MILESTONE 13 — TEMPLATE MANAGEMENT QUALITY
 
Improve template management.
 
Support:
 
```text
Create
Edit
Duplicate
Delete
Rename
Preview
Use Template
```
 
Clearly label:
 
```text
Built-in Template
```
 
versus:
 
```text
My Template
```
 
Built-in application templates should not be accidentally editable globally.
 
If the user wants to customize one:
 
```text
Duplicate / Customize
```
 
it into their account.
 
---
 
# MILESTONE 14 — UX POLISH
 
Once architecture is stable, improve UX.
 
Focus on:
 
```text
Loading states
Empty states
Autosave feedback
Error states
Authentication transitions
Responsive design
Mobile builder
Confirmation dialogs
Unsaved changes
Keyboard navigation
Accessibility
```
 
Do not prioritize cosmetic redesign ahead of the core architecture.
 
---
 
# MILESTONE 15 — QUALITY ASSURANCE
 
Before marking implementation complete:
 
Run:
 
```bash
npm run lint
npm run build
```
 
and any relevant tests.
 
Fix:
 
```text
TypeScript errors
ESLint errors
broken imports
hydration errors
runtime errors
invalid environment handling
```
 
Do not leave the project in a state where production build fails.
 
---
 
# REQUIRED DOCUMENTATION UPDATES
 
Every completed milestone must update:
 
```text
.context/CURRENT_STATE.md
.context/MILESTONES.md
.context/CHANGELOG.md
```
 
If an architectural decision changes:
 
```text
.context/DECISIONS.md
```
 
must be updated as well.
 
---
 
# CHANGELOG FORMAT
 
Use something similar to:
 
```md
## YYYY-MM-DD
 
### Added
- ...
 
### Changed
- ...
 
### Fixed
- ...
 
### Architecture
- ...
```
 
---
 
# DEVELOPMENT HANDOFF PROTOCOL
 
At the START of every future development session:
 
Read:
 
```text
.context/README.md
.context/PROJECT.md
.context/CURRENT_STATE.md
.context/MILESTONES.md
.context/ARCHITECTURE.md
```
 
Then read any feature-specific context relevant to the requested task.
 
Then inspect the actual implementation.
 
---
 
# SELF-CORRECTING MILESTONE BEHAVIOR
 
This is important.
 
Suppose `.context/CURRENT_STATE.md` says:
 
```text
Current Milestone: 8
```
 
but inspection shows:
 
```text
Milestone 6 is only 50% implemented.
```
 
DO NOT blindly continue Milestone 8.
 
Claude must:
 
1. identify the inconsistency;
2. update the milestone documentation;
3. return to Milestone 6;
4. complete the materially missing parts;
5. verify them;
6. then continue forward.
 
The milestone tracker is a development guide, NOT permission to ignore unfinished foundational work.
 
---
 
# IMPLEMENTATION ORDER
 
Unless existing code inspection proves a different dependency order is necessary, follow approximately:
 
```text
M0 — Audit Existing Project
 
M1 — Clean & Formalize File Structure
       ↓
M2 — Formalize Document / Template Data Model
       ↓
M3 — Authentication
       ↓
M4 — Database Persistence
       ↓
M5 — Dashboard
       ↓
M6 — Universal Template Builder
       ↓
M7 — Template → Saved Document Workflow
       ↓
M8 — User Profile + Autofill Suggestions
       ↓
M9 — Database Autosave
       ↓
M10 — 1:1 Preview / PDF / DOCX Export
       ↓
M11 — Template Versioning / Snapshot Safety
       ↓
M12 — Document Management
       ↓
M13 — Template Management
       ↓
M14 — UX / Accessibility / Responsive Polish
       ↓
M15 — QA / Production Build
```
 
However, existing completed functionality should be credited.
 
For example, DOCX export already exists.
 
Therefore Milestone 10 is NOT "build DOCX exporting from zero."
 
It is:
 
> Audit, normalize, improve, and verify DOCX/PDF/Preview parity.
 
---
 
# DO NOT RESET THE EXISTING APPLICATION
 
Forbidden behavior includes:
 
```text
Deleting most components and starting over
Replacing the entire builder unnecessarily
Removing existing templates
Replacing Context/useReducer just because another state library exists
Destroying localStorage before persistence migration works
Replacing editable DOCX export with an image
Creating entirely separate builders for each document type
Hardcoding every template
Hardcoding every builder section
```
 
Incremental migration is strongly preferred.
 
---
 
# DATABASE PROVIDER RULE
 
If no backend/database provider currently exists:
 
Choose a reasonable technology based on:
 
```text
Next.js compatibility
authentication support
relational data needs
JSON/document schema support
security
local development
deployment simplicity
maintainability
```
 
A relational database such as PostgreSQL is strongly appropriate because Documaxxer now needs relationships between:
 
```text
users
profiles
templates
template versions
saved documents
```
 
An ORM may be used where appropriate.
 
However, keep provider-specific code behind clear boundaries.
 
Document the decision and environment variables.
 
---
 
# TEMPLATE STORAGE GUIDANCE
 
Store custom templates in the database.
 
Do NOT store user-created templates only in localStorage.
 
Persist approximately:
 
```text
Template metadata
Template schema
Layout configuration
Typography configuration
Ownership
Version
Creation/update timestamps
```
 
Built-in templates may continue to exist in code if appropriate.
 
A hybrid model is acceptable:
 
```text
Built-in templates → source code
 
User templates → database
```
 
---
 
# SAVED DOCUMENT STORAGE GUIDANCE
 
Saved Documents belong in the database.
 
Store approximately:
 
```text
id
userId
name
documentType
templateId
templateVersion/templateSnapshot
content/data
style overrides if applicable
createdAt
updatedAt
```
 
Use structured JSON where it simplifies dynamic template values.
 
Do not create hundreds of database columns for every possible custom field.
 
Use an appropriate combination of relational fields and JSON.
 
---
 
# AUTOFILL DATA FLOW
 
Target flow:
 
```text
User Account
      ↓
User Profile
      ↓
Reusable profile attributes
      ↓
Template field mappings
      ↓
Create Saved Document
      ↓
Detect matching fields
      ↓
Show autofill suggestions
      ↓
User accepts
      ↓
Document fields populated
```
 
Never confuse profile information with document information.
 
A document may intentionally contain different information from the profile.
 
---
 
# TEMPLATE DATA FLOW
 
Target architecture:
 
```text
Template Definition
      ↓
Template Renderer
      ↓
Dynamic Builder
      ↓
Document Data
      ↓
Normalized Render Model
   ↙      ↓       ↘
Preview  PDF     DOCX
```
 
The closer these three exports are to using the same normalized representation, the easier true parity becomes.
 
---
 
# VERY IMPORTANT: EXISTING HARDCODED TEMPLATE MIGRATION
 
Existing templates such as:
 
```text
ATS Classic
Modern Tech
Executive
Academic
Research
Professional
```
 
must continue working.
 
Do NOT delete them during the template-engine migration.
 
Instead progressively represent them using the generalized template schema.
 
They should become built-in templates running through the same underlying engine wherever practical.
 
---
 
# BACKWARD COMPATIBILITY
 
Existing data may already exist in localStorage under the current application state format.
 
Avoid immediately breaking it.
 
If the state/data model changes substantially:
 
implement a migration strategy.
 
Example:
 
```ts
migrateDocumentStateV1ToV2(...)
```
 
Use state/schema versions where appropriate.
 
---
 
# DATABASE MIGRATIONS
 
Database schema changes must be reproducible.
 
Do not make undocumented manual database changes.
 
Include migration files through whichever ORM/database migration tool is selected.
 
---
 
# ERROR HANDLING
 
Implement clear failure handling for:
 
```text
Authentication
Database loading
Saving
Deleting
Template creation
Document creation
Exports
Profile loading
Autofill
```
 
User-facing errors should be readable.
 
Developer-facing logs should be useful without leaking private information.
 
---
 
# SECURITY REQUIREMENTS
 
At minimum:
 
* password handling must use the authentication provider/library safely;
* never store plain-text passwords;
* never expose secrets client-side;
* verify document ownership server-side;
* verify template ownership server-side;
* validate incoming API/server-action data;
* protect mutation endpoints/actions;
* do not trust arbitrary client IDs;
* sanitize or safely render user-provided content where relevant.
 
---
 
# PERFORMANCE REQUIREMENTS
 
Avoid:
 
```text
Saving to database on every keystroke
Rendering the entire builder unnecessarily
Loading every saved document's full JSON on dashboard startup
Duplicating massive template objects
```
 
Use:
 
```text
debouncing
memoization where justified
server/client boundaries appropriately
lightweight list queries
lazy loading where appropriate
```
 
Do not prematurely optimize every component.
 
---
 
# FINAL ACCEPTANCE CRITERIA
 
The milestone sequence is considered successful only when:
 
1. Existing Documaxxer functionality still works.
2. The repository has a useful `.context/` knowledge base.
3. Claude can determine the development state by reading `.context`.
4. Milestones accurately represent implementation status.
5. Authentication works.
6. Users have persistent accounts.
7. User profiles exist.
8. Custom templates belong to accounts.
9. Saved documents belong to accounts.
10. Templates and Saved Documents are clearly separate concepts.
11. Users can create/edit custom templates.
12. A single generalized Template Builder handles N sections.
13. A single generalized Document Builder renders fields from template schemas.
14. Existing built-in templates still work.
15. Users can create Saved Documents from templates.
16. Saved Documents autosave.
17. User profile information can produce autofill suggestions.
18. Autofill never unexpectedly overwrites document data.
19. Preview, PDF, and DOCX share centralized style/layout definitions wherever technically possible.
20. PDF closely matches preview.
21. DOCX closely matches preview while remaining editable.
22. Font, size, weight, spacing, alignment, margins, and document hierarchy are preserved across formats wherever those formats support them.
23. Templates cannot unexpectedly alter historical documents.
24. Authorization prevents cross-user access.
25. Production build succeeds.
26. Documentation reflects the actual final implementation.
 
---
 
# YOUR FIRST EXECUTION TASK
 
DO NOT implement authentication immediately.
 
Your first execution sequence must be:
 
### STEP 1
 
Inspect the complete repository.
 
### STEP 2
 
Read:
 
```text
PROJECT_CONTEXT.md
```
 
and all relevant current implementation files.
 
### STEP 3
 
Produce an internal implementation map.
 
Identify:
 
```text
Current architecture
Existing features
Partially complete features
Missing features
Technical debt
Potential migration risks
```
 
### STEP 4
 
Create:
 
```text
.context/
```
 
and populate the initial context files based on ACTUAL repository findings.
 
Do not merely copy this prompt into them.
 
The files must describe the real project.
 
### STEP 5
 
Create the milestone tracker.
 
Mark already-existing functionality appropriately.
 
For example, if the project already has a strong DOCX exporter:
 
```text
DOCX Generation: IMPLEMENTED
Export Parity: PARTIAL
```
 
rather than claiming exporting does not exist.
 
### STEP 6
 
Determine the current effective milestone.
 
### STEP 7
 
Determine the earliest materially incomplete milestone.
 
### STEP 8
 
Begin implementation from there.
 
### STEP 9
 
After completing that milestone:
 
```text
run lint
run type checking/build
fix regressions
update .context
```
 
### STEP 10
 
Continue to the next milestone without resetting the application.
 
---
 
# CONTINUATION BEHAVIOR
 
You are authorized to work through milestones progressively.
 
Do not stop after creating a plan.
 
Do not simply tell me what should be implemented.
 
Actually modify the project.
 
At the end of each development pass, provide:
 
```text
CURRENT MILESTONE
COMPLETION
 
FILES CREATED
 
FILES MODIFIED
 
FEATURES COMPLETED
 
MIGRATIONS CREATED
 
ENVIRONMENT VARIABLES REQUIRED
 
TESTS / VALIDATION PERFORMED
 
KNOWN ISSUES
 
NEXT MILESTONE
```
 
Keep this summary concise.
 
The source code and `.context` files should contain the deeper technical details.
 
---
 
# FINAL PRINCIPLE
 
Documaxxer is evolving from:
 
```text
Client-side Resume/CV Builder
```
 
into:
 
```text
Account-based Dynamic Document & Template Platform
```
 
while PRESERVING what is already good about the application.
 
The architectural goal is:
 
```text
User
 ├── Profile
 ├── Templates
 │     └── Dynamic schema
 │
 └── Saved Documents
       ├── Template snapshot/version
       ├── User-entered content
       └── Autosaved state
                 ↓
          Unified Render Model
          ↙       ↓       ↘
       Preview   PDF     DOCX
```
 
Build toward this progressively.
 
Do not rebuild Documaxxer.
 
Understand it, document it, stabilize it, generalize it, and extend it.