/// <reference types="vite/client" />

declare module '*.module.css';
declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
