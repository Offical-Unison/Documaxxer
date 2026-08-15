# RESUMMAXER PROJECT CONTEXT
## Complete Development Handoff
 
You are taking over development of an existing web application called **Resummaxer**.
 
Treat this document as the project's current source of truth unless the existing codebase clearly contradicts it. Before changing code, inspect the existing implementation and preserve working functionality.
 
============================================================
1. PROJECT OVERVIEW
============================================================
 
App name:
 
Resummaxer
 
Concept:
 
A modern, Philippines-focused resume builder web application.
 
The user should be able to:
 
1. Enter the website.
2. Learn how the builder works through a short tutorial.
3. Choose a resume template.
4. Fill out their resume through a guided multi-step form.
5. See a live resume preview.
6. See basic resume statistics.
7. Generate and download the resume as:
   - PDF
   - Fully editable DOCX
 
The application does NOT require an account for the current MVP.
 
The entire current MVP should work client-side.
 
============================================================
2. PRODUCT POSITIONING
============================================================
 
Resummaxer is primarily designed for:
 
- Philippine users
- College students
- Fresh graduates
- Internship applicants
- Entry-level job seekers
 
It should still work for experienced professionals.
 
The product should feel modern and slightly playful through its branding, but the actual resume output must remain professional.
 
The name "Resummaxer" is intentionally somewhat humorous/trendy:
 
Resume + Max + -er
 
The general idea is "max your resume."
 
Do not make the UI itself childish or overly meme-like.
 
============================================================
3. PHILIPPINES-FOCUSED EXPERIENCE
============================================================
 
The application should use Philippine-oriented examples and placeholders.
 
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
 
These are PLACEHOLDERS ONLY.
 
Do not insert them as actual resume data.
 
Avoid US-specific defaults such as:
 
- +1 phone numbers
- US addresses
- US ZIP codes
 
Use Philippine conventions where appropriate.
 
============================================================
4. TARGET RESUME TYPES
============================================================
 
The resume builder should not assume that every profession needs the same sections.
 
Some sections are highly relevant to students and tech users, while others may be unnecessary for certain applicants.
 
Core sections:
 
- Personal Information
- Professional Summary
- Work Experience
- Education
- Skills
 
Optional sections:
 
- Projects
- Certifications
- Awards
- Volunteer Experience
- Languages
- Interests
 
Projects are especially useful for:
 
- IT students
- Computer Science students
- Engineering students
- Fresh graduates
- Applicants without much work experience
 
Therefore Projects should be optional, not universally required.
 
============================================================
5. CURRENT TECH STACK
============================================================
 
The planned/current stack is:
 
- Next.js
- App Router
- TypeScript
- Tailwind CSS
- React Context
- useReducer
 
State management:
 
React Context + useReducer.
 
Do NOT introduce:
 
- Redux
- Zustand
- Another global state library
 
Architecture:
 
Client-side for the current MVP.
 
Do NOT introduce:
 
- Backend
- Database
- Authentication
- User accounts
- API routes
 
There is currently no need for a backend because the MVP does not need persistent accounts or server-side business logic.
 
Possible future backend features:
 
- Accounts
- Saved resumes
- Cloud storage
- AI
- Payments
- Resume sharing
 
But these are OUT OF SCOPE for now.
 
============================================================
6. CURRENT STATE MANAGEMENT
============================================================
 
The application has a central resume state.
 
The form should use this shared state as the single source of truth.
 
The form should NOT maintain a separate duplicate copy of the complete resume.
 
The resume state should contain:
 
Personal information
Professional summary
Work experience
Education
Skills
Optional sections
 
The reducer should support operations such as:
 
- Update personal information
- Update summary
- Add experience
- Update experience
- Remove experience
- Add education
- Update education
- Remove education
- Update skills
- Add optional section
- Remove optional section
- Add optional entry
- Update optional entry
- Remove optional entry
 
Preserve the existing state architecture unless there is a genuine technical problem.
 
============================================================
7. RESUME FORM FLOW
============================================================
 
The form is NOT one long page.
 
It is divided into five sequential sections:
 
STEP 1
Personal Information + Summary
 
STEP 2
Work Experience
 
STEP 3
Education
 
STEP 4
Skills
 
STEP 5
Additional Sections
 
Only the current section should be displayed.
 
Navigation:
 
Previous
Next
 
The user can move backward freely.
 
The user can only move forward if the current step passes its validation rules.
 
Entered data must persist while moving between steps.
 
Do not duplicate or reset data when navigating.
 
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
 
Professional Summary:
 
- Multiline textarea
 
Required:
 
- Full Name
- Professional Title
- Email
- Phone Number
- Location
- Professional Summary
 
Optional:
 
- LinkedIn
- GitHub
- Portfolio
 
Use clear, human-readable validation.
 
Do not make optional contact fields required.
 
============================================================
9. STEP 2: WORK EXPERIENCE
============================================================
 
Work experience is OPTIONAL.
 
This is important because the target audience includes students and first-time applicants.
 
If the user has no experience:
 
They should be able to click Next without adding anything.
 
If the user adds an experience entry:
 
Validate the necessary fields.
 
Each experience contains:
 
- Company
- Job Title
- Location
- Start Date
- End Date
- Currently Working checkbox
- Description
 
Support multiple entries.
 
Users must be able to:
 
- Add
- Edit
- Remove
 
If Currently Working is selected:
 
- End Date should be disabled or hidden.
- End Date should not be required.
 
Do not implement AI-generated bullet points or descriptions.
 
============================================================
10. STEP 3: EDUCATION
============================================================
 
Education is designed with students in mind.
 
There are two education categories:
 
1. College / University
2. High School
 
Users should be able to add both.
 
------------------------------
COLLEGE / UNIVERSITY
------------------------------
 
Fields:
 
- School
- Degree
- Field of Study
- Start Date
- End Date
- Currently Studying
 
Example:
 
School:
Cebu Institute of Technology - University
 
Degree:
Bachelor of Science
 
Field:
Information Technology
 
Start Date:
2024
 
End Date:
2028
 
Currently Studying:
Checked
 
If Currently Studying is enabled:
 
- End Date is disabled or hidden.
- End Date is not required.
 
------------------------------
HIGH SCHOOL
------------------------------
 
Separate form.
 
Fields:
 
- School
- Strand / Program
- Start Date
- End Date
- Currently Studying
 
Example:
 
School:
Don Bosco Technical College - Cebu
 
Strand / Program:
STEM
 
Start Date:
2024
 
End Date:
2026
 
Currently Studying:
Checked
 
Users can have:
 
- College education
- High school education
- Both
 
At least one education entry is required.
 
For completed education:
 
End Date is required.
 
For currently ongoing education:
 
End Date is not required.
 
EDUCATION AWARDS / ACHIEVEMENTS
 
Each college or high school education entry should optionally support academic awards or achievements.
 
Users should be able to add multiple awards to an education entry.
 
Each award should contain:
 
- Award / Achievement Name
 
Examples:
 
- Dean's Lister
- With Honors
- Academic Excellence Award
- Best Thesis / Capstone
- Outstanding Student Award
 
This is optional.
 
Do not require an award for an education entry.
 
Keep this separate from the global "Awards" optional section, which is intended for awards not directly associated with a specific education entry.
 
============================================================
11. STEP 4: SKILLS
============================================================
 
Skills use a tag/chip interface.
 
Example:
 
Java
React
TypeScript
SQL
 
Behavior:
 
- Type skill
- Press Enter
- Skill becomes a chip
- Remove individual skills
 
Requirements:
 
- No empty skills
- Prevent accidental duplicates
- Multiple skills supported
 
At least one skill is required.
 
============================================================
12. STEP 5: ADDITIONAL SECTIONS
============================================================
 
Available optional sections:
 
1. Projects
2. Certifications
3. Awards
4. Volunteer Experience
5. Languages
6. Interests
 
The user does NOT have to add any.
 
They can finish the step without adding anything.
 
Originally this used a dropdown, but the desired UI is now a CARD-BASED selection interface.
 
The current intended UI:
 
A responsive 2-column grid on desktop.
 
One column on mobile.
 
Each card contains:
 
- Section name
- Short description
- Add action
 
Descriptions:
 
Projects:
"Showcase personal, academic, or professional projects."
 
Certifications:
"Add certifications, licenses, or completed courses."
 
Awards:
"Highlight academic or professional achievements."
 
Volunteer Experience:
"Include relevant volunteer work and organizations."
 
Languages:
"List languages and your proficiency level."
 
Interests:
"Add a few interests that represent you."
 
Projects should appear first and be slightly emphasized because Resummaxer targets students and fresh graduates.
 
Projects may have a small label:
 
"Recommended for students"
 
Do NOT make Projects mandatory.
 
When a section is added:
 
- Show an added state such as "✓ Added"
- Allow removal
- Do not allow duplicate copies of the same optional section
- Preserve existing data if other sections are added/removed
 
============================================================
13. ADDITIONAL SECTION DATA
============================================================
 
PROJECTS
 
Each project:
 
- Project Name
- Description
- Technologies
- Project URL
- GitHub URL
- Start Date
- End Date
 
Multiple projects supported.
 
CERTIFICATIONS
 
Each:
 
- Certification Name
- Issuing Organization
- Issue Date
- Expiration Date
- Credential URL
 
Multiple supported.
 
AWARDS
 
Each:
 
- Award Name
- Organization
- Date
- Description
 
Multiple supported.
 
VOLUNTEER EXPERIENCE
 
Each:
 
- Organization
- Role
- Start Date
- End Date
- Description
 
Multiple supported.
 
LANGUAGES
 
Each:
 
- Language
- Proficiency
 
Proficiency options:
 
- Beginner
- Elementary
- Intermediate
- Upper Intermediate
- Advanced
- Native
 
Multiple supported.
 
INTERESTS
 
Multiple interests using a chip/tag style input.
 
============================================================
14. CURRENT UI DIRECTION
============================================================
 
The visual direction is inspired by modern Apple-style glass interfaces.
 
Do NOT copy Apple's exact design.
 
Use the general principles:
 
- Translucency
- Subtle blur
- Depth
- Thin borders
- Soft shadows
- Generous spacing
- Clean typography
- Restrained color usage
 
Recommended palette:
 
Background:
#F5F7FA
 
Primary text:
#111827
 
Secondary text:
#6B7280
 
Primary accent:
#2563EB
 
Accent hover:
#1D4ED8
 
Success:
#16A34A
 
Error:
#DC2626
 
Primary visual identity:
 
Cool white / light gray + blue/indigo accent.
 
Do not overuse:
 
- Gradients
- Blur
- Shadows
- Bright colors
 
The glass effect should primarily be used on the Resummaxer APP UI.
 
The actual resume templates must remain:
 
- Clean
- Professional
- ATS-friendly
- Easy to print
- Easy to read
 
Do not make exported resumes look like glass UI.
 
============================================================
15. CURRENT UI / ADDITIONAL SECTIONS SCREEN
============================================================
 
The current Additional Sections UI has:
 
- Large main builder card
- Step indicators
- "5 of 5"
- Heading "Additional sections"
- Description
- Dropdown containing:
  - Projects
  - Certifications
  - Awards
  - Volunteer Experience
  - Languages
  - Interests
- Previous button
 
This dropdown should be replaced with the card-based UI described above.
 
The intended structure is approximately:
 
Build your resume                                  5 of 5
 
Personal → Experience → Education → Skills → Additional
 
Additional sections
 
Choose sections that strengthen your resume.
These are optional, so add only what is relevant to you.
 
[ Projects ]                  [ Certifications ]
Showcase your work             Add credentials
+ Add                          + Add
 
[ Awards ]                    [ Volunteer Experience ]
Highlight achievements         Show involvement
+ Add                          + Add
 
[ Languages ]                 [ Interests ]
Show language skills            Tell more about you
+ Add                           + Add
 
Previous                                      Finish
 
"Finish" is preferable to "Next" because this is the final form step.
 
However, do not implement resume generation yet if that belongs to a later milestone. Preserve or appropriately wire the existing behavior.
 
============================================================
16. FORM UX PRINCIPLES
============================================================
 
The form should feel guided rather than overwhelming.
 
Use:
 
- Clear section headings
- Helpful placeholders
- Consistent spacing
- Logical grouping
- Reusable form components
- Clear validation
- Clear Add/Remove actions
 
Avoid:
 
- One giant form
- Excessive animations
- Excessive cards
- Overengineering
- Complex interactions that do not add value
 
============================================================
17. RESUME STATISTICS
============================================================
 
The final product should show:
 
- Completion Percentage
- Word Count
- Estimated Page Count
 
These are simple analytics only.
 
DO NOT add:
 
- Resume score
- ATS score
- AI score
- Job matching
- AI suggestions
 
No AI yet.
 
============================================================
18. TEMPLATES
============================================================
 
The final product should have three original resume templates:
 
1. Classic
2. Modern
3. Sidebar
 
Requirements:
 
- Same resume data model
- Instant template switching
- Professional
- ATS-friendly
 
The templates should differ visually while remaining usable for real job applications.
 
Do not make the templates glass UI.
 
============================================================
19. LIVE PREVIEW
============================================================
 
Later milestone:
 
The user will see a live resume preview.
 
Requirements:
 
- Updates immediately while editing
- Uses central resume state
- Reflects selected template
- Closely matches exported documents
 
This has NOT been implemented as part of the current form milestone.
 
============================================================
20. EXPORT
============================================================
 
Later milestone:
 
Export:
 
- PDF
- DOCX
 
PDF:
 
- Should closely match the selected template.
 
DOCX:
 
- Must be a TRUE editable Word document.
- Must be editable in Microsoft Word.
- Should be editable in Google Docs.
- Users should be able to modify text and layout.
- Do NOT convert PDF into DOCX.
- Do NOT create a DOCX that is simply an embedded image.
 
The DOCX should use actual editable document elements.
 
============================================================
21. NO BACKEND / NO ACCOUNTS
============================================================
 
Current MVP intentionally has no:
 
- Account
- Login
- Registration
- Database
- Backend
- Cloud storage
- Resume persistence
 
The resume exists only in the current application session.
 
Do not add localStorage, database, or authentication unless explicitly requested later.
 
============================================================
22. MILESTONE ROADMAP
============================================================
 
The project is intentionally developed milestone by milestone.
 
Do not implement the entire project in one pass.
 
After each milestone:
 
- Test the implementation
- Review the code
- Fix issues
- Stop
- Wait for approval before continuing
 
------------------------------------------------------------
MILESTONE 1: PROJECT FOUNDATION
------------------------------------------------------------
 
Goal:
 
Create the architecture and foundation.
 
Implement:
 
- Next.js App Router
- TypeScript
- Tailwind CSS
- Folder structure
- React Context + useReducer
- Resume data model
- TypeScript interfaces
- Landing page
- Resume Builder page
- Responsive layout
- Placeholder components for:
  - Tutorial
  - Progress
  - Form
  - Preview
  - Statistics
  - Generate button
 
Do NOT implement:
 
- Form functionality
- Preview
- Templates
- Statistics logic
- Export
 
Milestone 1 should create a clean foundation.
 
------------------------------------------------------------
MILESTONE 2: RESUME FORM
------------------------------------------------------------
 
Goal:
 
Make the resume form fully functional.
 
Implement:
 
- Personal information
- Summary
- Work experience
- College education
- High school education
- Currently Working
- Currently Studying
- Skills
- Optional sections
- Dynamic entries
- Add/remove functionality
- Validation
- Five-step navigation
- Shared resume state
 
Navigation:
 
1. Personal + Summary
2. Work Experience
3. Education
4. Skills
5. Additional Sections
 
Validation:
 
Step 1:
Required:
- Name
- Professional Title
- Email
- Phone
- Location
- Summary
 
Step 2:
Optional.
If entries exist, validate them.
 
Step 3:
At least one education entry.
Validate required fields.
 
Step 4:
At least one skill.
 
Step 5:
Optional.
 
Do not implement:
 
- Live preview
- Templates
- PDF
- DOCX
- Statistics
- AI
 
------------------------------------------------------------
CURRENT MILESTONE 2 UI MODIFICATION
------------------------------------------------------------
 
The form already exists.
 
Do NOT rebuild it.
 
Current requested modifications:
 
1. Philippine placeholders/default examples
2. John Doe placeholder
3. Student-oriented education
4. College + High School education
5. Currently Studying
6. Five-step navigation
7. Validation before Next
8. Glass-inspired UI
9. Replace Additional Sections dropdown with card grid
 
Preserve working architecture.
 
Avoid unnecessary refactoring.
 
------------------------------------------------------------
MILESTONE 3: LIVE PREVIEW
------------------------------------------------------------
 
Goal:
 
Build the live resume preview.
 
Implement:
 
- Live preview
- Updates immediately
- Uses central resume state
- Responsive preview
- Professional typography
- Layout matching exported documents
 
Do NOT implement final export yet.
 
------------------------------------------------------------
MILESTONE 4: RESUME TEMPLATES
------------------------------------------------------------
 
Implement:
 
1. Classic
2. Modern
3. Sidebar
 
Requirements:
 
- Shared data model
- Instant switching
- ATS-friendly
- Professional
- Preview updates immediately
 
------------------------------------------------------------
MILESTONE 5: RESUME STATISTICS
------------------------------------------------------------
 
Implement:
 
- Completion Percentage
- Word Count
- Estimated Page Count
 
Update in real time.
 
Do not add AI scoring.
 
------------------------------------------------------------
MILESTONE 6: INTERACTIVE TUTORIAL
------------------------------------------------------------
 
Build the tutorial at the beginning of the builder.
 
The first section of the website/builder should explain the workflow.
 
Use a simple clickable arrow / next-prev interaction.
 
Tutorial steps:
 
1. Choose a template
2. Fill in your information
3. Preview your resume
4. Generate and download
 
Include:
 
- Previous
- Next
- Skip
 
Keep it simple.
 
------------------------------------------------------------
MILESTONE 7: EXPORT
------------------------------------------------------------
 
Implement:
 
- PDF
- Editable DOCX
 
PDF should closely match preview.
 
DOCX must be a genuine editable Word document.
 
Do not convert PDF to DOCX.
 
------------------------------------------------------------
MILESTONE 8: FINAL POLISH
------------------------------------------------------------
 
Review the complete app.
 
Improve:
 
- Responsiveness
- Accessibility
- UI consistency
- Typography
- Spacing
- Validation
- Performance
- Animations
- Error handling
- Code quality
 
Remove unnecessary duplication.
 
Fix bugs.
 
Do not add major new features.
 
============================================================
23. DEVELOPMENT RULES
============================================================
 
IMPORTANT:
 
Work milestone by milestone.
 
Do not jump ahead.
 
When asked to implement a milestone:
 
1. Inspect the current codebase.
2. Understand existing architecture.
3. Reuse working components.
4. Make the smallest necessary changes.
5. Do not rebuild working features.
6. Do not introduce unnecessary dependencies.
7. Do not introduce backend/database/authentication.
8. Do not implement future milestone functionality.
9. Run relevant checks after changes.
10. Report what changed.
 
Avoid overengineering.
 
The project is an MVP.
 
Prefer simple, maintainable solutions over elaborate abstractions.
 
============================================================
24. TOKEN / IMPLEMENTATION EFFICIENCY
============================================================
 
This project is being developed carefully to reduce unnecessary coding and token usage.
 
Therefore:
 
- Do not rewrite files unnecessarily.
- Do not regenerate existing components if they already work.
- Do not refactor unrelated code.
- Do not add libraries unless there is a clear reason.
- Do not implement speculative features.
- Do not solve problems that have not been requested.
- Keep prompts and implementation focused on the current milestone.
 
When a requested change can be made by modifying an existing component, modify it rather than rebuilding the feature.
 
============================================================
25. IMPORTANT DESIGN PRINCIPLE
============================================================
 
The application UI and the resume output are two different design systems.
 
APP UI:
 
Can be modern, glass-inspired, translucent, blue/indigo, rounded, subtle, and visually interesting.
 
RESUME OUTPUT:
 
Must be:
 
- Professional
- Clean
- Printable
- ATS-friendly
- Conventional enough for recruiters
- Easy to scan
- Free of unnecessary visual effects
 
Never allow the glass UI aesthetic to compromise the actual resume.
 
============================================================
26. HOW TO WORK ON THIS PROJECT
============================================================
 
Before making changes, inspect the existing project.
 
Do not assume the current code exactly matches this document.
 
If the existing implementation is already correct, preserve it.
 
If something conflicts with this specification, explain the conflict before making a major architectural change.
 
For normal implementation tasks:
 
- Make the requested change.
- Test it.
- Report the files changed.
- Report any issues.
- Stop.
 
Do not automatically proceed to the next milestone.
 
============================================================
END OF PROJECT CONTEXT
============================================================
