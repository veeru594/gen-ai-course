import fs from "node:fs";
import { JSDOM, VirtualConsole } from "jsdom";

const html = fs.readFileSync("dist/index.html", "utf8");
const bundleMatch = html.match(/src="\/(assets\/index-[^"]+\.js)"/);
if (!bundleMatch) {
  throw new Error("bundle script tag not found in dist/index.html");
}
const bundle = fs.readFileSync(`dist/${bundleMatch[1]}`, "utf8");

const problems = [];
const vc = new VirtualConsole();
vc.on("error", (...a) => problems.push(["console.error", ...a]));
vc.on("warn", (...a) => problems.push(["console.warn", ...a]));
vc.on("jsdomError", (e) => problems.push(["jsdomError", e.message]));

const dom = new JSDOM(html.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/, ""), {
  url: "http://localhost/",
  runScripts: "outside-only",
  pretendToBeVisual: true,
  virtualConsole: vc,
});

const { window } = dom;
window.matchMedia = (media) => ({
  matches: false,
  media,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
});
window.Element.prototype.scrollIntoView = () => {};
window.scrollTo = () => {};
// fetch API globals that jsdom does not provide in the window scope
window.Request = Request;
window.Response = Response;
window.Headers = Headers;
window.fetch = fetch;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  window.eval(bundle);
} catch (e) {
  problems.push(["eval", e.message]);
}

await sleep(400);

const routes = [
  ["/", "Understanding first"],
  ["/module/foundations", "Generative AI Foundations"],
  ["/module/automation", "Automation Platforms"],
  ["/module/models", "Tool Exploration"],
  ["/module/agents", "Agentic AI Frameworks"],
  ["/module/python", "Python for Generative AI"],
  ["/playground", "Playground"],
  ["/capstone", "capstone is reviewed"],
  ["/resources", "Resource library"],
  ["/nonsense-route", "Understanding first"], // 404 → home
];

let failures = 0;
const rootHasContent = () =>
  window.document.getElementById("root").innerHTML.length > 500;

if (!rootHasContent()) {
  console.log("FAIL initial render — root is empty");
  failures++;
} else {
  for (const [path, expect] of routes) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new window.PopStateEvent("popstate"));
    await sleep(250);
    const text = window.document.getElementById("root").textContent;
    if (text.includes(expect)) {
      console.log(`OK   ${path}`);
    } else {
      console.log(`FAIL ${path} — expected "${expect}"`);
      failures++;
    }
  }
}

// open the command palette and type a query
window.dispatchEvent(new window.CustomEvent("open-command-palette"));
await sleep(150);
const paletteInput = window.document.querySelector(".palette-input");
if (paletteInput) {
  console.log("OK   command palette opens");
} else {
  console.log("FAIL command palette did not open");
  failures++;
}

const realProblems = problems.filter(
  ([, msg]) => !String(msg).includes("Could not parse CSS"),
);
if (realProblems.length > 0) {
  console.log("\nConsole problems:");
  for (const p of realProblems) {
    console.log(" ", p.join(" "));
  }
  failures += realProblems.length;
}

console.log(failures === 0 ? "\nSMOKE PASS" : `\nSMOKE FAIL (${failures})`);
process.exit(failures === 0 ? 0 : 1);
