import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/sora/latin-400.css";
import "@fontsource/sora/latin-500.css";
import "@fontsource/sora/latin-600.css";
import "@fontsource/sora/latin-700.css";
import App from "./App";
import "./index.css";

// index.html carries static, per-page SEO tags (data-static-seo) for crawlers that do not run JavaScript.
// When React adds its own version of a tag, drop the static one so each tag appears exactly once.
const seoKey = (el: Element) =>
  `${el.tagName}|${el.getAttribute("name") ?? el.getAttribute("property") ?? el.getAttribute("rel")}`;
const removeStaticSeoDuplicates = () => {
  const live = new Set(
    Array.from(document.head.querySelectorAll("meta:not([data-static-seo]), link:not([data-static-seo])")).map(seoKey),
  );
  document.head.querySelectorAll("[data-static-seo]").forEach((el) => {
    if (live.has(seoKey(el))) el.remove();
  });
};
new MutationObserver(removeStaticSeoDuplicates).observe(document.head, { childList: true });
removeStaticSeoDuplicates();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
