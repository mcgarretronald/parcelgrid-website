import { createPortal } from "react-dom";

/**
 * Renders a JSON-LD block into <head>. With React 19, react-helmet-async leaves <script> tags
 * where they are rendered (in the page body), so structured data is portalled into the head here.
 */
export function JsonLd({ data }: { data: unknown }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />,
    document.head,
  );
}
