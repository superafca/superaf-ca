#!/usr/bin/env python3
"""Stage the exact reviewed 005 artifact plus four bounded UI corrections.

No network, no credentials, no commit/push, no production writes.
Download the original HTML using normal authorized access as specified in HQ #30.
Run from a checkout of superafca/superaf-ca on the independent sandbox branch.
"""
from __future__ import annotations
import argparse
import hashlib
import subprocess
from pathlib import Path

BRANCH = "sandbox/site-rebuild-2026-10-08"
SOURCE_BYTES = 1120478
SOURCE_SHA256 = "26cc92fe9d0fb1add67bf5218de9699a712b6e31b2b33121817c96ce34f1f14c"
RESULT_SHA256 = "3f15b6912b846f1f7c666c2dff30e1f7ab923239b18e797d18e1f6bf64923e8b"
TARGET = Path("public/design-lab/studio-005.html")
# Literal replacements are checked once each; unexpected source fails closed.
PATCHES = (
    (
        "const scope=service==='ppf'?M.SCOPE:service==='tint'?",
        "const scope=service==='ppf'?(state.pack==='max'?['Eligible painted exterior panels','Front, side and rear bodywork','Painted mirror caps','Gloss, Satin or Matte finish']:M.SCOPE):service==='tint'?",
    ),
    (
        '<strong>${esc(state.year+\' \'+state.make+\' \'+state.model)}</strong>',
        '<strong id="vehicle-title">${esc(state.year+\' \'+state.make+\' \'+state.model)}</strong>',
    ),
    (
        "Red shows protection—not a paint colour.",
        "Highlight shows protection—not a paint colour.",
    ),
    (
        "const highlightMask=highlight?`<g fill=\"var(--coverage)\" opacity=\".9\" style=\"mix-blend-mode:multiply\">${paths(G.meta.extras[highlight]?.paths||[], 'data-request=\"true\"')}</g>`:'';",
        "const detailOnlyPaths=(G.meta.extras[highlight]?.paths||[]).filter(id=>!requested.includes(id));\n  const highlightMask=detailOnlyPaths.length?`<g fill=\"var(--coverage)\" opacity=\".9\" style=\"mix-blend-mode:multiply\">${paths(detailOnlyPaths, 'data-request=\"true\"')}</g>`:'';",
    ),
)


def corrected_bytes(content: bytes) -> bytes:
    """Validate the original artifact before applying reviewed textual corrections."""
    if len(content) != SOURCE_BYTES or hashlib.sha256(content).hexdigest() != SOURCE_SHA256:
        raise ValueError("Source size/hash mismatch; use the original artifact from HQ #30.")
    text = content.decode("utf-8", errors="strict")
    for old, new in PATCHES:
        if text.count(old) != 1:
            raise ValueError("Expected patch anchor is missing or repeated; stop for review.")
        text = text.replace(old, new, 1)
    result = text.encode("utf-8")
    if hashlib.sha256(result).hexdigest() != RESULT_SHA256:
        raise ValueError("Corrected output differs from the tested result; stop for review.")
    return result


def git(root: Path, *args: str) -> str:
    return subprocess.check_output(["git", "-C", str(root), *args], text=True).strip()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact", type=Path, help="Downloaded original 005 standalone HTML")
    args = parser.parse_args()
    root = Path(git(Path.cwd(), "rev-parse", "--show-toplevel")).resolve()
    if git(root, "branch", "--show-current") != BRANCH:
        raise SystemExit("Wrong branch; only the independent sandbox is allowed.")
    origin = git(root, "remote", "get-url", "origin")
    if origin not in {
        "https://github.com/superafca/superaf-ca.git",
        "https://github.com/superafca/superaf-ca",
        "git@github.com:superafca/superaf-ca.git",
        "ssh://git@github.com/superafca/superaf-ca.git",
    }:
        raise SystemExit("Unexpected repository origin; stop for review.")
    content = corrected_bytes(args.artifact.read_bytes())
    dest = root / TARGET
    if not dest.resolve().is_relative_to(root) or any(p.is_symlink() for p in (dest, *dest.parents)):
        raise SystemExit("Refusing a symlink or path outside the checkout.")
    if dest.exists():
        if dest.read_bytes() != content:
            raise SystemExit("Destination already differs; preserve it and reconcile first.")
        print("The corrected artifact is already staged; no files changed.")
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    with dest.open("xb") as handle:
        handle.write(content)
    print(f"Staged ONLY {TARGET}: {len(content)} bytes")
    print("SHA256 " + hashlib.sha256(content).hexdigest())
    print("No commit, push, homepage redirect, production change or tracking activation performed.")


if __name__ == "__main__":
    main()
