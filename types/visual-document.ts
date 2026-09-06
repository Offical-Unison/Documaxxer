export type PageSize = "a4" | "letter" | "custom";
export type BlockType = "text" | "heading" | "image" | "logo" | "table" | "divider" | "shape" | "signature" | "spacer";
export type HorizontalAlign = "left" | "center" | "right";

export interface GridDefinition {
  enabled: boolean;
  size: number;
  snap: boolean;
}

export interface PageDefinition {
  id: string;
  width: number;
  height: number;
  size: PageSize;
  background: string;
  margin: number;
  grid: GridDefinition;
  overflow: "clip" | "extend";
}

export interface BlockStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  align?: HorizontalAlign;
  opacity?: number;
}

export interface BlockDefinition {
  id: string;
  type: BlockType;
  pageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  visible: boolean;
  locked: boolean;
  content: string;
  style: BlockStyle;
  groupId?: string;
}

export interface VisualTemplateDefinition {
  id: string;
  name: string;
  description: string;
  documentType: string;
  builtIn: boolean;
  ownerId?: string;
  pages: PageDefinition[];
  blocks: BlockDefinition[];
  createdAt: string;
  updatedAt: string;
}

export interface VisualDocumentDefinition {
  templateId: string;
  templateVersion?: string;
  pages: PageDefinition[];
  blocks: BlockDefinition[];
}
