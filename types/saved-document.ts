import type { DocumentData } from "./document";
import type { TemplateDefinition } from "./template";

/**
 * A SavedDocument is a user's document — an instance of a template
 * containing the user's actual content.
 *
 * Template ≠ SavedDocument:
 * - Template defines STRUCTURE (sections, fields, layout)
 * - SavedDocument contains DATA (user's actual information)
 */
export interface SavedDocument {
  /** Unique document identifier */
  id: string;
  /** User-assigned document name (e.g. "Google Application Resume") */
  name: string;
  /** Document type */
  documentType: "resume" | "cv" | "cover-letter";
  /** The template this document was created from */
  templateId: string;
  /**
   * Snapshot of the template at creation time.
   * Prevents template edits from unexpectedly altering historical documents.
   * Populated when the document is first created from a template (M11).
   */
  templateSnapshot?: TemplateDefinition;

  /** The user's actual document content */
  content: DocumentData;

  /** Selected font override */
  selectedFontId: string | null;

  /** Owner user ID — for authenticated persistence (M3+) */
  ownerId?: string;

  /** ISO timestamps */
  createdAt: string;
  updatedAt: string;
}
