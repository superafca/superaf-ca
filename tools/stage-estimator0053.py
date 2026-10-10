#!/usr/bin/env python3
"""Stage only the tested 005.3 sandbox HTML from an authorized reviewed artifact.
Public Canadian source is a second, checksum-checked input, not a live dependency.
No network calls, permission changes, commits, pushes, routing or production writes.
"""
from __future__ import annotations
import argparse,base64,hashlib,json,re,runpy,subprocess,zipfile,zlib
from pathlib import Path
BRANCH='sandbox/site-rebuild-2026-10-08'
TARGET=Path('public/design-lab/studio-005-3.html')
BASE_SHA256='5f696ac6855a81ba1d9da17e264b828156a7b9218568430938eb072adf01abfc'
RESULT_SHA256='6679698809f2d1ef6c28d6d4faca5ecd54d8fcaafeafda5d62746a05ee1cba50'
SOURCE_SHA256='0f28168cbeec3767f494675ae030ba1f0bd9090578eb3628335a17d260783f4e'
# Compressed JSON line edits only; original image payloads are not in this patch.
PATCH='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'

def catalog_source(path: Path) -> bytes:
    if path.suffix.lower()=='.zip':
        with zipfile.ZipFile(path) as archive:
            names=[n for n in archive.namelist() if n.endswith('nrcan-model-years.json')]
            if len(names)!=1 or archive.getinfo(names[0]).file_size>2000000:
                raise ValueError('Expected one bounded official source JSON in the archive')
            content=archive.read(names[0])
    else:
        if path.stat().st_size>2000000:raise ValueError('Source is too large')
        content=path.read_bytes()
    if hashlib.sha256(content).hexdigest()!=SOURCE_SHA256:
        raise ValueError('Source differs from reviewed Canadian data. Reconcile before import.')
    return content

def corrected_bytes(content: bytes, source: bytes | None = None) -> bytes:
    if hashlib.sha256(content).hexdigest()==RESULT_SHA256:return content
    if hashlib.sha256(content).hexdigest()!=BASE_SHA256:
        earlier=runpy.run_path(str(Path(__file__).with_name('stage-estimator0052.py')))
        content=earlier['corrected_bytes'](content)
    if hashlib.sha256(content).hexdigest()!=BASE_SHA256:raise ValueError('Unknown reviewed artifact')
    if source is None or hashlib.sha256(source).hexdigest()!=SOURCE_SHA256:
        raise ValueError('The checksum-verified public Canadian source JSON is required')
    text=content.decode('utf-8',errors='strict')
    match=re.findall(r'const rows = `(.*?)`;',text,re.S)
    if len(match)!=1:raise ValueError('Expected exactly one legacy model-name table')
    legacy=[];make=None
    for line in match[0].splitlines():
        line=line.strip()
        if not line:continue
        if line.startswith('[') and line.endswith(']'):
            make={'name':line[1:-1],'models':[]};legacy.append(make)
        elif make is not None:make['models'].append({'name':line.split('|')[0]})
        else:raise ValueError('Invalid legacy name table')
    compiler=runpy.run_path(str(Path(__file__).with_name('build-vehicle-catalog.py')))
    catalogue=compiler['render_catalog'](compiler['build_catalog'](json.loads(source),legacy)).decode('utf-8')
    lines=text.splitlines(keepends=True)
    for start,end,replacement in reversed(json.loads(zlib.decompress(base64.b64decode(PATCH)))):
        lines[start:end]=replacement
    text=''.join(lines)
    if text.count('__SUPERAF_CA_CATALOG_0053__')!=1:raise ValueError('Invalid catalog insertion point')
    result=text.replace('__SUPERAF_CA_CATALOG_0053__',catalogue).encode('utf-8')
    if hashlib.sha256(result).hexdigest()!=RESULT_SHA256:raise ValueError('005.3 output checksum mismatch; nothing written')
    return result

def git(root: Path,*args: str) -> str:
    return subprocess.check_output(['git','-C',str(root),*args],text=True).strip()

def main() -> None:
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('artifact',type=Path)
    parser.add_argument('--catalog-source',type=Path,help='Public workflow source ZIP or nrcan-model-years.json')
    args=parser.parse_args();root=Path(git(Path.cwd(),'rev-parse','--show-toplevel')).resolve()
    if git(root,'branch','--show-current')!=BRANCH:raise SystemExit('Wrong branch: independent sandbox only')
    if git(root,'remote','get-url','origin') not in {
        'https://github.com/superafca/superaf-ca.git','https://github.com/superafca/superaf-ca',
        'git@github.com:superafca/superaf-ca.git','ssh://git@github.com/superafca/superaf-ca.git'}:
        raise SystemExit('Wrong repository origin')
    data=catalog_source(args.catalog_source) if args.catalog_source else None
    content=corrected_bytes(args.artifact.read_bytes(),data);dest=root/TARGET
    if not dest.resolve().is_relative_to(root) or any(p.is_symlink() for p in (dest,*dest.parents)):
        raise SystemExit('Refusing symlink or destination outside checkout')
    if dest.exists():
        if dest.read_bytes()!=content:raise SystemExit('Destination differs; preserving concurrent work')
        print('005.3 already staged; no changes');return
    dest.parent.mkdir(parents=True,exist_ok=True)
    with dest.open('xb') as handle:handle.write(content)
    print(f'Staged only {TARGET}: {len(content)} bytes; SHA256 {RESULT_SHA256}')
    print('No commit, push, production or live tracking changes.')
if __name__=='__main__':main()
