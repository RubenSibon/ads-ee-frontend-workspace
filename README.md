# Amsterdam Design System (ADS) and Engineering Enablement (EE) frontend Workspace

Workspace for Amsterdam Design System (ADS) and frontend-focused Engineering Enablement (EE) projects.

## Workspace file

Use this multi-root workspace definition:

- `ads-ee-frontend.code-workspace`

It lists the core repositories first and recommends the VS Code extensions this workspace relies on.

## Goal

Enable ADS and EE frontend developers to manage, maintain, and evolve the projects that teams use or consult for consumer-facing applications and websites, both public and internal.

## What this workspace contains

- A multi-root workspace definition that references ADS and EE frontend repositories by local folder name.
- A curated list of repositories that teams use as implementation and reference sources.
- Shared workspace-level policies for IDE setup, MCP, formatting ownership and [agent skills](AGENT-SKILLS.md).

Core repositories:

- `design-system`
- `development-standards`
- `ee-docs`

Supporting repositories:

- `ee-ads-rhf`
- `ee-react-form-demos`
- `ee-react-map-demos`
- `ee-react-template`
- `design-system-prototypes`
- `amsterdam-agent-skills`

## Repository bootstrap

Clone the repositories from the Amsterdam GitHub organisation into this folder with the bootstrap script, from the workspace root:

```sh
./scripts/clone-repos.sh core https  # the core repositories over HTTPS
./scripts/clone-repos.sh all ssh     # every repository over SSH
```

The script skips repositories that are already cloned.
VS Code and Zed offer the same commands as tasks when you open this repository root.

This workspace intentionally does not use Git submodules.
The nested repositories stay independent, keep their own history and remotes, and are ignored by this workspace-manifest repository.

## Editor support

- VS Code: `.vscode/settings.json` makes the source control view find the core repositories when you open this repository root.
- Zed: `.zed/settings.json` includes the core repositories in file scans, although this repository ignores them, and excludes their `node_modules`.
- JetBrains IDEs detect the nested Git repositories themselves, so this workspace ships no `.idea` configuration.

## Working model

- Project-level formatting is repository-owned.
- Workspace-level behavior is cross-IDE and minimal.
- Development standards are leading for engineering decisions.

## Workspace policies

### Formatting ownership

- Each repository owns its own Prettier configuration.
- Workspace-root Prettier style overrides are not used.
- Cross-IDE baseline text behavior is shared through `.editorconfig`.

### Development standards precedence

- Frontend browser capability checks follow `development-standards` guidance.
- Frontend lint configurations should enforce:
  - `eslint-plugin-baseline-js`
  - `stylelint-plugin-use-baseline`

### Gitignore strategy

- Default principle: OS-specific, IDE-specific, and user-specific patterns belong in each developer's [global gitignore](https://docs.github.com/en/get-started/git-basics/ignoring-files#configuring-ignored-files-for-all-repositories-on-your-computer).
- Workspace exception: this repository intentionally tracks IDE configuration directories.
- Repository `.gitignore` contains negation rules (`!`) so globally ignored IDE paths are still tracked in this workspace.
- Cloned project repositories in this folder are ignored by the workspace-manifest repository to keep them independent.

Suggested global patterns outside this workspace:

- `.idea/`
- `.vscode/`
- `.zed/`
- `.DS_Store`
- `Thumbs.db`
- `*.swp`

Set global gitignore once:

```bash
git config --global core.excludesfile ~/.gitignore_global
```

References:

- GitHub Docs: [Configuring ignored files for all repositories on your computer](https://docs.github.com/en/get-started/git-basics/ignoring-files#configuring-ignored-files-for-all-repositories-on-your-computer)
- Gitignore Generator: [windows, macos, linux, webstorm, phpstorm, pycharm, visualstudiocode, vim](https://www.toptal.com/developers/gitignore/api/windows,macos,linux,webstorm,phpstorm,pycharm,visualstudiocode,vim)

Verify which ignore rule wins for a path:

```bash
git check-ignore -v .vscode/settings.json
git check-ignore -v .idea/workspace.xml
git check-ignore -v .zed/settings.json
```

Note: if a path is not ignored, `git check-ignore` prints nothing and exits with status `1`.

## Required shared files

The following files are intentionally versioned:

- `.mcp.json`
- `.vscode/mcp.json`
- `.zed/settings.json`
- `.editorconfig`
- `AGENTS.md` and `AGENT-SKILLS.md`
- `.agents/skills/` and `skills-lock.json`

This workspace may also track additional IDE files under `.vscode/` and `.zed/` by explicit policy.

### MCP dual-file policy

- The workspace maintains two equivalent MCP files:
  - `.mcp.json` (canonical portable source)
  - `.vscode/mcp.json` (VS Code native workspace location)

Rationale:

- VS Code uses `.vscode/mcp.json` as its documented workspace MCP location.
- Agent Host and cross-tool workflows can read portable workspace MCP configuration from `.mcp.json`.

## Contribution expectations

- Keep workspace policy changes documented in this README.
- When you change `.mcp.json` or `.vscode/mcp.json`, make the same change in the other file.
