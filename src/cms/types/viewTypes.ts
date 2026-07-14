// import type { ComponentType, ImgHTMLAttributes } from "react";
import type { Translation } from "@/cms/types";

export type TranslateFn = (
  value: string | Translation | null | undefined,
  fallback?: string
) => string;

// export type LogoImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
//   src: string | null | undefined;
//   width?: number;
//   height?: number;
// };

// export type LogoImageComponent = ComponentType<LogoImageProps>;
