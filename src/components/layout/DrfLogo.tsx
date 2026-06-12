import "./DrfLogo.css";

/* Vector recreation of the Dr. Reddy's Foundation mark — swap the <svg>
   for the official asset file when it lands in src/assets/. */
export function DrfLogo() {
  return (
    <span className="drf-logo">
      <svg
        className="drf-logo-mark"
        viewBox="0 0 80 80"
        role="img"
        aria-label="Dr. Reddy's Foundation logo"
      >
        <g
          fill="none"
          stroke="#1879bf"
          strokeLinecap="round"
          transform="rotate(-18 40 40)"
        >
          <path d="M 40 6 A 34 34 0 0 0 40 74" strokeWidth="9" />
          <path d="M 40 22 A 18 18 0 0 0 40 58" strokeWidth="8" />
        </g>
        <circle cx="36" cy="34" r="7" fill="#1879bf" />
        <path
          d="M 28 56 Q 36 42 48 47"
          fill="none"
          stroke="#1879bf"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
      <span className="drf-logo-text">
        <span className="drf-logo-name">Dr.&thinsp;Reddy&rsquo;s</span>
        <span className="drf-logo-rule" />
        <span className="drf-logo-foundation">Foundation</span>
      </span>
    </span>
  );
}
