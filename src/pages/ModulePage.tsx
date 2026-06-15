import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getModule } from "../data/modules";
import { NotFound } from "./NotFound";
import type { Session } from "../data/types";
import { ModuleHero } from "../components/ui/ModuleHero";
import { ConceptCard } from "../components/ui/ConceptCard";
import { ExerciseCard } from "../components/ui/ExerciseCard";
import { ResourceRail } from "../components/ui/ResourceRail";
import { CodeBlock } from "../components/ui/CodeBlock";
import { DemoHost } from "../components/demos/DemoHost";
import { JourneyVideo } from "../components/ui/JourneyVideo";
import "./ModulePage.css";

function SessionSection({ session }: { session: Session }) {
  return (
    <section className="session" aria-labelledby={`session-${session.id}`}>
      <h2 id={`session-${session.id}`} className="session-title">
        {session.title}
      </h2>
      {session.paragraphs.map((p, i) => (
        <p key={i} className="session-para">
          {p}
        </p>
      ))}
      <dl className="session-topics">
        {session.topics.map((t) => (
          <div key={t.topic} className="session-topic-row">
            <dt>{t.topic}</dt>
            <dd>{t.meaning}</dd>
          </div>
        ))}
      </dl>
      {session.code && (
        <CodeBlock
          code={session.code.code}
          language={session.code.language}
          label={session.code.label}
        />
      )}
    </section>
  );
}

export function ModulePage() {
  const { id } = useParams<{ id: string }>();
  const module = getModule(id);
  const [done, setDone] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    if (module) {
      document.title = `M${module.number} ${module.title} — Automation with Generative AI`;
    }
  }, [module]);

  if (!module) {
    return <NotFound />;
  }

  function toggleExercise(exId: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(exId)) {
        next.delete(exId);
      } else {
        next.add(exId);
      }
      return next;
    });
  }

  return (
    <div className="module-page" data-module={module.id} key={module.id}>
      <div className="container module-layout">
        <article className="module-content">
          <ModuleHero module={module} />

          {/* The cinematic opener lives only on Module 01 — the awe primer
              for the whole curriculum, before any lesson begins. */}
          {module.id === "foundations" && <JourneyVideo />}

          {module.sessions.map((session, i) => (
            <Fragment key={session.id}>
              <SessionSection session={session} />
              {module.demos
                .filter((d) => d.afterSession === i)
                .map((d) => (
                  <DemoHost key={d.id} spec={d} />
                ))}
            </Fragment>
          ))}

          <section className="module-concepts" aria-labelledby="key-concepts">
            <h2 id="key-concepts">Key Concepts</h2>
            <p className="module-section-note">
              Hover, tap, or focus a card to reveal the definition.
            </p>
            <div className="module-concepts-grid">
              {module.concepts.map((c) => (
                <ConceptCard key={c.term} concept={c} />
              ))}
            </div>
          </section>

          <section className="module-exercises" aria-labelledby="exercises">
            <h2 id="exercises">Practice Exercises</h2>
            <p className="module-section-note">
              STARTER builds confidence. BUILD requires assembly. SHIP means
              production standards — error handling included.
            </p>
            <ul className="module-exercise-list">
              {module.exercises.map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  done={done.has(ex.id)}
                  onToggle={toggleExercise}
                />
              ))}
            </ul>
          </section>
        </article>

        <ResourceRail resources={module.resources} />
      </div>
    </div>
  );
}
