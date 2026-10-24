#!/usr/bin/env sh

set -eu

usage() {
  cat <<'EOF'
Usage: ./scripts/clone-repos.sh [core|all] [https|ssh]

Clone the recommended Amsterdam workspace repositories into this workspace.

Modes:
  core  Clone design-system, development-standards and ee-docs.
  all   Clone every repository referenced by this workspace.

Protocols:
  https Clone via https://github.com/Amsterdam/<repo>.git
  ssh   Clone via git@github.com:Amsterdam/<repo>.git
EOF
}

mode="${1:-core}"
protocol="${2:-https}"

case "$mode" in
  core)
    repos='design-system development-standards ee-docs'
    ;;
  all)
    repos='design-system development-standards ee-docs ee-ads-rhf ee-react-form-demos ee-react-map-demos ee-react-template design-system-prototypes amsterdam-agent-skills'
    ;;
  -h|--help|help)
    usage
    exit 0
    ;;
  *)
    usage >&2
    exit 64
    ;;
esac

case "$protocol" in
  https|ssh)
    ;;
  *)
    usage >&2
    exit 64
    ;;
esac

script_dir=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
workspace_root=$(CDPATH= cd -- "$script_dir/.." && pwd)

remote_url() {
  repo="$1"

  case "$protocol" in
    https)
      printf 'https://github.com/Amsterdam/%s.git' "$repo"
      ;;
    ssh)
      printf 'git@github.com:Amsterdam/%s.git' "$repo"
      ;;
  esac
}

cd "$workspace_root"

for repo in $repos; do
  if [ -d "$repo/.git" ] || [ -f "$repo/.git" ]; then
    printf 'Skipping %s: already cloned\n' "$repo"
    continue
  fi

  if [ -e "$repo" ]; then
    printf 'Skipping %s: path exists but is not a Git checkout\n' "$repo" >&2
    continue
  fi

  git clone "$(remote_url "$repo")" "$repo"
done