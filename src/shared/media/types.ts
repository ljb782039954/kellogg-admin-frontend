export interface R2Image {
  key: string;
  name: string;
  url: string;
  thumbUrl: string;
  size: number;
  dimensions?: string;
  hash?: string;
  usages?: Array<{ type: string; name: string; id?: string }>;
  uploaded: string | Date;
}
