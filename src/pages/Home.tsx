import { Link } from "react-router-dom";
import { modules, programHours } from "../data/modules";
import { Highlight } from "../components/ui/Highlight";
import { AsciiHero } from "../components/ui/AsciiHero";
import "./Home.css";

export function Home() {
  return (
    <div className="container home">
      <header className="home-strip">
        <p className="meta home-strip-program">
          Automation with Generative AI — NGO Training Program
        </p>
        <p className="meta home-strip-hours">
          {programHours.theory} THEORY / {programHours.employability}{" "}
          EMPLOYABILITY / {programHours.lab} LAB / {programHours.capstone}{" "}
          CAPSTONE = {programHours.total} HRS
        </p>
      </header>

      <AsciiHero />

      <section className="home-thesis">
        <h1>
          Understanding first.
          <br />
          Tools second.
        </h1>
        <p>
          A common mistake in AI education is to teach people how to use tools
          without teaching them why those tools behave the way they do. That
          approach produces practitioners who can{" "}
          <Highlight>follow tutorials but cannot adapt</Highlight> when things
          go wrong.
        </p>
        <p>
          This program takes the opposite approach. Five modules build the
          understanding — how LLMs actually work, how automation actually
          fails, how to choose models, how agents decide, how Python glues it
          together — and{" "}
          <Highlight>
            that understanding makes every tool easier to use correctly
          </Highlight>
          . The voice throughout is a senior engineer teaching, because{" "}
          <Highlight>the goal is practitioners, not tool operators</Highlight>.
        </p>
      </section>

      <section className="home-path" aria-label="The five modules">
        <h2 className="meta home-path-title">The learning path — 5 modules, 220 theory hours</h2>
        <ol className="home-path-list">
          {modules.map((m) => (
            <li key={m.id} data-module={m.id} className="home-path-row">
              <Link to={`/module/${m.id}`} className="home-path-link">
                <span className="meta home-path-number">{m.number}</span>
                <span className="home-path-body">
                  <span className="home-path-name">{m.title}</span>
                  <span className="home-path-tagline">{m.tagline}</span>
                </span>
                <span className="meta home-path-hours">{m.hours} HRS</span>
              </Link>
            </li>
          ))}
        </ol>
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
