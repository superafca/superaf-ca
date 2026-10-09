#!/usr/bin/env python3
"""Stage tested 005.2 from an authorized original/ready 005 or 005.1/005.2 HTML.
Offline transformation only: no downloads, sharing, commits, pushes or production edits.
Existing stage-estimator0051.py supplies the earlier guarded transformations.
"""
from __future__ import annotations
import argparse, base64, hashlib, json, runpy, subprocess, zlib
from pathlib import Path
BRANCH = "sandbox/site-rebuild-2026-10-08"
TARGET = Path("public/design-lab/studio-005-2.html")
BASE_SHA256 = "c0fcbcf6d5aabb337a400928fb6c4520b1e11b2644e2de0a0318c1075b31972e"
RESULT_SHA256 = "5f696ac6855a81ba1d9da17e264b828156a7b9218568430938eb072adf01abfc"
# Compressed JSON line edits, not executable code. The high-resolution image bytes never change.
PATCH = "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"

def corrected_bytes(content: bytes) -> bytes:
    if hashlib.sha256(content).hexdigest() == RESULT_SHA256:
        return content
    if hashlib.sha256(content).hexdigest() != BASE_SHA256:
        previous = runpy.run_path(str(Path(__file__).with_name("stage-estimator0051.py")))
        content = previous["corrected_bytes"](content)
    if hashlib.sha256(content).hexdigest() != BASE_SHA256:
        raise ValueError("Unrecognized input; preserve it and reconcile rather than guessing.")
    lines = content.decode("utf-8", errors="strict").splitlines(keepends=True)
    for start, end, replacement in reversed(json.loads(zlib.decompress(base64.b64decode(PATCH)))):
        lines[start:end] = replacement
    result = "".join(lines).encode("utf-8")
    if hashlib.sha256(result).hexdigest() != RESULT_SHA256:
        raise ValueError("005.2 checksum mismatch. Nothing was written.")
    return result

def git(root: Path, *args: str) -> str:
    return subprocess.check_output(["git", "-C", str(root), *args], text=True).strip()

def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact", type=Path)
    args = parser.parse_args()
    root = Path(git(Path.cwd(), "rev-parse", "--show-toplevel")).resolve()
    if git(root, "branch", "--show-current") != BRANCH:
        raise SystemExit("Wrong branch; independent sandbox only.")
    if git(root, "remote", "get-url", "origin") not in {
        "https://github.com/superafca/superaf-ca.git", "https://github.com/superafca/superaf-ca",
        "git@github.com:superafca/superaf-ca.git", "ssh://git@github.com/superafca/superaf-ca.git",
    }:
        raise SystemExit("Unexpected repository origin.")
    content = corrected_bytes(args.artifact.read_bytes())
    dest = root / TARGET
    if not dest.resolve().is_relative_to(root) or any(p.is_symlink() for p in (dest, *dest.parents)):
        raise SystemExit("Refusing symlink/path outside checkout.")
    if dest.exists():
        if dest.read_bytes() != content:
            raise SystemExit("Destination differs; preserving concurrent work.")
        print("005.2 already staged; no change.")
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    with dest.open("xb") as handle:
        handle.write(content)
    print(f"Staged only {TARGET}: {len(content)} bytes; SHA256 {RESULT_SHA256}")
    print("No commit, push, homepage/production edit or tracking activation.")

if __name__ == "__main__":
    main()
