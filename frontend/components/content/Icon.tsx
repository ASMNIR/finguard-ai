const PATHS: Record<string, string> = {
  alert: "M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10ZM9 12l2 2 4-4",
  scale: "M12 3v18M5 7l-3 7a3 3 0 0 0 6 0l-3-7Zm14 0-3 7a3 3 0 0 0 6 0l-3-7ZM5 7h14M3 21h18",
  users: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  lock: "M5 11h14v10H5V11Zm3 0V7a4 4 0 0 1 8 0v4",
  chart: "M4 20V10m6 10V4m6 16v-7",
  document: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M8 13h8M8 17h5",
  check: "m9 12 2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.6 9h16.8M3.6 15h16.8M12 3a13.5 13.5 0 0 1 0 18 13.5 13.5 0 0 1 0-18Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 3",
  flag: "M4 22V4m0 1 3.65-.73a6 6 0 0 1 4.7 1.02 6 6 0 0 0 4.7 1.01L20 5v10l-2.95.59a6 6 0 0 1-4.7-1.02 6 6 0 0 0-4.7-1.01L4 14",
  layers: "m12 2 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 5 9 5 9-5",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Zm11 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-4a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  gitBranch: "M6 3v12m0-12a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-3 3c0 6-6 6-9 9",
  mail: "M4 4h16v16H4V4Zm0 0 8 8 8-8",
};

export function Icon({ name, className }: { name: keyof typeof PATHS; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d={PATHS[name]} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export type IconName = keyof typeof PATHS;
