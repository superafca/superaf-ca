#!/usr/bin/env python3
"""Stage owner-requested estimator 005.1 from a reviewed local artifact.

No downloads, permissions, commits, pushes, production writes, or analytics activation.
Run from the superafca/superaf-ca independent sandbox checkout after ordinary
Drive download of the original 005 (or the corrected 005 conversation artifact).
"""
from __future__ import annotations
import argparse
import hashlib
import subprocess
from pathlib import Path

BRANCH = "sandbox/site-rebuild-2026-10-08"
TARGET = Path("public/design-lab/studio-005-1.html")
ORIGINAL_SHA256 = "26cc92fe9d0fb1add67bf5218de9699a712b6e31b2b33121817c96ce34f1f14c"
READY_SHA256 = "3f15b6912b846f1f7c666c2dff30e1f7ab923239b18e797d18e1f6bf64923e8b"
RESULT_SHA256 = "c0fcbcf6d5aabb337a400928fb6c4520b1e11b2644e2de0a0318c1075b31972e"
ORIGINAL_PATCHES = (("const scope=service==='ppf'?M.SCOPE:service==='tint'?", "const scope=service==='ppf'?(state.pack==='max'?['Eligible painted exterior panels','Front, side and rear bodywork','Painted mirror caps','Gloss, Satin or Matte finish']:M.SCOPE):service==='tint'?", 1), ("<strong>${esc(state.year+' '+state.make+' '+state.model)}</strong>", '<strong id="vehicle-title">${esc(state.year+\' \'+state.make+\' \'+state.model)}</strong>', 1), ('Red shows protection—not a paint colour.', 'Highlight shows protection—not a paint colour.', 1), ('const highlightMask=highlight?`<g fill="var(--coverage)" opacity=".9" style="mix-blend-mode:multiply">${paths(G.meta.extras[highlight]?.paths||[], \'data-request="true"\')}</g>`:\'\';', 'const detailOnlyPaths=(G.meta.extras[highlight]?.paths||[]).filter(id=>!requested.includes(id));\n  const highlightMask=detailOnlyPaths.length?`<g fill="var(--coverage)" opacity=".9" style="mix-blend-mode:multiply">${paths(detailOnlyPaths, \'data-request="true"\')}</g>`:\'\';', 1))
OWNER_PATCHES = (('/* Review snapshot of repository pricing. No final-price approvals. */', '/* Public tariff snapshot plus owner-approved windshield protection update, 2026-10-09. No per-model final-price approvals. */', 1), ('"glass":{"clear":269,"tinted":269}', '"glass":{"clear":299,"tinted":299}', 1), ('const rows = `', 'data.source.ownerApprovedOverrides = { windshieldProtection: { amount: 299, currency: "CAD", approvedOn: "2026-10-09" } };\nconst rows = `', 1), ('Existing public tariff snapshot only; no inferred LOW/HIGH mapping or guarantee.', 'Public tariff plus explicit owner-approved windshield update; no inferred LOW/HIGH mapping or guarantee.', 1), ("tint: false, tintFilm: 'carbon', front: 2, rear: 0, zone: 'none',", "tint: false, tintFilm: 'carbon', front: 2, rear: 5, zone: 'none',", 1), ("version: 'public-tariff-005'", "version: 'public-tariff-005.1-glass299'", 1), ('const n = { ...s, tintFilm: family, compare: false };', "const n = { ...s, tint: true, tintFilm: family, compare: false };\n    // Choosing a shade is an explicit request to include that window group.\n    // Restore its default only when it was off; preserve all other chosen counts.\n    if (zone === 'front' && n.front === 0) n.front = 2;\n    if (zone === 'rear' && n.rear === 0) n.rear = 5;\n    if (zone === 'zone' && n.zone === 'none') n.zone = 'windshield';", 1), ("selectedZone='front', isolated=null, failed=false", "selectedZone='front', failed=false", 1), ("const baseIds=isolated?({hood:['hood'],fenders:['fender'],bumper:['bumper'],mirrors:['mirrorNear','mirrorFar']})[isolated]:G.meta.base;", 'const baseIds=G.meta.base; // Included FRONT coverage is fixed, never individually toggled.', 1), (';isolated=null', '', 3), ("  isolated=null;change(patch,titles[pack]+' selected.');", "  change(patch,titles[pack]+' selected.');", 1), (":isolated?'Viewing '+({hood:'hood',fenders:'front fender',bumper:'bumper',mirrors:'mirror caps'})[isolated]+' only; all FRONT parts stay included'", '', 1), ('<div class="scope-chips" role="group" aria-label="Inspect included coverage">${[[\'hood\',\'Full hood\'],[\'fenders\',\'Both front fenders\'],[\'bumper\',\'Front bumper\'],[\'mirrors\',\'Both mirror caps\']].map(([id,t])=>`<button type="button" data-scope="${id}" data-focus="scope-${id}" aria-pressed="${isolated===id}"><b>✓</b>${t}</button>`).join(\'\')}</div>', '<div class="scope-chips" role="list" aria-label="Included FRONT coverage">${M.SCOPE.map(t=>`<span class="scope-item" role="listitem"><b aria-hidden="true">✓</b>${esc(t)}</span>`).join(\'\')}</div>', 1), ("  document.querySelectorAll('[data-scope]').forEach(b=>b.addEventListener('click',()=>{isolated=isolated===b.dataset.scope?null:b.dataset.scope;state.compare=false;render(false);announce('Coverage inspection changed. All FRONT parts remain included; price unchanged.');}));\n", '', 1), ('Tap an included part above to inspect it.', 'These panels are always included; only FRONT+ extras are selectable.', 1), ("['zone','Windshield / visor']", "['zone','Windshield']", 1), ('<label>Extra tint zone<select', '<label>Windshield<select', 1), ('Preview freely. Check “Include tint” to add its price.', 'Tap a shade to add tint to your estimate automatically.', 1), ('Choose an extra glass zone to activate its preview. ', 'Choose a windshield shade to include full-windshield tint, or select a visor strip. ', 1), ('`${b.dataset.shade}% ${b.dataset.tintFamily} preview selected for ${selectedZone}.`', "`${b.dataset.shade}% ${b.dataset.tintFamily} selected for ${selectedZone==='zone'?'windshield':selectedZone+' windows'}. Tint included in your estimate.`", 1), ("'Tint zone changed. Choose its shade.'", "'Windshield option changed. Choose its shade.'", 1), ('.scope-chips button{', '.scope-chips button,.scope-chips .scope-item{', 4), ('Visual Estimator 005</title>', 'Visual Estimator 005.1</title>', 1), ('DESIGN LAB <b>005</b>', 'DESIGN LAB <b>005.1</b>', 1), ('DESIGN LAB 005 ·', 'DESIGN LAB 005.1 ·', 1), ('these are existing-tariff estimates, not guaranteed offers.', 'these are estimates, including the owner-approved $299 windshield-protection price, not guaranteed offers.', 1))

def apply_patches(text: str, patches: tuple) -> str:
    for before, after, count in patches:
        if text.count(before) != count:
            raise ValueError("Patch anchor missing/repeated; stop and reconcile, do not guess.")
        text = text.replace(before, after)
    return text


def corrected_bytes(content: bytes) -> bytes:
    digest = hashlib.sha256(content).hexdigest()
    if digest == RESULT_SHA256:
        return content
    if digest not in {ORIGINAL_SHA256, READY_SHA256}:
        raise ValueError("Unrecognized input; use reviewed original/ready 005, not an edited or partial copy.")
    text = content.decode("utf-8", errors="strict")
    if digest == ORIGINAL_SHA256:
        text = apply_patches(text, ORIGINAL_PATCHES)
        if hashlib.sha256(text.encode()).hexdigest() != READY_SHA256:
            raise ValueError("005 correction checksum mismatch.")
    result = apply_patches(text, OWNER_PATCHES).encode("utf-8")
    if hashlib.sha256(result).hexdigest() != RESULT_SHA256:
        raise ValueError("005.1 output differs from the tested artifact.")
    return result


def git(root: Path, *args: str) -> str:
    return subprocess.check_output(["git", "-C", str(root), *args], text=True).strip()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact", type=Path, help="Reviewed original 005, corrected 005, or tested 005.1 HTML")
    args = parser.parse_args()
    root = Path(git(Path.cwd(), "rev-parse", "--show-toplevel")).resolve()
    if git(root, "branch", "--show-current") != BRANCH:
        raise SystemExit("Wrong branch; only the independent sandbox is allowed.")
    if git(root, "remote", "get-url", "origin") not in {
        "https://github.com/superafca/superaf-ca.git", "https://github.com/superafca/superaf-ca",
        "git@github.com:superafca/superaf-ca.git", "ssh://git@github.com/superafca/superaf-ca.git",
    }:
        raise SystemExit("Unexpected repository origin; stop for review.")
    content = corrected_bytes(args.artifact.read_bytes())
    dest = root / TARGET
    if not dest.resolve().is_relative_to(root) or any(p.is_symlink() for p in (dest, *dest.parents)):
        raise SystemExit("Refusing symlink/path outside checkout.")
    if dest.exists():
        if dest.read_bytes() != content:
            raise SystemExit("005.1 destination differs; preserving it for reconciliation.")
        print("005.1 already staged; no files changed.")
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    with dest.open("xb") as handle:
        handle.write(content)
    print(f"Staged only {TARGET}: {len(content)} bytes; SHA256 {RESULT_SHA256}")
    print("No commit, push, homepage/production edit, or tracking activation performed.")


if __name__ == "__main__":
    main()
