# Agent instructions

This folder is a workspace manifest for Amsterdam Design System (ADS) and Engineering Enablement (EE) frontend work.
Each repository below is a separate Git repository in its own subfolder, with its own conventions and tooling.
There is no workspace-level build, lint or test: run each repository's own commands from its root.

## Which instructions win

1. [`development-standards`](development-standards/) sets the rules every repository must meet.
2. A repository's own `AGENTS.md` and skills add detail and win over everything below.
   Read the `AGENTS.md` of the repository you work in, and of the package you change if it has one, before you change anything.
3. This file covers what applies across repositories.
4. The skills in [`.agents/skills`](.agents/skills/) are general guidance from [`amsterdam-agent-skills`](amsterdam-agent-skills/) for applications that consume the design system.
   They can lag behind the current release, so they rank last, and they do not apply inside `design-system`.

When two sources conflict, say so instead of silently following either.

## Repositories

| Repository                 | Source of truth for                                               | Package manager |
| -------------------------- | ----------------------------------------------------------------- | --------------- |
| `development-standards`    | Engineering standards and policies, in Markdown                   | none            |
| `ee-docs`                  | The Docusaurus site that publishes `development-standards`        | npm             |
| `design-system`            | ADS tokens, CSS, React components and Storybook documentation     | pnpm            |
| `ee-ads-rhf`               | `@amsterdam/ee-ads-rhf`: ADS form components with React Hook Form | npm             |
| `ee-react-form-demos`      | Storybook demos of common form use cases                          | npm             |
| `ee-react-map-demos`       | Storybook demos of common map use cases with Leaflet              | npm             |
| `ee-react-template`        | A Vite starter for React applications                             | npm             |
| `amsterdam-agent-skills`   | General agent skills, maintained by the Innovation team           | none            |
| `design-system-prototypes` | Next.js prototypes built with the ADS packages                    | pnpm            |

Change a standard in `development-standards`, never in `ee-docs`: `npm run import-docs` overwrites its `docs/backend`, `docs/frontend`, `docs/general` and `docs/intro.md`.
Never edit `.agents/skills` by hand either: those are installed copies, tracked in `skills-lock.json`, and `node scripts/check-skills.mjs` reports when they fall behind.

## AI use

The [GitHub Copilot usage rules](development-standards/internal/github-copilot.md) apply in every repository:

- GitHub Copilot is the only AI coding tool the department approves.
- Never copy personal data into a prompt, commit, pull request or code; if you come across any, tell the user.
- Code written with GitHub Copilot reaches a main branch only through a pull request that another developer approves.
- If the repository has automated tests, add tests for code GitHub Copilot wrote, covering both the happy path and the error paths.
- Disclose its use: end a commit whose changes it wrote or edited with `Co-authored-by: Copilot <175728472+Copilot@users.noreply.github.com>`, and say so in the pull request description.

## Design system APIs

Never guess a component, prop, token or CSS class of the Amsterdam Design System.
Check it through the `amsterdam-design-system` MCP server, which tracks the `main` branch of `design-system` and so knows released APIs only.
Something a `design-system` branch adds is missing there until it is released; that is not an error.
To check unreleased work, run `pnpm run watch:storybook` in `design-system` and use its local MCP server at `http://localhost:6006/mcp`.
