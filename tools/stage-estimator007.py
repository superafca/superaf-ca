#!/usr/bin/env python3
"""Stage one checksum-verified sandbox HTML. No network, commits, pushes or route changes."""
import argparse
import hashlib
import os
from pathlib import Path
import re
import subprocess
import zipfile

EXPECTED = 'be0008443407734aa468a1bade44ef07f04e5926eb55a85413d62e11a328cbe8'
SIZE = 5215393
BRANCH = 'sandbox/site-rebuild-2026-10-08'
TARGET = Path('public/design-lab/studio-007.html')
MEMBER = 'SUPERAF-Estimator-007.html'

def git(*args):
    return subprocess.check_output(['git', *args], text=True).strip()

def payload(source):
    p = Path(source).expanduser()
    if not p.is_file():
        raise ValueError('Input file is missing')
    if zipfile.is_zipfile(p):
        with zipfile.ZipFile(p) as z:
            found = [v for v in z.infolist() if v.filename == MEMBER]
            if len(found) != 1 or found[0].file_size != SIZE:
                raise ValueError('ZIP must contain one exact reviewed HTML member')
            data = z.read(found[0])
    else:
        if p.stat().st_size != SIZE:
            raise ValueError('Incorrect input size')
        data = p.read_bytes()
    if len(data) != SIZE or hashlib.sha256(data).hexdigest() != EXPECTED:
        raise ValueError('Review artifact checksum mismatch')
    return data

def stage(source):
    data = payload(source)
    root = Path(git('rev-parse', '--show-toplevel')).resolve()
    if Path.cwd().resolve() != root:
        raise ValueError('Run from the checkout root')
    if git('branch', '--show-current') != BRANCH:
        raise ValueError('Wrong branch; production is not a staging target')
    remote = git('remote', 'get-url', 'origin')
    if not re.fullmatch(r'(?:https://github\.com/|git@github\.com:)superafca/superaf-ca(?:\.git)?/?', remote):
        raise ValueError('Wrong repository origin')
    head = git('rev-parse', 'HEAD')
    dest = root / TARGET
    for parent in [root / 'public', dest.parent, dest]:
        if parent.is_symlink():
            raise ValueError('Refusing a symlink destination or parent')
    if dest.exists():
        if not dest.is_file() or dest.read_bytes() != data:
            raise ValueError('Existing target differs; reconcile rather than overwrite')
        print('Already staged: ' + str(TARGET))
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    if git('branch', '--show-current') != BRANCH or git('rev-parse', 'HEAD') != head:
        raise ValueError('Checkout changed during staging')
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL | getattr(os, 'O_NOFOLLOW', 0)
    fd = os.open(dest, flags, 0o644)
    try:
        with os.fdopen(fd, 'wb') as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
    except BaseException:
        dest.unlink(missing_ok=True)
        raise
    print('Staged ' + str(TARGET) + ' SHA256 ' + EXPECTED)
    print('Review the diff; commit only this file. No push or routing change performed.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', help='Reviewed 007 HTML or source ZIP')
    args = parser.parse_args()
    try:
        stage(args.source)
    except (ValueError, OSError, subprocess.CalledProcessError, zipfile.BadZipFile) as e:
        parser.exit(1, str(e) + '\n')
