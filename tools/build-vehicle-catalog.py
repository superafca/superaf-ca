"""Compile explicit Canadian source rows plus scoped OEM trim evidence.
No network, credentials, customer data, year-range inference, or price approvals.
"""
from pathlib import Path
import json,re,argparse
def build_catalog(raw,legacy):
 norm=lambda x:re.sub(r'[^a-z0-9]','',x.lower())
 make_names={norm(m['name']):m['name'] for m in legacy}
 models={norm(m['name']): sorted([x['name'] for x in m['models']],key=len,reverse=True) for m in legacy}
 # Family grouping never extends existence across years: each menu requires a real source row.
 def family(make, name):
  for m in models.get(norm(make),[]):
   pattern=r'^'+re.escape(m).replace(r'\-',r'[- ]?')+r'(?=$|[ (/-])'
   if re.search(pattern,name,re.I):return m
  return name
 by={}
 for year,make,model,sources in raw['records']:
  make=make_names.get(norm(make),make)
  model_family=family(make,model)
  key=(year,make,model_family)
  if key not in by:by[key]={'variants':set(),'sources':set()}
  by[key]['variants'].add(model);by[key]['sources'].update(sources)
 # Exact model-year OEM trim lists: do not copy into adjacent years.
 trim_sources={
  'honda-crv-2026':'https://hondanews.ca/en-CA/releases/release-04150531cb93adf566aca863300f8f08-rugged-electrified-and-refreshed-best-selling-honda-cr-v-hybrid-gains-new-trailsport-hybrid-trim-and-more-standard-tech',
  'mazda-mx5-2026':'https://en.media.mazda.ca/2026-01-27-2026-Mazda-MX-5-Pricing-and-Packaging',
  'toyota-rav4-hev-2026':'https://media.toyota.ca/en/releases/2026/the-canadian-built-rav4-is-all-new-for-2026--and-offered-at-sugg.html',
  'toyota-rav4-phev-2026':'https://media.toyota.ca/en/releases/2025/three---two---one--toyota-debuts-amazing-all-new-rav4.html',
  'hyundai-tucson-announced':'https://www.hyundaicanada.com/en/coming-soon/tucson'
 }
 trims={
  (2026,'Honda','CR-V'):{'source':'honda-crv-2026','complete':True,'names':['LX (2WD)','LX (AWD)','Sport (AWD)','Sport Hybrid (AWD)','TrailSport Hybrid (AWD)','EX-L Hybrid (AWD)','Touring Hybrid (AWD)']},
  (2026,'Mazda','MX-5'):{'source':'mazda-mx5-2026','complete':True,'names':['GS — Soft top (manual)','GS-P — Soft top','GS-P Sport Package — Soft top (manual)','GT — Soft top','GS-P — RF','GS-P Sport Package — RF (manual)','GT — RF','GT Grand Sport Package — RF (manual)']},
  (2026,'Toyota','RAV4'):{'source':'toyota-rav4-hev-2026','additionalSources':['toyota-rav4-phev-2026'],'complete':True,'names':['Hybrid LE AWD','Hybrid XLE AWD','Hybrid XLE Premium AWD','Hybrid Woodland AWD','Hybrid Limited AWD','Hybrid XSE AWD','Hybrid XSE Technology AWD','Plug-in Hybrid SE AWD','Plug-in Hybrid XSE AWD','Plug-in Hybrid XSE Technology AWD','Plug-in Hybrid GR SPORT AWD']}
 }
 # Preserve the owner-requested future model separately, never imply released trim availability.
 by[(2027,'Hyundai','Tucson')]={'variants':{'Tucson Hybrid'},'sources':{'hyundai-tucson-announced'},'status':'announced','note':'Hybrid announced; Canadian trim list pending. Not yet a released Canadian retail trim catalogue.'}
 rows=[]
 for key,entry in sorted(by.items()):
  year,make,model=key;t=trims.get(key)
  rows.append({'year':year,'make':make,'model':model,'variants':sorted(entry['variants']),'sourceIds':sorted(entry['sources']),
   'status':entry.get('status','catalogued'),'trims':[] if not t else t['names'],'trimSource':None if not t else t['source'],
   'trimAdditionalSources':[] if not t else t.get('additionalSources',[]),'trimComplete':False if not t else t['complete']})
 # Compact records retain explicit model-year associations with no guessed year ranges.
 data={'schema':1,'market':'CA','version':'ca-selector-005.3-2026-10-09','minYear':2000,'maxYear':2027,
  'sources':raw['sources']+[{'id':k,'url':v,'kind':'manufacturer-Canada'} for k,v in trim_sources.items()],
  'attribution':raw['attribution'],'licence':raw['licence'],'retailTrimCoverage':'partial; OEM trim lists only where explicitly sourced',
  'fields':['year','make','model','variants','sourceIds','status','trims','trimSource','trimAdditionalSources','trimComplete'],
  'rows':[[r[k] for k in ['year','make','model','variants','sourceIds','status','trims','trimSource','trimAdditionalSources','trimComplete']] for r in rows]}
 return data

def render_catalog(data):
 return ('/* Canadian model-year evidence; not universal retail-trim or price verification. */\n'
  + 'globalThis.SUPERAF_CA_VEHICLES = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n').encode('utf-8')

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('source',type=Path);p.add_argument('legacy',type=Path);p.add_argument('output',type=Path);a=p.parse_args()
 result=render_catalog(build_catalog(json.loads(a.source.read_text()),json.loads(a.legacy.read_text())))
 a.output.write_bytes(result)
if __name__=='__main__':main()
