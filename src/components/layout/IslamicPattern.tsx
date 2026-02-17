export default function IslamicPattern() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.03]">
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="islamic-pattern"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* Eight-pointed star pattern */}
            <path
              d="M40 0 L48 16 L64 16 L52 28 L56 44 L40 36 L24 44 L28 28 L16 16 L32 16 Z"
              fill="none"
              stroke="#D4A843"
              strokeWidth="0.5"
            />
            <path
              d="M0 40 L8 56 L24 56 L12 68 L16 84 L0 76 L-16 84 L-12 68 L-24 56 L-8 56 Z"
              fill="none"
              stroke="#D4A843"
              strokeWidth="0.5"
            />
            <path
              d="M80 40 L88 56 L104 56 L92 68 L96 84 L80 76 L64 84 L68 68 L56 56 L72 56 Z"
              fill="none"
              stroke="#D4A843"
              strokeWidth="0.5"
            />
            {/* Connecting lines */}
            <circle cx="40" cy="40" r="20" fill="none" stroke="#D4A843" strokeWidth="0.3" />
            <circle cx="0" cy="0" r="12" fill="none" stroke="#D4A843" strokeWidth="0.3" />
            <circle cx="80" cy="0" r="12" fill="none" stroke="#D4A843" strokeWidth="0.3" />
            <circle cx="0" cy="80" r="12" fill="none" stroke="#D4A843" strokeWidth="0.3" />
            <circle cx="80" cy="80" r="12" fill="none" stroke="#D4A843" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
      </svg>
    </div>
  );
}
