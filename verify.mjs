// Drives every interactive demo in the built bundle via jsdom.
import fs from "node:fs";
import { JSDOM, VirtualConsole } from "jsdom";

const html = fs.readFileSync("dist/index.html", "utf8");
const bundle = fs.readFileSync(
  `dist/${html.match(/src="\/(assets\/index-[^"]+\.js)"/)[1]}`,
  "utf8",
);

const problems = [];
const vc = new VirtualConsole();
vc.on("error", (...a) => problems.push(a.join(" ")));
vc.on("warn", (...a) => problems.push(a.join(" ")));
vc.on("jsdomError", (e) => {
  if (!String(e.message).includes("Could not parse CSS")) {
    problems.push(e.message);
  }
});

const dom = new JSDOM(html.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/, ""), {
  url: "http://localhost/playground",
  runScripts: "outside-only",
  pretendToBeVisual: true,
  virtualConsole: vc,
});
const { window } = dom;
const { document } = window;

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
window.Request = Request;
window.Response = Response;
window.Headers = Headers;
window.fetch = fetch;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;

function check(name, cond) {
  console.log(`${cond ? "OK  " : "FAIL"} ${name}`);
  if (!cond) failures++;
}

function buttons(root = document) {
  return [...root.querySelectorAll("button")];
}

function buttonByText(text, root = document) {
  return buttons(root).find((b) => b.textContent.trim().includes(text));
}

function setReactValue(el, value) {
  const proto =
    el instanceof window.HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
  el.dispatchEvent(new window.Event("input", { bubbles: true }));
}

window.eval(bundle);
await sleep(500);

// ---- Tokenizer
{
  const section = document.getElementById("demo-tokenizer");
  check("tokenizer renders chips", section.querySelectorAll(".tok").length > 10);
  const ta = section.querySelector("textarea");
  setReactValue(ta, "internationalization");
  await sleep(100);
  const chips = [...section.querySelectorAll(".tok")].map((c) => c.textContent);
  check(
    `tokenizer splits long word (${chips.join("|")})`,
    chips.length > 1 && chips.join("") === "internationalization",
  );
}

// ---- Temperature
{
  const section = document.getElementById("demo-temperature");
  const bars = section.querySelectorAll(".temperature-bar");
  check("temperature renders 8 bars", bars.length === 8);
  const slider = section.querySelector('input[type="range"]');
  setReactValue(slider, "0.1");
  await sleep(100);
  buttonByText("sample a token", section).click();
  await sleep(100);
  const samples = section.querySelector(".temperature-samples");
  check(
    "temperature at T=0.1 samples Paris",
    samples !== null && samples.textContent.includes("Paris"),
  );
}

// ---- Workflow
{
  const section = document.getElementById("demo-workflow");
  buttonByText("run workflow", section).click();
  await sleep(3200);
  const log = section.querySelector(".demo-log");
  check(
    "workflow happy path completes",
    log !== null && log.textContent.includes("row appended"),
  );
  const toggle = section.querySelector('input[type="checkbox"]');
  toggle.click();
  await sleep(50);
  buttonByText("run workflow", section).click();
  await sleep(2200);
  check(
    "workflow broken path routes to dead letter",
    section.querySelector(".demo-log").textContent.includes("dead letter"),
  );
}

// ---- Model matrix
{
  const section = document.getElementById("demo-model-matrix");
  buttonByText("Voice output", section).click();
  await sleep(100);
  check(
    "matrix voice task picks ElevenLabs",
    section.querySelector(".matrix-verdict").textContent.includes("ElevenLabs") &&
      section.querySelector(".matrix-row.is-leader").textContent.includes("ElevenLabs"),
  );
}

// ---- ReAct loop
{
  const section = document.getElementById("demo-react-loop");
  const next = () => buttonByText("next step", section)?.click();
  for (let i = 0; i < 11; i++) {
    next();
    await sleep(30);
  }
  await sleep(800);
  check(
    "react loop healthy trace reaches answer",
    section.textContent.includes("287.50"),
  );
  buttonByText("runaway loop", section).click();
  await sleep(50);
  for (let i = 0; i < 20; i++) {
    buttonByText("next step", section)?.click();
    await sleep(20);
  }
  await sleep(1200);
  check(
    "react loop runaway trace hits guard",
    section.textContent.includes("MAX_ITERATIONS"),
  );
  check(
    "react loop iteration counter at 5",
    section.querySelector(".react-loop-counter").textContent.includes("5 / 5"),
  );
}

// ---- Contract
{
  const section = document.getElementById("demo-contract");
  buttonByText("validate", section).click();
  await sleep(100);
  check(
    "contract original passes",
    section.querySelector(".contract-result.is-pass") !== null,
  );
  buttonByText("trailing comma", section).click();
  await sleep(50);
  buttonByText("validate", section).click();
  await sleep(100);
  const stages = section.querySelectorAll(".contract-stage");
  check(
    "contract trailing comma fails at parse",
    section.querySelector(".contract-result.is-fail") !== null &&
      [...stages].some(
        (s) =>
          s.classList.contains("stage-fail") &&
          s.textContent.includes("parse JSON"),
      ),
  );
  buttonByText("missing field", section).click();
  await sleep(50);
  buttonByText("validate", section).click();
  await sleep(100);
  check(
    "contract missing field names the field",
    section.textContent.includes('"currency" missing'),
  );
}

// ---- Resources filter/search
{
  window.history.pushState({}, "", "/resources");
  window.dispatchEvent(new window.PopStateEvent("popstate"));
  await sleep(300);
  const count = () => document.querySelector(".resources-count").textContent;
  const total = count();
  setReactValue(document.querySelector(".resources-search"), "tokenizer");
  await sleep(100);
  check(`resources search narrows (${total} -> ${count()})`, count().startsWith("1 "));
  setReactValue(document.querySelector(".resources-search"), "");
  await sleep(50);
  buttonByText("M04").click();
  await sleep(100);
  check(`resources chip filters (${count()})`, count().startsWith("7 "));
}

// ---- Command palette navigation
{
  window.dispatchEvent(new window.CustomEvent("open-command-palette"));
  await sleep(100);
  const input = document.querySelector(".palette-input");
  setReactValue(input, "agentic");
  await sleep(100);
  input.dispatchEvent(
    new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
  );
  await sleep(400);
  check(
    "palette Enter navigates to agents module",
    window.location.pathname === "/module/agents",
  );
}

if (problems.length > 0) {
  console.log("\nConsole problems:");
  for (const p of problems) console.log(" ", p);
  failures += problems.length;
}

console.log(failures === 0 ? "\nVERIFY PASS" : `\nVERIFY FAIL (${failures})`);
process.exit(failures === 0 ? 0 : 1);
