import { useMemo, useState } from "react";
import "./LcelChainDemo.css";

type ParserKind = "str" | "json";

interface Topic {
  topic: string;
  audience: string;
  prose: string;
  json: { concept: string; oneLiner: string; funFact: string };
  tokens: number;
}

const TOPICS: Record<string, Topic> = {
  "black holes": {
    topic: "black holes",
    audience: "a 10-year-old",
    prose:
      "A black hole is a place in space where gravity pulls so hard that not even light can get out. It forms when a giant star runs out of fuel and collapses in on itself.",
    json: {
      concept: "black hole",
      oneLiner: "A region of space where gravity is too strong for light to escape.",
      funFact: "Time slows down the closer you get to one.",
    },
    tokens: 142,
  },
  "compound interest": {
    topic: "compound interest",
    audience: "a 10-year-old",
    prose:
      "Compound interest is when the money you earn also starts earning money. So your savings grow a little faster every year, like a snowball rolling downhill.",
    json: {
      concept: "compound interest",
      oneLiner: "Earning interest on your interest, not just your original money.",
      funFact: "Einstein supposedly called it the eighth wonder of the world.",
    },
    tokens: 138,
  },
  photosynthesis: {
    topic: "photosynthesis",
    audience: "a 10-year-old",
    prose:
      "Photosynthesis is how plants make their own food. They take in sunlight, water, and the air we breathe out, and turn it into sugar and fresh oxygen.",
    json: {
      concept: "photosynthesis",
      oneLiner: "How plants turn sunlight, water, and CO2 into food and oxygen.",
      funFact: "It produces almost all the oxygen you breathe.",
    },
    tokens: 145,
  },
};

interface Stage {
  /** the Runnable name, as it reads in the pipe expression */
  runnable: string;
  signature: string;
  note: string;
  /** rendered output once the data has flowed through this stage */
  value: string;
}

function buildStages(topic: Topic, parser: ParserKind): Stage[] {
  const input = `{ topic: "${topic.topic}", audience: "${topic.audience}" }`;

  const template =
    parser === "str"
      ? `Explain {topic} to {audience} in two sentences.`
      : `Explain {topic} to {audience}. Respond ONLY as JSON\nwith keys: concept, oneLiner, funFact.`;

  const prompt = template
    .replace("{topic}", topic.topic)
    .replace("{audience}", topic.audience);

  const rawModelText = parser === "str" ? topic.prose : JSON.stringify(topic.json);

  const parserStage: Stage =
    parser === "str"
      ? {
          runnable: "StrOutputParser",
          signature: "AIMessage → str",
          note: "Pulls .content off the message and discards the metadata. Output is a plain string, ready to print or pass on.",
          value: topic.prose,
        }
      : {
          runnable: "JsonOutputParser",
          signature: "AIMessage → dict",
          note: "Parses the message content as JSON into a real object. Now downstream code can read .concept directly — no string fishing.",
          value: JSON.stringify(topic.json, null, 2),
        };

  return [
    {
      runnable: "(input)",
      signature: "dict",
      note: "The chain is invoked with a plain dictionary. Its keys fill the prompt template's variables.",
      value: input,
    },
    {
      runnable: "ChatPromptTemplate",
      signature: "dict → PromptValue",
      note: "Substitutes the dict's values into the template's {placeholders} and produces a formatted prompt.",
      value: prompt,
    },
    {
      runnable: "ChatModel",
      signature: "PromptValue → AIMessage",
      note: "Sends the prompt to the model (here, Claude) and returns an AIMessage — content plus metadata, not a bare string.",
      value: `AIMessage(\n  content="${rawModelText}",\n  response_metadata={ tokens: ${topic.tokens} }\n)`,
    },
    parserStage,
  ];
}

export function LcelChainDemo() {
  const [topicKey, setTopicKey] = useState<string>("black holes");
  const [parser, setParser] = useState<ParserKind>("str");
  // how many stages the data has flowed through (1 = input only, ready at the gate)
  const [flowed, setFlowed] = useState(1);

  const stages = useMemo(
    () => buildStages(TOPICS[topicKey], parser),
    [topicKey, parser],
  );

  const finished = flowed >= stages.length;
  const pipeText =
    parser === "str"
      ? "chain = prompt | model | StrOutputParser()"
      : "chain = prompt | model | JsonOutputParser()";

  function reset() {
    setFlowed(1);
  }

  function pickTopic(k: string) {
    setTopicKey(k);
    reset();
  }

  function pickParser(p: ParserKind) {
    setParser(p);
    reset();
  }

  return (
    <div className="lcel-demo">
      <pre className="lcel-pipe-code" aria-label="The chain expression">
        {pipeText}
      </pre>

      <div className="demo-controls" role="group" aria-label="Choose an input">
        {Object.keys(TOPICS).map((k) => (
          <button
            key={k}
            type="button"
            className="demo-btn"
            aria-pressed={topicKey === k}
            onClick={() => pickTopic(k)}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="demo-controls" role="group" aria-label="Choose the final parser">
        <span className="meta lcel-control-label">last link:</span>
        <button
          type="button"
          className="demo-btn"
          aria-pressed={parser === "str"}
          onClick={() => pickParser("str")}
        >
          StrOutputParser
        </button>
        <button
          type="button"
          className="demo-btn"
          aria-pressed={parser === "json"}
          onClick={() => pickParser("json")}
        >
          JsonOutputParser
        </button>
      </div>

      <ol className="lcel-pipeline">
        {stages.map((stage, i) => {
          const done = i < flowed;
          const active = i === flowed - 1;
          return (
            <li
              key={`${stage.runnable}-${i}`}
              className={`lcel-stage${done ? " is-done" : ""}${
                active ? " is-active" : ""
              }`}
            >
              <div className="lcel-stage-head">
                <span className="lcel-runnable">{stage.runnable}</span>
                <span className="lcel-sig meta">{stage.signature}</span>
              </div>
              {done ? (
                <>
                  <pre className="lcel-value">{stage.value}</pre>
                  <p className="lcel-stage-note">{stage.note}</p>
                </>
              ) : (
                <p className="lcel-stage-pending meta">waiting for input…</p>
              )}
              {i < stages.length - 1 && (
                <span className="lcel-connector" aria-hidden="true">
                  │ ▼
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="demo-controls">
        <button
          type="button"
          className="demo-btn is-primary"
          onClick={() => setFlowed((f) => Math.min(f + 1, stages.length))}
          disabled={finished}
        >
          {finished ? "output ready" : "flow to next link"}
        </button>
        <button
          type="button"
          className="demo-btn"
          onClick={reset}
          disabled={flowed <= 1}
        >
          reset
        </button>
      </div>

      <p className="demo-note">
        Same three-link chain, two different last links. StrOutputParser hands
        you a string; JsonOutputParser hands you a parsed object from the same
        model call. That is the point of LCEL — every Runnable takes the
        previous one's output and transforms it, so swapping one link changes
        the result without touching the rest.
      </p>
    </div>
  );
}
