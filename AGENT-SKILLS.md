# Agent skills

This workspace separates shared skills, which belong to the repository, from optional tools, which belong to each developer.

## Shared skills

The Amsterdam skills from [`amsterdam-agent-skills`](https://github.com/Amsterdam/amsterdam-agent-skills) are shared:
their installed copies live in `.agents/skills/`, and `skills-lock.json` pins them.
Run `node scripts/check-skills.mjs` to see whether they lag behind their source or the design system.

## Recommended optional tools

These tools lower token use and keep agent output and changes small.
They are optional: install them in your own user configuration, not in this repository.

- [Caveman](https://github.com/JuliusBrussee/caveman) makes agent replies terse.
- [Ponytail](https://github.com/DietrichGebert/ponytail) steers agents toward the smallest change that works.
- [RTK](https://github.com/rtk-ai/rtk) compresses the output of shell commands before the agent reads it.
  It is a command-line tool with agent hooks rather than a skill; consider it if long command output fills your context.

## Promoting an optional skill

Make an optional skill shared only when all of the following are true:

- the team wants every contributor and agent to have it by default;
- someone owns its updates, and the repository pins and reviews them;
- `scripts/check-skills.mjs` can verify it;
- its security and licence have been reviewed.

Then vendor it under `.agents/skills/` and record it in `skills-lock.json`.
