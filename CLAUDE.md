# CLAUDE.md

Canonical agent-facing documentation lives in **[AGENTS.md](./AGENTS.md)** — read it before working on this repository. It covers the project overview, commands, stack, architecture (routing/locale, auth/session, data fetching, SignalR realtime, i18n), code style rules, and the known hotspots/tech-debt backlog.

Note: this repository is a live production application used by hotels and restaurants. Follow the verification trio in AGENTS.md (`npm run lint` + `npm run build` + `npx tsc --noEmit`) after every change, and treat behavior changes as high risk until tests exist.
