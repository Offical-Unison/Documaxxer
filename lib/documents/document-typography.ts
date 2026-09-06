/**
 * Single source of truth for document typography.
 * Used by preview (inline styles), print view, and DOCX export.
 *
 * All sizes are in typographic points (pt).
 * DOCX uses half-points (hp = pt × 2).
 */

// ── Point sizes ──────────────────────────────────────────────
export const NAME_PT = 22;
export const SECTION_HEADING_PT = 11;
export const ENTRY_TITLE_PT = 10;   // bold
export const BODY_PT = 10;          // regular weight
export const CONTACT_PT = 10;
export const DATE_PT = 10;

// ── DOCX half-point sizes (pt × 2) ──────────────────────────
export const NAME_HP = NAME_PT * 2;              // 44
export const SECTION_HEADING_HP = SECTION_HEADING_PT * 2; // 22
export const ENTRY_TITLE_HP = ENTRY_TITLE_PT * 2;        // 20
export const BODY_HP = BODY_PT * 2;              // 20
export const CONTACT_HP = CONTACT_PT * 2;        // 20
export const DATE_HP = DATE_PT * 2;              // 20

// ── Shared CSS style objects for preview & print ─────────────
export const TEXT_COLOR = "#000";

export const nameStyle: React.CSSProperties = {
  fontSize: `${NAME_PT}pt`,
  fontWeight: 700,
  color: TEXT_COLOR,
  letterSpacing: "-0.02em",
  lineHeight: 1.2,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const sectionHeadingStyle: React.CSSProperties = {
  fontSize: `${SECTION_HEADING_PT}pt`,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: TEXT_COLOR,
  borderBottom: "1px solid #000",
  paddingBottom: "4px",
  marginTop: "14px",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const entryTitleStyle: React.CSSProperties = {
  fontSize: `${ENTRY_TITLE_PT}pt`,
  fontWeight: 700,
  color: TEXT_COLOR,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const entrySubtitleStyle: React.CSSProperties = {
  fontSize: `${BODY_PT}pt`,
  fontWeight: 700,
  color: TEXT_COLOR,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const bodyStyle: React.CSSProperties = {
  fontSize: `${BODY_PT}pt`,
  fontWeight: 400,
  color: TEXT_COLOR,
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const dateStyle: React.CSSProperties = {
  fontSize: `${DATE_PT}pt`,
  fontWeight: 400,
  color: TEXT_COLOR,
  flexShrink: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const contactStyle: React.CSSProperties = {
  fontSize: `${CONTACT_PT}pt`,
  fontWeight: 400,
  color: TEXT_COLOR,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const headlineStyle: React.CSSProperties = {
  fontSize: `${BODY_PT}pt`,
  fontWeight: 500,
  color: TEXT_COLOR,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export const linkStyle: React.CSSProperties = {
  fontSize: `${CONTACT_PT}pt`,
  color: TEXT_COLOR,
  textDecoration: "underline",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};
