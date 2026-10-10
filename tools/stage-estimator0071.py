#!/usr/bin/env python3
"""Patch/stage only the reviewed Calgary CR-V update; no network, push or route changes."""
import argparse,hashlib,json,os,re,subprocess,zipfile
from pathlib import Path
SOURCE_SHA='be0008443407734aa468a1bade44ef07f04e5926eb55a85413d62e11a328cbe8'
SOURCE_SIZE=5215393
EXPECTED='3775b9c6361be9b1d07937290f50b790498bb21d760c2a71204b3d0c26d057ae'
SIZE=5077130
BRANCH='sandbox/site-rebuild-2026-10-08'
TARGET=Path('public/design-lab/studio-007-1.html')
CRV_TRACE={'hood': 'M249 458 Q257 435 300 416 C348 402 428 395 508 389 L607 382 L916 379 Q913 396 904 403 C835 412 755 423 705 446 L557 464 L528 471 L276 470 Q259 470 249 458Z', 'fender': 'M705 446 C755 423 835 412 904 403 Q913 396 916 379 L954 377 L979 395 Q995 448 1000 487 L1009 672 L1001 675 C1001 607 985 546 960 515 Q940 487 906 487 C870 485 839 510 817 544 L817 509 L778 479 Q794 463 799 433Z', 'bumper': 'M232 495 L237 499 L244 518 L254 496 L260 489 L518 488 L539 507 L548 524 Q687 509 747 491 L778 479 L817 509 L817 544 Q791 591 777 641 L772 687 L748 687 L733 671 L713 603 Q708 586 698 582 L687 583 L689 604 L700 655 Q704 662 696 664 L580 671 L555 648 Q548 638 529 638 L226 631 Q210 631 206 648 L200 654 L195 642 L191 600 L192 575 L198 566 L207 568 L197 554 L197 541 L207 514 Q211 504 232 495Z M262 496 L516 494 L540 518 L529 555 L519 578 Q513 593 505 598 L269 598 Q259 598 251 585 L241 549 L239 525 L249 512Z', 'mirrorNear': 'M1028 369 Q1035 351 1054 344 Q1071 341 1087 345 L1116 351 Q1130 356 1133 375 L1132 379 L1098 382 L1089 386 L1027 388Z', 'mirrorFar': 'M510 375 Q516 369 526 368 L518 379 L510 380Z', 'baseBridge': '', 'pillars': 'M930 377 Q942 373 950 359 L1028 256 Q1046 239 1064 232 L1080 225 L1086 219 Q1041 216 1027 231 L947 345 L920 377Z', 'roof': 'M667 266 Q700 237 764 222 C845 209 944 207 1049 207 L1034 219 L1028 230 Q918 219 809 229 L763 233 Q707 242 683 259Z', 'lights': 'M530 479 L794 435 Q789 458 774 480 Q722 504 549 522 L545 508Z M236 464 L250 475 L248 487 L237 498 L233 490Z M682 672 L699 671 L700 682 L681 683Z', 'frontGlass': 'M1009 351 Q1053 276 1091 245 Q1107 238 1149 236 L1173 385 L1131 390 L1134 376 Q1133 360 1118 351 L1087 343 Q1068 336 1050 344 Q1034 350 1026 370 L1025 396 L1015 397Z', 'frontQuarter': 'M999 369 L1008 397 L984 402Z', 'rearGlass': 'M1194 240 L1289 254 Q1320 307 1334 376 L1213 387Z', 'rearQuarter': 'M1310 263 L1356 283 Q1379 302 1401 327 Q1405 339 1394 352 Q1378 368 1345 375 Q1334 313 1310 263Z', 'windshield': 'M527 379 L663 274 Q718 240 776 236 C871 222 963 226 1029 233 L949 361 Q940 372 927 375 L741 383 L592 383Z', 'visor': 'M647 286 L663 274 Q718 240 776 236 C871 222 963 226 1029 233 L1012 255 Q870 241 779 253 Q725 253 679 285 L663 296Z', 'doorFront': 'M985 409 L1191 399 L1224 459 L1226 574 L1224 620 L1140 630 L1073 639 L1043 647 L1026 661 L1012 664 L1005 485Z M1181 424 Q1176 421 1173 426 L1174 434 L1170 435 L1172 444 L1217 440 L1222 435 L1217 429 L1208 429 L1207 420 Q1191 415 1181 424Z', 'doorRear': 'M1200 399 L1379 384 L1411 397 L1422 453 Q1363 481 1345 565 L1339 628 L1316 630 L1303 619 L1229 620 L1230 574 L1228 459Z M1356 413 Q1362 404 1375 410 L1378 415 L1392 414 L1398 420 L1393 425 L1358 429 L1351 424 L1353 419Z', 'rearQuarterPaint': 'M1390 357 L1420 337 L1441 365 L1479 384 L1454 387 L1457 400 L1485 409 L1487 434 L1502 438 L1503 529 L1512 593 L1511 606 L1501 610 Q1500 538 1478 509 Q1463 487 1438 483 Q1418 479 1398 491 L1428 454 L1417 397 L1390 378Z', 'views': {'front': [175, 357, 850, 392], 'side': [973, 210, 451, 207], 'windshield': [510, 215, 537, 178], 'finish': [241, 371, 697, 112]}, 'points': {'pillars': [1001, 291], 'roof': [864, 219], 'lights': [660, 485], 'cups': [1192, 441], 'doors': [1161, 598], 'rockers': [1176, 656], 'grille': [394, 543], 'flares': [910, 495]}, 'loweredSideGlass': False}

def once(text,old,new):
    if text.count(old)!=1:
        raise ValueError('Source structure differs; refusing to guess a patch')
    return text.replace(old,new,1)

def patch_bytes(data):
    digest=hashlib.sha256(data).hexdigest()
    if len(data)==SIZE and digest==EXPECTED: return data
    if len(data)!=SOURCE_SIZE or digest!=SOURCE_SHA:
        raise ValueError('Input is not the reviewed 007 or 007.1 artifact')
    text=data.decode('utf-8')
    m=re.search(r'const traces=(.*?);\nconst records=',text,re.S)
    if not m: raise ValueError('Mask registry not found')
    traces=json.loads(m.group(1));traces['crv']=CRV_TRACE
    text=text[:m.start(1)]+json.dumps(traces,separators=(',',':'))+text[m.end(1):]
    replacements=[
      ('const records={crv:root.Superaf005Masks};\nif(!records.crv)', 'const records={};\nif(!root.Superaf005Masks)'),
      ('The owner-approved CR-V renderer is preserved as its own source/mask pair.','The Calgary CR-V now has its own registration. Legacy masks remain only as archived metadata.'),
      ("version:'007-seven-service-views'", "version:'007.1-calgary-crv'"),
      ("let G=globalThis.Superaf005Masks,visualId='crv',visualOrigin='default',visualSequence=0,visualLoaded=true;", "let G=globalThis.SuperafFleet?.get('crv'),visualId='crv',visualOrigin='default',visualSequence=0,visualLoaded=false;"),
      ("const imageSrc=()=>visualId==='crv'?(globalThis.SUPERAF_005_ASSETS?.master||G.meta.master.src):globalThis.SuperafGarage.asset(visualId);", "const imageSrc=()=>globalThis.SuperafGarage.asset(visualId);"),
      ("detail||(visualId==='crv'?[0,90,1672,785]:[0,100,1672,800])", "detail||[0,100,1672,800]"),
      ("if(id!==visualId){visualId=id;G=fleet.get(id);failed=false;visualLoaded=id==='crv';", "if(id!==visualId||(!visualLoaded&&!failed)){visualId=id;G=fleet.get(id);failed=false;visualLoaded=false;"),
      (" render();\n Object.defineProperty(globalThis,'SUPERAF_REVIEW_007'", " setVisual('crv','default',false);\n render();\n Object.defineProperty(globalThis,'SUPERAF_REVIEW_007'"),
      ('Garage 007</title>','Garage 007.1</title>'),
      ('<b>007</b>','<b>007.1</b>'),
      ('DESIGN LAB 007 ·','DESIGN LAB 007.1 ·')
    ]
    for old,new in replacements: text=once(text,old,new)
    # Remove the unused white-background car payload, not any active source image.
    text,n=re.subn(r'globalThis\.SUPERAF_005_ASSETS=\{.*?\};globalThis\.SUPERAF_GARAGE_ASSETS=', 'globalThis.SUPERAF_005_ASSETS={};globalThis.SUPERAF_GARAGE_ASSETS=',text,count=1)
    if n!=1: raise ValueError('Legacy image payload boundary missing')
    result=text.encode('utf-8')
    if len(result)!=SIZE or hashlib.sha256(result).hexdigest()!=EXPECTED:
        raise ValueError('Patched output differs from the tested review artifact')
    return result

def payload(source):
    p=Path(source).expanduser()
    if not p.is_file() or p.is_symlink():raise ValueError('Input must be a regular non-symlink file')
    if zipfile.is_zipfile(p):
        with zipfile.ZipFile(p) as z:
            found=[v for v in z.infolist() if v.filename in ['SUPERAF-Estimator-007.1.html','SUPERAF-Estimator-007.html']]
            if len(found)!=1 or found[0].file_size not in (SIZE,SOURCE_SIZE):
                raise ValueError('ZIP must have exactly one reviewed 007/007.1 root HTML member')
            data=z.read(found[0])
    else:
        if p.stat().st_size not in (SIZE,SOURCE_SIZE): raise ValueError('Input size mismatch')
        data=p.read_bytes()
    return patch_bytes(data)

def git(*args):return subprocess.check_output(['git',*args],text=True).strip()

def stage(source):
    data=payload(source)
    root=Path(git('rev-parse','--show-toplevel')).resolve()
    if Path.cwd().resolve()!=root:raise ValueError('Run from checkout root')
    if git('branch','--show-current')!=BRANCH:raise ValueError('Wrong branch')
    if not re.fullmatch(r'(?:https://github\.com/|git@github\.com:)superafca/superaf-ca(?:\.git)?/?',git('remote','get-url','origin')):
        raise ValueError('Wrong repository origin')
    head=git('rev-parse','HEAD');dest=root/TARGET
    for parent in [root/'public',dest.parent,dest]:
        if parent.is_symlink():raise ValueError('Refusing symlink destination/parent')
    if dest.exists():
        if not dest.is_file() or dest.read_bytes()!=data:raise ValueError('Target differs; reconcile rather than overwrite')
        print('Already staged '+str(TARGET));return
    dest.parent.mkdir(parents=True,exist_ok=True)
    if git('branch','--show-current')!=BRANCH or git('rev-parse','HEAD')!=head:raise ValueError('Checkout advanced')
    fd=os.open(dest,os.O_WRONLY|os.O_CREAT|os.O_EXCL|getattr(os,'O_NOFOLLOW',0),0o644)
    try:
        with os.fdopen(fd,'wb') as f:
            f.write(data);f.flush();os.fsync(f.fileno())
    except BaseException:
        dest.unlink(missing_ok=True);raise
    print('Staged '+str(TARGET)+' SHA256 '+EXPECTED)
    print('No commit, push, production route or price change performed.')

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('source');args=parser.parse_args()
    try:stage(args.source)
    except (ValueError,OSError,subprocess.CalledProcessError,zipfile.BadZipFile) as e:parser.exit(1,str(e)+'\n')
