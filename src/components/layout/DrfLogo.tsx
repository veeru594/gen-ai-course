import "./DrfLogo.css";

/* Vector recreation of the Dr. Reddy's Foundation mark — swap the <svg>
   for the official asset file when it lands in src/assets/. */
export function DrfLogo() {
  return (
    <span className="drf-logo">
      <svg
        className="drf-logo-mark"
        viewBox="0 0 100 100"
        role="img"
        aria-label="Dr. Reddy's Foundation logo"
      >
        {/* two crescents opening right, around an abstract figure */}
        <path
          d="M 72 13 A 43 43 0 1 0 72 87"
          fill="none"
          stroke="#1879bf"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 68 32 A 26 26 0 1 0 68 68"
          fill="none"
          stroke="#1879bf"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <circle cx="47" cy="44" r="8" fill="#1879bf" />
        <path
          d="M 38 62 Q 50 52 62 58"
          fill="none"
          stroke="#1879bf"
          strokeWidth="9"
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
