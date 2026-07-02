import { useState } from "react";
import "./Capstone.css";

interface Step {
  number: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "You submit your repo",
    body: "Push your capstone project to a public GitHub repository and submit the link through the Google Form. Make sure the repo is public — the pipeline cannot read private repos.",
  },
  {
    number: "02",
    title: "The pipeline reads your code",
    body: "An automated pipeline fetches your repository through the GitHub API — every source file, your README, your project structure. Nothing is executed; it is read, the way a reviewer reads.",
  },
  {
    number: "03",
    title: "Claude reviews against the rubric",
    body: "Claude evaluates your project against the course rubric — the same criteria listed below. It checks code quality, error handling, documentation, and how your AI integration is built.",
  },
  {
    number: "04",
    title: "A structured report is generated",
    body: "The review comes back in a fixed format: a Score, Strengths & Weaknesses, and concrete Improvement Suggestions. The same output-contract discipline you learned in Module 5, applied to your own work.",
  },
  {
    number: "05",
    title: "The QAE team reviews and responds",
    body: "The report lands with the Quality Assurance & Evaluation team. A human reviewer reads it alongside your code, adjusts where the AI got it wrong, and sends you the final feedback.",
  },
];

const RUBRIC: Array<{ item: string; why: string }> = [
  {
    item: "A README that explains the system",
    why: "what it does, how to run it, what each part is for — a reviewer should never have to guess",
  },
  {
    item: "Credentials kept out of the code",
    why: "keys loaded from .env, never hardcoded, never committed — this is checked first",
  },
  {
    item: "Output contracts on every AI call",
    why: "model responses validated — format, fields, types — before anything moves downstream",
  },
  {
    item: "Designing for failure",
    why: "retries on rate limits, fallbacks when the AI call fails, failed records logged rather than lost",
  },
  {
    item: "Documented AI integration points",
    why: "the prompts you used, the model you chose for each step, and why",
  },
  {
    item: "A clear commit history",
    why: "small commits with honest messages — the story of how you built it",
  },
];

/* ---------- Project sets ---------- */

interface Project {
  number: string;
  title: string;
  track: string;
  build: string;
  use: string;
  expect: string;
}

interface ProjectSet {
  id: string;
  label: string;
  count: number;
  projects: Project[];
}

const PROJECT_SETS: ProjectSet[] = [
  {
    id: "set-a",
    label: "Set A",
    count: 12,
    projects: [
      {
        number: "01",
        title: "Prompt battle arena",
        track: "AI Model Focused",
        build:
          "A Streamlit app that sends the same prompt to Claude, GPT-4o, and Gemini simultaneously, scores each response against a user-defined rubric using a fourth AI call, and displays the scored comparison.",
        use: "Claude API + OpenAI API + Gemini API + Streamlit",
        expect:
          "Scored side-by-side comparison with winner declared per criterion and a downloadable PDF battle report.",
      },
      {
        number: "02",
        title: "Contract risk scanner",
        track: "AI Model Focused",
        build:
          "A Streamlit app that accepts a PDF or pasted contract, identifies risky clauses, missing protections, and liability exposure, and rates each finding High, Medium, or Low.",
        use: "Claude API + Streamlit + pypdf",
        expect:
          "Structured risk report with severity ratings displayed in app and downloadable as formatted PDF.",
      },
      {
        number: "03",
        title: "Cold outreach personaliser",
        track: "AI Model Focused",
        build:
          "A Streamlit app that takes a prospect profile and generates a personalised outreach email with subject line and follow-up. Batch mode accepts a CSV and generates emails for all rows.",
        use: "Claude API + Streamlit",
        expect:
          "Individual email with tone selector plus batch CSV download with personalised emails for every row.",
      },
      {
        number: "04",
        title: "Study guide generator",
        track: "AI Model Focused",
        build:
          "A Streamlit app that takes a lecture PDF or syllabus and generates summary notes, 20 MCQs with answers, 5 short-answer questions, a glossary, and a study order.",
        use: "Claude API + Streamlit + pypdf",
        expect:
          "Downloadable study pack as PDF and MCQ export as CSV for Anki import.",
      },
      {
        number: "05",
        title: "Code reviewer and explainer",
        track: "AI Model Focused",
        build:
          "A Streamlit app where a user pastes code, selects review depth, and receives a plain-English explanation, bug list with line references, refactored version, and complexity assessment.",
        use: "Claude API + Streamlit",
        expect:
          "Side-by-side original vs refactored code view and a downloadable markdown review file.",
      },
      {
        number: "06",
        title: "Job application autopilot",
        track: "Automation Focused",
        build:
          "An n8n workflow triggered by Google Form where AI scores CV fit, generates a cover letter, emails it to the applicant, logs to Sheets, and creates a 7-day follow-up calendar reminder.",
        use: "n8n + Claude API + Google Forms + Google Sheets + Gmail + Google Calendar",
        expect:
          "Automated cover letter emailed to applicant, fit score in Sheets, calendar reminder created — no manual steps.",
      },
      {
        number: "07",
        title: "Social media content pipeline",
        track: "Automation Focused",
        build:
          "An n8n workflow where a content idea via Google Form triggers AI generation of a LinkedIn post, Twitter thread, and Instagram caption, posted to Slack for approval, logged to a publishing calendar on approval.",
        use: "n8n + Claude API + Google Forms + Google Sheets + Slack",
        expect:
          "Three platform drafts in Slack within 60 seconds, approval emoji triggers logging to publishing calendar.",
      },
      {
        number: "08",
        title: "Customer feedback intelligence",
        track: "Automation Focused",
        build:
          "An n8n workflow triggered by incoming email that classifies into bug/feature/complaint/praise, routes to correct Slack channel, logs to Sheets, and sends a weekly trend digest every Monday.",
        use: "n8n + Claude API + Gmail + Google Sheets + Slack",
        expect:
          "Real-time Slack routing, structured Sheet log, and automated Monday digest email.",
      },
      {
        number: "09",
        title: "Interview question generator",
        track: "Automation Focused",
        build:
          "An n8n workflow where a hiring manager submits a JD via Google Form and receives a PDF of 20 interview questions across technical, behavioural, and situational categories with scoring rubrics.",
        use: "n8n + Claude API + Google Forms + Google Sheets + Gmail",
        expect:
          "Complete interview kit PDF emailed within 2 minutes, seniority level visibly affecting question depth.",
      },
      {
        number: "10",
        title: "Research assistant with memory",
        track: "Combined",
        build:
          "A system where n8n ingests URLs via webhook into ChromaDB and a Streamlit app lets users query across all sources with Claude answering with citations.",
        use: "n8n + Claude API + OpenAI Embeddings + ChromaDB + Streamlit",
        expect:
          "Multi-source Q&A with citations, persistent knowledge base, downloadable PDF of full session.",
      },
      {
        number: "11",
        title: "Meeting intelligence dashboard",
        track: "Combined",
        build:
          "A system where n8n receives transcripts via webhook, AI extracts action items with owners and deadlines, and a Streamlit dashboard shows all meetings with owner filtering and overdue highlighting.",
        use: "n8n + Claude API + Streamlit",
        expect:
          "Multi-meeting dashboard with owner filter, overdue items in red, CSV export of all action items.",
      },
      {
        number: "12",
        title: "Competitor intelligence tracker",
        track: "Combined",
        build:
          "A system where n8n fetches competitor content weekly, AI extracts announcements and positioning shifts, and a Streamlit dashboard shows a tagged timeline with a Monday digest email.",
        use: "n8n + Gemini API + Streamlit + Gmail",
        expect:
          "Automated weekly digest, filterable timeline, exportable weekly report as PDF.",
      },
    ],
  },
  {
    id: "set-b",
    label: "Set B",
    count: 14,
    projects: [
      {
        number: "01",
        title: "Document Q&A",
        track: "AI Model Focused",
        build:
          "A Streamlit app where a user uploads a PDF and asks questions. The app chunks the document and Claude answers with source references.",
        use: "Claude API + Streamlit + pypdf",
        expect:
          "Grounded answers with chunk references, downloadable Q&A session as PDF.",
      },
      {
        number: "02",
        title: "Resume screener",
        track: "AI Model Focused",
        build:
          "A Streamlit app where a user uploads a JD and multiple resumes. AI scores each resume on at least 4 criteria and ranks all candidates.",
        use: "Claude API + Streamlit + pypdf",
        expect:
          "Ranked candidate list with score breakdown, downloadable as CSV.",
      },
      {
        number: "03",
        title: "Invoice processor",
        track: "AI Model Focused",
        build:
          "A Streamlit app that accepts invoice PDFs or images and extracts vendor, invoice number, date, line items, subtotal, tax, and total.",
        use: "GPT-4o Vision API + Streamlit",
        expect:
          "Structured table in app, missing fields marked, downloadable as Excel.",
      },
      {
        number: "04",
        title: "Multi-model comparator",
        track: "AI Model Focused",
        build:
          "A Streamlit app that sends any prompt to Claude, GPT-4o, and Gemini simultaneously and displays responses side by side with latency per model.",
        use: "Claude API + OpenAI API + Gemini API + Streamlit",
        expect:
          "Side-by-side responses with latency, star ratings, downloadable comparison PDF.",
      },
      {
        number: "05",
        title: "Content repurposer",
        track: "AI Model Focused",
        build:
          "A Streamlit app where a user pastes an article and selects a target audience. AI generates a LinkedIn post, Twitter thread, and email newsletter.",
        use: "Claude API + Streamlit",
        expect:
          "Three distinct platform outputs with LinkedIn character count shown, downloadable as one document.",
      },
      {
        number: "06",
        title: "Meeting notes processor",
        track: "AI Model Focused",
        build:
          "A Streamlit app where a user pastes a transcript. AI extracts action items, decisions, open questions, and a 3-line summary.",
        use: "Claude API + Streamlit",
        expect:
          "Four structured sections in app, PDF download, action items as CSV.",
      },
      {
        number: "07",
        title: "Structured data extractor",
        track: "AI Model Focused",
        build:
          "A Streamlit app where a user defines fields and pastes unstructured text. AI extracts exactly those fields. Batch mode processes a CSV.",
        use: "Claude API + Streamlit",
        expect: "Single and batch extraction, JSON in app, batch CSV download.",
      },
      {
        number: "08",
        title: "Lead qualification pipeline",
        track: "Automation Focused",
        build:
          "An n8n workflow where a Google Form submission triggers AI lead scoring with hot/warm/cold classification, writes to Sheets, and sends a Slack alert.",
        use: "n8n + Claude API + Google Forms + Google Sheets + Slack",
        expect:
          "Automated Sheets entry and Slack alert within 60 seconds, different format per classification.",
      },
      {
        number: "09",
        title: "Email classifier and router",
        track: "Automation Focused",
        build:
          "An n8n workflow triggered by email. AI classifies into support/sales/complaint/internal with urgency, routes to correct Slack channel, and logs to Sheets.",
        use: "n8n + Claude API + Gmail + Google Sheets + Slack",
        expect:
          "Correct Slack routing per category, urgency visible, ambiguous emails to review channel.",
      },
      {
        number: "10",
        title: "Content approval workflow",
        track: "Automation Focused",
        build:
          "An n8n workflow where a content brief via Google Form triggers AI drafting, posts to Slack, and approval emoji logs to a publishing calendar Sheet.",
        use: "n8n + Claude API + Google Forms + Google Sheets + Slack",
        expect:
          "Draft in Slack within 2 minutes, emoji-triggered status update in Sheets.",
      },
      {
        number: "11",
        title: "Job application tracker",
        track: "Automation Focused",
        build:
          "An n8n workflow where an applicant submits CV and JD via Google Form. AI extracts a structured profile and fit score. Both hiring manager and applicant receive automated emails.",
        use: "n8n + Claude API + Google Forms + Google Sheets + Gmail",
        expect:
          "Two automated emails within 2 minutes, structured Sheet entry with profile and fit score.",
      },
      {
        number: "12",
        title: "RAG chatbot",
        track: "Combined",
        build:
          "A system where n8n ingests documents via webhook into ChromaDB and a Streamlit chat interface lets users ask questions with Claude answering with citations.",
        use: "n8n + Claude API + OpenAI Embeddings + ChromaDB + Streamlit",
        expect:
          "Chat interface with persistent history, every answer citing source chunk, history exportable as text.",
      },
      {
        number: "13",
        title: "Customer support dashboard",
        track: "Combined",
        build:
          "A system where n8n receives support tickets via webhook, AI classifies and drafts a response, and a Streamlit dashboard shows the live queue with filter and resolve.",
        use: "n8n + Claude API + Streamlit",
        expect:
          "Live queue with filters, AI draft per ticket, resolve button, data persisted across restarts.",
      },
      {
        number: "14",
        title: "Research aggregator",
        track: "Combined",
        build:
          "A system where n8n fetches content from URLs, AI summarises each source and extracts key points, and a Streamlit dashboard shows a consolidated report.",
        use: "n8n + Claude API + Streamlit",
        expect:
          "Consolidated report with per-source summary, new URLs addable without losing previous research, exportable as PDF.",
      },
    ],
  },
  {
    id: "set-c",
    label: "Set C",
    count: 10,
    projects: [
      {
        number: "01",
        title: "Mock interview coach",
        track: "Voice and Audio",
        build:
          "A Streamlit app where a user selects interview type, submits an answer, and gets AI feedback on clarity, relevance, and confidence — delivered as spoken audio via ElevenLabs.",
        use: "Claude API + ElevenLabs API + Streamlit",
        expect:
          "10+ questions per type, written and spoken feedback per answer, downloadable session report.",
      },
      {
        number: "02",
        title: "Multilingual document narrator",
        track: "Voice and Audio",
        build:
          "A Streamlit app where a user uploads a PDF, selects a language from 8+ options, and the AI summarises and converts to spoken audio in that language.",
        use: "Claude API + ElevenLabs API + Streamlit + pypdf",
        expect:
          "Accurate summary and downloadable MP3 in the chosen language.",
      },
      {
        number: "03",
        title: "Product listing generator",
        track: "Multimodal",
        build:
          "A Streamlit app where a user uploads product photos and selects a platform style. AI generates a complete listing: title, 5 bullet features, description, and keywords.",
        use: "GPT-4o Vision API + Streamlit",
        expect:
          "All four components per photo, platform style affecting output, one-click download.",
      },
      {
        number: "04",
        title: "Whiteboard to documentation converter",
        track: "Multimodal",
        build:
          "A Streamlit app where a user uploads a whiteboard photo and AI converts it to structured documentation with headings, bullets, and diagram descriptions.",
        use: "GPT-4o Vision API + Streamlit",
        expect:
          "Structured output separating text from diagrams, downloadable as PDF.",
      },
      {
        number: "05",
        title: "Food nutrition analyser",
        track: "Multimodal",
        build:
          "A Streamlit app where a user uploads a meal photo or food label. AI estimates nutrition, flags allergens, and suggests a healthier alternative.",
        use: "GPT-4o Vision API + Streamlit",
        expect:
          "Nutrition panel in app, allergens highlighted, healthier alternative with reason, disclaimer shown.",
      },
      {
        number: "06",
        title: "Personalised news briefing agent",
        track: "Agent-Style",
        build:
          "A system where a user configures interests and sources. An n8n cron runs daily, AI filters relevant articles and generates summaries, delivered by email every morning.",
        use: "n8n + Claude API + Gmail",
        expect:
          "Automated daily email with 5+ article summaries, headline, 2-line summary, and source link per article.",
      },
      {
        number: "07",
        title: "GitHub repo explainer",
        track: "Agent-Style",
        build:
          "A Streamlit app where a user pastes a public GitHub URL. The app fetches README and key files via GitHub API and Claude generates a plain-English explanation.",
        use: "Claude API + GitHub API + Streamlit",
        expect:
          "Four-section explanation from live repo data, downloadable as markdown.",
      },
      {
        number: "08",
        title: "Salary negotiation coach",
        track: "Real-World Tools",
        build:
          "A Streamlit app where a user pastes a job offer letter and target salary. AI identifies negotiation levers and generates a counter-offer email with strategy.",
        use: "Claude API + Streamlit",
        expect:
          "Negotiation brief with levers, counter-offer range with reasoning, email draft, tone selector, downloadable PDF.",
      },
      {
        number: "09",
        title: "College application essay reviewer",
        track: "Real-World Tools",
        build:
          "A Streamlit app where a student pastes their personal statement. AI scores on 4 criteria, gives paragraph-level feedback, and rewrites the weakest paragraph.",
        use: "Claude API + Streamlit",
        expect:
          "Score out of 100 with breakdown, paragraph comments, rewritten example, downloadable marked-up PDF.",
      },
      {
        number: "10",
        title: "API documentation generator",
        track: "Real-World Tools",
        build:
          "A Streamlit app where a developer pastes a Python script. AI generates complete documentation for every function: description, parameters, returns, examples, edge cases.",
        use: "Claude API + Streamlit",
        expect:
          "Complete docs for every function, standard API doc format, downloadable as markdown.",
      },
    ],
  },
];

/* ---------- Evaluation criteria ---------- */

const SCORING: Array<{ name: string; points: number; body: string }> = [
  {
    name: "AI Integration",
    points: 30,
    body: "Are the AI calls correctly structured? Is the model chosen appropriate for the task? Are output contracts validated before passing downstream?",
  },
  {
    name: "Code Quality",
    points: 20,
    body: "Is the code readable and organised? Are functions reusable? Is error handling present at every failure point?",
  },
  {
    name: "Security",
    points: 20,
    body: "Are API keys loaded from environment variables? Is nothing hardcoded or committed? Is the .env file in .gitignore?",
  },
  {
    name: "Documentation",
    points: 15,
    body: "Does the README explain what the system does, how to run it, what each component is for, and what the AI integration points are?",
  },
  {
    name: "Output Completeness",
    points: 15,
    body: "Does the app produce the expected output as defined in the project brief? Are downloads, exports, and required features all present?",
  },
];

/* ---------- Submission checklist ---------- */

const CHECKLIST: string[] = [
  "GitHub repository is set to Public",
  "API keys are in .env and loaded with python-dotenv — never hardcoded",
  ".env is listed in .gitignore",
  "README covers: what it does, how to run it, which AI model is used and why, what the env vars are",
  "Live URL is working and accessible",
  "All must-include features from the project brief are implemented",
  "Commit history shows progress — not one single commit with everything",
];

/* ---------- Downloads ---------- */

const BRIEFS: Array<{ label: string; file: string }> = [
  {
    label: "Set A — 12 Projects (Detailed Brief)",
    file: "/briefs/Capstone_Projects_Bright12.pdf",
  },
  {
    label: "Set B — 14 Projects (Detailed Brief)",
    file: "/briefs/Capstone_Projects_Standard14.pdf",
  },
  {
    label: "Set C — 10 Projects (Detailed Brief)",
    file: "/briefs/Capstone_Projects_Practical10.pdf",
  },
  {
    label: "All 36 Projects — Quick Reference",
    file: "/briefs/Capstone_All36_ShortBriefs_v2.pdf",
  },
];

export function Capstone() {
  const [activeSet, setActiveSet] = useState(0);
  const [checked, setChecked] = useState<boolean[]>(() =>
    CHECKLIST.map(() => false),
  );

  const toggleCheck = (i: number) =>
    setChecked((prev) => prev.map((c, j) => (j === i ? !c : c)));

  const currentSet = PROJECT_SETS[activeSet];

  return (
    <div className="container capstone">
      <header className="capstone-head">
        <p className="meta">CAPSTONE — 30 HRS</p>
        <h1>How your capstone is reviewed</h1>
        <p className="capstone-lede">
          Your capstone is a complete AI-automation system built from a
          requirement you have not seen before. The review process itself is an
          AI-automation pipeline — built with exactly the techniques you
          learned in this program. Here is what happens after you hit submit.
        </p>
      </header>

      <ol className="capstone-flow" aria-label="Review process, five steps">
        {STEPS.map((s) => (
          <li key={s.number} className="capstone-step">
            <span className="meta capstone-step-number">{s.number}</span>
            <h2 className="capstone-step-title">{s.title}</h2>
            <p className="capstone-step-body">{s.body}</p>
          </li>
        ))}
      </ol>

      <section className="capstone-rubric" aria-labelledby="rubric-heading">
        <h2 id="rubric-heading">What reviewers look for</h2>
        <ul className="capstone-rubric-list">
          {RUBRIC.map((r) => (
            <li key={r.item}>
              <strong>{r.item}</strong>
              <span> — {r.why}</span>
            </li>
          ))}
        </ul>
      </section>

      <aside className="capstone-note" aria-label="Note on AI scoring">
        <p>
          <strong>A note on the AI score:</strong> the score Claude produces is
          advisory. Every report is read by a human reviewer on the QAE team
          before it reaches you, and the human's judgment is the one that
          counts. The AI makes the review faster and more consistent — it does
          not replace the reviewer. That is the same human-in-the-loop pattern
          you built in Module 4, and it applies to your grade too.
        </p>
      </aside>

      {/* ===== SECTION: Project sets — Set A / B / C tabs ===== */}
      <section className="capstone-projects" aria-labelledby="projects-heading">
        <h2 id="projects-heading">Choose your project</h2>
        <p className="capstone-section-lede">
          Three sets of projects. Pick one from any set. Two students can pick
          the same project — your implementation is what differentiates you.
        </p>

        <div
          className="capstone-tabs"
          role="tablist"
          aria-label="Project sets"
        >
          {PROJECT_SETS.map((set, i) => (
            <button
              key={set.id}
              role="tab"
              id={`tab-${set.id}`}
              aria-selected={i === activeSet}
              aria-controls={`panel-${set.id}`}
              className={`capstone-tab${i === activeSet ? " is-active" : ""}`}
              onClick={() => setActiveSet(i)}
            >
              {set.label}
              <span className="capstone-tab-count">{set.count}</span>
            </button>
          ))}
        </div>

        <ol
          key={currentSet.id}
          id={`panel-${currentSet.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${currentSet.id}`}
          className="capstone-project-list"
        >
          {currentSet.projects.map((p) => (
            <li key={p.number} className="capstone-project">
              <div className="capstone-project-head">
                <span className="meta capstone-project-number">
                  {p.number}
                </span>
                <h3 className="capstone-project-title">{p.title}</h3>
                <span className="capstone-project-track">{p.track}</span>
              </div>
              <dl className="capstone-project-detail">
                <div>
                  <dt>Build</dt>
                  <dd>{p.build}</dd>
                </div>
                <div>
                  <dt>Use</dt>
                  <dd>{p.use}</dd>
                </div>
                <div>
                  <dt>Expect</dt>
                  <dd>{p.expect}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </section>

      {/* ===== SECTION: Evaluation criteria — scoring card grid ===== */}
      <section className="capstone-scoring" aria-labelledby="scoring-heading">
        <h2 id="scoring-heading">How your project is scored</h2>
        <p className="capstone-section-lede">
          Claude reviews your code against these criteria. The QAE team then
          reviews the live URL and adjusts where needed.
        </p>

        <div className="capstone-scoring-grid">
          {SCORING.map((c) => (
            <article key={c.name} className="capstone-scoring-card">
              <p className="capstone-scoring-points">
                {c.points}
                <span> pts</span>
              </p>
              <h3 className="capstone-scoring-name">{c.name}</h3>
              <p className="capstone-scoring-body">{c.body}</p>
            </article>
          ))}
          <article className="capstone-scoring-card capstone-scoring-total">
            <p className="capstone-scoring-points">
              100<span> pts</span>
            </p>
            <h3 className="capstone-scoring-name">Total</h3>
            <p className="capstone-scoring-body">
              QAE reviewer adjusts the final score after testing the live URL.
            </p>
          </article>
        </div>
      </section>

      {/* ===== SECTION: Submission checklist — interactive checkboxes ===== */}
      <section className="capstone-checklist" aria-labelledby="checklist-heading">
        <h2 id="checklist-heading">Before you submit</h2>
        <ul className="capstone-checklist-list">
          {CHECKLIST.map((item, i) => (
            <li key={item}>
              <label className="capstone-check">
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={() => toggleCheck(i)}
                />
                <span className="capstone-check-box" aria-hidden="true" />
                <span className="capstone-check-text">{item}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className="meta capstone-checklist-progress">
          {checked.filter(Boolean).length} / {CHECKLIST.length} READY
        </p>
      </section>

      {/* ===== SECTION: Downloads — project brief PDFs ===== */}
      <section className="capstone-downloads" aria-labelledby="downloads-heading">
        <h2 id="downloads-heading">Project brief documents</h2>
        <p className="capstone-section-lede">
          Download the full project briefs for your chosen set. Bring these to
          your build sessions.
        </p>
        <div className="capstone-downloads-grid">
          {BRIEFS.map((b) => (
            <a key={b.file} className="capstone-download-btn" href={b.file} download>
              <span aria-hidden="true">↓</span> {b.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
