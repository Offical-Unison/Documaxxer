import type { SectionId } from "./document";

// ── Field Types ──────────────────────────────────────────────

/** Input types supported by template fields */
export type TemplateFieldType =
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

/** A single input field within a template section */
export interface TemplateField {
  /** Unique field identifier within the section */
  id: string;
  /** Data key — maps to the corresponding property in DocumentData */
  key: string;
  /** Human-readable label shown in the builder form */
  label: string;
  /** Input control type */
  type: TemplateFieldType;
  /** Whether this field must be filled before advancing */
  required: boolean;
  /** Placeholder text shown in empty inputs */
  placeholder?: string;
  /** Profile attribute key for M8 autofill (e.g. "profile.firstName") */
  profileMapping?: string;
  /** Select/multiselect options */
  options?: string[];
}

// ── Section Types ────────────────────────────────────────────

/** A section within a template (e.g. "Experience", "Education") */
export interface TemplateSection {
  /** Unique section identifier */
  id: string;
  /** Maps to the SectionId union — determines which data array / reducer action to use */
  type: SectionId;
  /** Default section heading */
  title: string;
  /** Display order (0-based) */
  order: number;
  /** Whether this section is required to have at least one entry */
  required: boolean;
  /** Fields within each entry of this section */
  fields: TemplateField[];
  /** Whether the user can add multiple entries (e.g. multiple jobs) */
  repeatable?: boolean;
  /** For 2-column layouts: which column this section belongs to */
  column?: "main" | "rail";
}

// ── Layout Types ─────────────────────────────────────────────

/** Template layout configuration */
export interface TemplateLayout {
  /** Number of content columns (1 = single, 2 = main + sidebar) */
  columns: 1 | 2;
  /** Header/name alignment */
  headerAlignment: "left" | "center";
  /** Main column width ratio for 2-column layouts (e.g. 0.65) */
  sidebarRatio?: number;
}

// ── Template Definition ──────────────────────────────────────

/** Complete template definition — the structure of a document type */
export interface TemplateDefinition {
  /** Unique template identifier */
  id: string;
  /** Human-readable template name */
  name: string;
  /** Short description of the template */
  description: string;
  /** What type of document this template creates */
  documentType: "resume" | "cv" | "cover-letter";
  /** Whether this is a built-in (code-defined) template or user-created */
  builtIn: boolean;
  /** Owner user ID — undefined for built-in templates */
  ownerId?: string;

  /** Ordered list of sections in this template */
  sections: TemplateSection[];
  /** Layout configuration */
  layout: TemplateLayout;

  /** Default font family (optional override) */
  fontFamily?: string;

  /** ISO timestamps */
  createdAt: string;
  updatedAt: string;
}
