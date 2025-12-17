export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <svg
        width="240"
        height="120"
        viewBox="0 0 240 120"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-8"
      >
        <path
          id="loop-normal"
          d="M120.5,60.5L146.48,87.02c14.64,14.64,38.39,14.65,53.03,0s14.64-38.39,0-53.03s-38.39-14.65-53.03,0L120.5,60.5
          L94.52,87.02c-14.64,14.64-38.39,14.64-53.03,0c-14.64-14.64-14.64-38.39,0-53.03c14.65-14.64,38.39-14.65,53.03,0z"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="12"
        >
          <animate
            attributeName="stroke-dasharray"
            from="500,50"
            to="450,50"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            from="-40"
            to="-540"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        <path
          id="loop-offset"
          d="M146.48,87.02c14.64,14.64,38.39,14.65,53.03,0s14.64-38.39,0-53.03s-38.39-14.65-53.03,0L120.5,60.5L94.52,87.02c-14.64,14.64-38.39,14.64-53.03,0c-14.64-14.64-14.64-38.39,0-53.03c14.65-14.64,38.39-14.65,53.03,0L120.5,60.5L146.48,87.02z"
          fill="none"
        />

        <path
          id="socket"
          d="M7.5,0c0,8.28-6.72,15-15,15l0-30C0.78-15,7.5-8.28,7.5,0z"
          fill="#0f172a"
        >
          <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
            <mpath href="#loop-offset" />
          </animateMotion>
        </path>

        <path
          id="plug"
          d="M0,9l15,0l0-5H0v-8.5l15,0l0-5H0V-15c-8.29,0-15,6.71-15,15c0,8.28,6.71,15,15,15V9z"
          fill="#0f172a"
        >
          <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
            <mpath href="#loop-normal" />
          </animateMotion>
        </path>
      </svg>

      <p className="uppercase tracking-widest text-slate-900 font-medium">
        Please wait
      </p>
    </div>
  );
}
