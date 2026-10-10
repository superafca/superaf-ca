#!/usr/bin/env python3
"""Stage the reviewed 006 HTML only; no network, commit, push or route changes."""
import argparse
import hashlib
from pathlib import Path
import re
import subprocess
import zipfile

EXPECTED = '71a99ecf9f4fd741fad8131d224f58edbb7b139ea708936e6d651b80be3f4762'
SIZE = 5589995
BRANCH = 'sandbox/site-rebuild-2026-10-08'
TARGET = Path('public/design-lab/studio-006.html')

def checked_content(source):
    source = Path(source)
    if source.is_symlink():
        raise ValueError('Source symlink refused')
    if source.suffix.lower() == '.zip':
        with zipfile.ZipFile(source) as archive:
            hits = [n for n in archive.namelist() if Path(n).name == 'SUPERAF-Estimator-006.html']
            if len(hits) != 1 or archive.getinfo(hits[0]).file_size != SIZE:
                raise ValueError('Expected one size-matched reviewed HTML in ZIP')
            content = archive.read(hits[0])
    else:
        if source.stat().st_size != SIZE:
            raise ValueError('Unexpected source size')
        content = source.read_bytes()
    if len(content) != SIZE or hashlib.sha256(content).hexdigest() != EXPECTED:
        raise ValueError('Unreviewed artifact; checksum mismatch')
    return content

def git(root, *args):
    return subprocess.check_output(['git', '-C', str(root), *args], text=True).strip()

def stage(source, checkout):
    root = Path(checkout).resolve(strict=True)
    top = Path(git(root, 'rev-parse', '--show-toplevel')).resolve()
    if root != top:
        raise ValueError('Pass the checkout root')
    if git(root, 'branch', '--show-current') != BRANCH:
        raise ValueError('Wrong branch; production and parallel lanes refused')
    remote = git(root, 'remote', 'get-url', 'origin')
    if not re.fullmatch(r'(?:https://github\.com/|git@github\.com:)superafca/superaf-ca(?:\.git)?/?', remote):
        raise ValueError('Wrong repository')
    content = checked_content(source)
    target = root / TARGET
    for part in [target, *target.parents]:
        if part == root:
            break
        if part.is_symlink():
            raise ValueError('Destination symlink refused')
    if target.exists():
        if target.is_file() and target.read_bytes() == content:
            return target
        raise ValueError('Destination differs; reconcile before replacing')
    target.parent.mkdir(parents=True, exist_ok=True)
    # Exclusive creation refuses a concurrent writer; no overwrite or branch update.
    with target.open('xb') as stream:
        stream.write(content)
    if hashlib.sha256(target.read_bytes()).hexdigest() != EXPECTED:
        raise ValueError('Staged file integrity failed')
    return target

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path, help='Reviewed HTML or source ZIP')
    parser.add_argument('--checkout', type=Path, default=Path.cwd())
    args = parser.parse_args()
    print('Staged only:', stage(args.source, args.checkout))
