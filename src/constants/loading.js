export const baseURL =
  window.location.toString().replace(/[^/]*$/gu, "") +
  document
    .querySelector('script[src$="main.js"]')
    .getAttribute("src")
    .replace("main.js", "");
