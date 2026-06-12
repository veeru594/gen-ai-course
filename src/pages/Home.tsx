import { Link } from "react-router-dom";
import { programHours } from "../data/modules";
import { Highlight } from "../components/ui/Highlight";
import { AsciiHero } from "../components/ui/AsciiHero";
import { LlmDiagram } from "../components/ui/LlmDiagram";
import "./Home.css";

const TOOLS = [
  "Python",
  "Anthropic SDK",
  "OpenAI SDK",
  "Claude",
  "GPT-4o",
  "o-series",
  "Gemini",
  "ElevenLabs",
  "Make.com",
  "n8n",
  "LangChain",
  "LangGraph",
  "LlamaIndex",
  "MCP",
  "ChromaDB",
  "requests",
];

export function Home() {
  return (
    <div className="container home">
      <AsciiHero />

      <div className="home-thesis-row">
        <section className="home-thesis">
          <p className="meta home-kicker">NGO Training Program</p>
          <h1>
            Understanding first.
            <br />
            Tools second.
          </h1>
          <p className="meta home-hours">
            {programHours.theory} THEORY / {programHours.employability}{" "}
            EMPLOYABILITY / {programHours.lab} LAB / {programHours.capstone}{" "}
            CAPSTONE = {programHours.total} HRS
          </p>
          <p>
            A common mistake in AI education is to teach people how to use
            tools without teaching them why those tools behave the way they
            do. That approach produces practitioners who can{" "}
            <Highlight>follow tutorials but cannot adapt</Highlight> when
            things go wrong.
          </p>
          <p>
            This program takes the opposite approach. Five modules build the
            understanding — how LLMs actually work, how automation actually
            fails, how to choose models, how agents decide, how Python glues
            it together — and{" "}
            <Highlight>
              that understanding makes every tool easier to use correctly
            </Highlight>
            . The voice throughout is a senior engineer teaching, because{" "}
            <Highlight>
              the goal is practitioners, not tool operators
            </Highlight>
            .
          </p>
        </section>

        <aside className="home-outcomes" aria-label="Program outcomes">
          <h2 className="meta home-outcomes-title">By the end, you can</h2>
          <ol className="home-outcomes-list">
            <li>
              Write Python that calls, chains, and orchestrates AI APIs
              across providers
            </li>
            <li>
              Explain how LLMs work — tokens, attention, RAG — well enough
              to make engineering decisions
            </li>
            <li>
              Pick the right model per task across Claude, OpenAI, Gemini,
              and ElevenLabs
            </li>
            <li>
              Design and ship automation workflows in Make.com and n8n that
              survive failure
            </li>
            <li>
              Build agents and multi-agent systems with LangChain,
              LangGraph, LlamaIndex, and MCP
            </li>
            <li>
              Design, document, and maintain complete AI-automation systems
              in production
            </li>
          </ol>
        </aside>
      </div>

      <section className="home-tools" aria-label="Tools covered">
        <div className="home-tools-track" aria-hidden="true">
          {[...TOOLS, ...TOOLS].map((tool, i) => (
            <span key={i} className="home-tools-item">
              {tool}
            </span>
          ))}
        </div>
        <p className="visually-hidden">Tools covered: {TOOLS.join(", ")}</p>
      </section>

      <section className="home-llm" aria-labelledby="home-llm-title">
        <h2 className="meta home-path-title" id="home-llm-title">
          Inside the machine — and this one is real
        </h2>
        <p className="home-llm-lede">
          This is not a looping animation. It is a working language model —
          a tiny one: n-gram statistics learned from this curriculum's own
          text, computed live in your browser. Seed it with a few words and
          watch it choose every next token from a genuine probability
          distribution, append it, and run again. The gap between this and
          GPT is scale, not kind — which is exactly why Module 01 starts
          here.
        </p>
        <LlmDiagram />
        <p className="home-llm-link">
          <Link to="/module/foundations">
            Start where the machine starts — Module 01: GenAI Foundations
            &amp; LLM Architecture →
          </Link>
        </p>
      </section>

      <section className="home-cta" aria-label="Try the playground">
        <div className="home-cta-text">
          <p className="home-cta-prompt">
            <span className="home-cta-user">student@course</span>:~${" "}
            <span className="home-cta-cmd">open /playground</span>
          </p>
          <p className="home-cta-body">
            Don't take the thesis on faith — run it. Six interactive demos:
            tokenization, temperature, workflow failure, model selection,
            agent loops, output contracts. No API keys, no network calls,
            pure client-side.
          </p>
        </div>
        <Link to="/playground" className="home-cta-btn">
          run the demos →
        </Link>
      </section>

      <section className="home-method" aria-label="How the program teaches">
        <h2 className="meta home-method-title">How the program teaches</h2>
        <div className="home-method-steps">
          <div className="home-method-step">
            <span className="meta">01 — THEORY</span>
            <p>
              A concept is taught the morning it matters — mechanism before
              interface, why before what.
            </p>
          </div>
          <div className="home-method-step">
            <span className="meta">02 — LAB, SAME DAY</span>
            <p>
              The same concept is built by hand the same afternoon. 200 lab
              hours sit beside the 220 theory hours.
            </p>
          </div>
          <div className="home-method-step">
            <span className="meta">03 — CAPSTONE</span>
            <p>
              A complete AI-automation system from an unseen requirement —
              designed, built, documented, and reviewed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
