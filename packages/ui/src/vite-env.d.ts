/// <reference types="vite/client" />

declare module "*.tsx?raw" {
  const content: string;
  export default content;
}

declare module "*.ts?raw" {
  const content: string;
  export default content;
}

declare module "*.jsx?raw" {
  const content: string;
  export default content;
}

declare module "*.js?raw" {
  const content: string;
  export default content;
}

// 이미지 파일 타입 선언
declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}
