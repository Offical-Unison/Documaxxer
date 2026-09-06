# Documaxxer - Current Development State

## Status Overview

- **Current Milestone**: **M2 - Document Engine & Visual Data Model** (In Progress)
- **Previous Milestone**: **M5 - User Workspace & Dashboard foundation** (Partial, being reworked)
- **Overall Roadmap Completion**: **~45%**
- **Target Active Focus**: Add resize handles, guides, grouping, renderer adapters, and visual-template duplication.

## Product Direction

Documaxxer is becoming a graphics-editor-like document template tool.

A user should be able to:

1. Create a reusable document template.
2. Choose a page size such as A4 or Letter.
3. Place sections and blocks anywhere on a page.
4. Move, resize, align, duplicate, lock, hide, and style those blocks.
5. Create document instances from templates.
6. Make resumes, CVs, letters, invoices, proposals, reports, and other business documents.
7. Export the designed document to PDF and editable DOCX where the format supports it.

## What Exists

- Next.js application with the existing resume/CV builder.
- Auth.js credentials authentication and protected routes.
- Neon PostgreSQL configuration with Prisma migrations.
- Authenticated profile, template, and saved-document APIs.
- Workspace dashboard foundation.
- Existing PDF print and native DOCX export paths.
- Existing template definitions that can be migrated into visual block templates.
- Dedicated editable structures and previews now exist for cover, authorization, and excuse letters.

## What Must Be Reworked

- The current `TemplateField` and resume section model is not the final template model.
- The current `/template-builder` is now a functional visual canvas foundation with direct drag movement and multi-page editing, but it does not yet support resize handles, guides, or renderer adapters.
- The current `/builder` supports dedicated letter forms and previews, but does not yet render arbitrary saved visual blocks.
- Template creation and document creation must become separate workflows.
- Saved documents must store content and layout independently from their source template.
- Existing resume/CV templates should become built-in visual templates, not define the limits of the product.

## Next Implementation Slice

 Continue the visual document model and canvas foundation:

- `PageDefinition` with page size, dimensions, margins, and background.
- `BlockDefinition` with position, size, layer order, visibility, lock state, and style.
- Block types for text, heading, image, logo, table, divider, shape, signature, and spacer.
- A serialized `VisualTemplateDefinition` for reusable template designs.
- A serialized `VisualDocumentDefinition` for editable document instances.
- A canvas that can directly select, drag, and move blocks while preserving stable coordinates. Resize handles remain to be implemented.

## Milestone Status Rules

Earlier M6 and M7 work implemented the old schema-based approach. It is retained as migration material but is not considered completion of the new visual-template milestones. The roadmap has been reset so progress reflects the actual product goal rather than the old resume-only implementation.
