import deckyPlugin from "@decky/rollup";

// The preset hardcodes src/index.tsx and merges its own defaults last, so the
// entry point has to be replaced on the result rather than passed in.
export default { ...deckyPlugin(), input: "./frontend/index.tsx" };
