/* Review snapshot of repository pricing. No final-price approvals. */
(() => {
const data = {"schema":1,"source":{"repository":"superafca/superaf-ca","ratePath":"src/lib/site.ts","rateBlob":"23548442a5474a8f3e86862bdf9d5e9368eea8d3","vehiclePath":"src/lib/vehicles.ts","vehicleBlob":"693e3e27a8ca47aa975a541b3cc089eae02d02ea"},"currency":"CAD","taxMode":"not-calculated","verifiedPriceRecords":[],"filmBases":{"pp5":{"easy":{"front":849,"max":2799},"medium":{"front":1099,"max":3499},"hard":{"front":1549,"max":3999}},"pp10":{"easy":{"front":999,"max":3299},"medium":{"front":1249,"max":4299},"hard":{"front":1699,"max":4699}}},"sizeBumps":{"sedan":{"front":0,"max":0},"mid":{"front":200,"max":800},"truck":{"front":250,"max":1400}},"colourUpcharge":500,"parts":[{"id":"cups","name":"Door cups","price":99},{"id":"pillars","name":"A-pillars","price":149},{"id":"roof","name":"Front of roof","price":149},{"id":"flares","name":"Fender flares","price":249},{"id":"grille","name":"Grille","price":149},{"id":"lights","name":"Headlights / fog","price":199},{"id":"rockers","name":"Rockers","price":349},{"id":"doors","name":"Lower doors","price":349}],"tintFront":{"2":{"carbon":179,"ceramic":239},"4":{"carbon":259,"ceramic":339}},"tintRear":{"3":{"carbon":200,"ceramic":270},"5":{"carbon":250,"ceramic":370},"7":{"carbon":320,"ceramic":460}},"tintWindshield":{"carbon":279,"ceramic":379},"tintVisor":{"carbon":89,"ceramic":109},"glass":{"clear":269,"tinted":269}};
const rows = `[Acura]
ADX|easy|sedan|2025
Integra|easy|sedan|2023
MDX|medium|mid
RDX|easy|sedan
TLX|medium|sedan
[Audi]
A3|easy|sedan
A4|medium|sedan
A5|medium|sedan
A6|medium|sedan
e-tron / Q8 e-tron|medium|mid|2019
Q3|easy|sedan|2019
Q5|medium|mid
Q7|medium|mid
Q8|medium|mid|2019
[BMW]
2 Series|medium|sedan
3 Series|medium|sedan
4 Series|medium|sedan
5 Series|medium|sedan
X1|easy|sedan
X2|easy|sedan|2018
X3|medium|mid
X4|medium|mid
X5|medium|mid
X6|medium|mid
X7|medium|truck|2019
i4|medium|sedan|2022
iX|medium|mid|2022
[Buick]
Enclave|medium|mid
Encore / Encore GX|easy|sedan
Envision|easy|sedan
Envista|easy|sedan|2024
[Cadillac]
CT4|medium|sedan|2020
CT5|medium|sedan|2020
Escalade|medium|truck
Lyriq|medium|mid|2023
XT4|easy|sedan|2019
XT5|medium|mid
XT6|medium|mid|2020
[Chevrolet]
Blazer|medium|mid|2019
Bolt EUV / EV|easy|sedan
Camaro|hard|sedan|2017|2024
Colorado|medium|mid
Corvette|hard|sedan
Equinox|easy|sedan
Malibu|easy|sedan|2017|2025
Silverado 1500|medium|truck
Suburban|medium|truck
Tahoe|medium|truck
Traverse|easy|mid
Trax|easy|sedan
[Chrysler]
Pacifica|easy|mid
[Dodge]
Challenger|medium|sedan|2017|2023
Charger|medium|sedan
Durango|medium|mid
Hornet|easy|sedan|2023
[Ford]
Bronco|hard|mid|2021
Bronco Sport|medium|sedan|2021
Edge|medium|mid|2017|2024
Escape|easy|sedan
Expedition|medium|truck
Explorer|medium|mid
F-150|medium|truck
F-250 / Super Duty|medium|truck
Maverick|easy|sedan|2022
Mustang|medium|sedan
Mustang Mach-E|medium|sedan|2021
Ranger|medium|mid|2019
[Genesis]
G70|medium|sedan|2019
G80|medium|sedan
GV70|medium|mid|2022
GV80|medium|mid|2021
[GMC]
Acadia|easy|mid
Canyon|medium|mid
Sierra 1500|medium|truck
Terrain|easy|sedan
Yukon|medium|truck
[Honda]
Accord|easy|sedan
Civic|easy|sedan
CR-V|easy|sedan
HR-V|easy|sedan
Odyssey|easy|mid
Passport|medium|mid|2019
Pilot|medium|mid
Prologue|medium|mid|2024
Ridgeline|medium|mid
[Hyundai]
Elantra|easy|sedan
Ioniq 5|medium|sedan|2022
Ioniq 6|medium|sedan|2023
Kona|easy|sedan|2018
Palisade|medium|mid|2020
Santa Cruz|medium|sedan|2022
Santa Fe|medium|mid
Sonata|easy|sedan
Tucson|easy|sedan
Venue|easy|sedan|2020
[Infiniti]
Q50|medium|sedan|2017|2024
QX50|easy|sedan
QX55|medium|sedan|2022
QX60|medium|mid
QX80|medium|truck
[Jaguar]
E-Pace|easy|sedan|2018|2024
F-Pace|medium|mid|2017|2024
F-Type|hard|sedan|2017|2024
I-Pace|medium|sedan|2019|2024
[Jeep]
Cherokee|easy|sedan|2017|2024
Compass|easy|sedan
Gladiator|hard|mid|2020
Grand Cherokee|medium|mid
Grand Wagoneer|medium|truck|2022
Renegade|easy|sedan|2017|2024
Wagoneer|medium|truck|2022
Wrangler|hard|mid
[Kia]
Carnival|medium|mid|2022
EV6|medium|sedan|2022
EV9|medium|mid|2024
Forte|easy|sedan
K5|easy|sedan|2021
Niro|easy|sedan
Seltos|easy|sedan
Sorento|medium|mid
Soul|easy|sedan
Sportage|easy|sedan
Telluride|medium|mid|2020
[Land Rover]
Defender|hard|mid|2020
Discovery|medium|mid
Discovery Sport|medium|sedan
Range Rover|hard|truck
Range Rover Evoque|medium|sedan
Range Rover Sport|hard|mid
Range Rover Velar|medium|mid|2018
[Lexus]
ES|easy|sedan
GX|medium|mid
IS|medium|sedan
LX|medium|truck
NX|easy|sedan
RX|easy|mid
TX|medium|mid|2024
UX|easy|sedan|2019
[Lincoln]
Aviator|medium|mid|2020
Corsair|easy|sedan|2020
Nautilus|medium|mid|2019
Navigator|medium|truck
[Mazda]
CX-30|easy|sedan|2020
CX-5|easy|sedan
CX-50|medium|sedan|2023
CX-70|medium|mid|2025
CX-9|medium|mid|2017|2023
CX-90|medium|mid|2024
Mazda3|easy|sedan
Mazda6|easy|sedan|2017|2021
MX-5|hard|sedan
[Mercedes-Benz]
A-Class|easy|sedan|2019
C-Class|medium|sedan
CLA|easy|sedan
E-Class|medium|sedan
EQE|medium|sedan|2023
EQS|medium|sedan|2022
G-Class|hard|truck
GLA|easy|sedan
GLB|easy|sedan|2020
GLC|medium|mid
GLE|medium|mid
GLS|medium|truck
S-Class|medium|sedan
[MINI]
Clubman|medium|sedan|2017|2024
Cooper|medium|sedan
Countryman|easy|sedan
[Mitsubishi]
Eclipse Cross|easy|sedan|2018
Outlander|easy|sedan
RVR / Outlander Sport|easy|sedan
[Nissan]
Altima|easy|sedan
Ariya|easy|sedan|2023
Armada|medium|truck
Frontier|medium|mid
Kicks|easy|sedan|2018
Leaf|easy|sedan
Murano|easy|mid
Pathfinder|medium|mid
Rogue|easy|sedan
Sentra|easy|sedan
[Porsche]
718 Boxster / Cayman|hard|sedan
911|hard|sedan
Cayenne|medium|mid
Macan|medium|sedan
Panamera|medium|sedan
Taycan|medium|sedan|2020
[RAM]
1500|medium|truck
2500 / 3500|medium|truck
[Subaru]
Ascent|medium|mid|2019
BRZ|medium|sedan
Crosstrek|easy|sedan
Forester|easy|sedan
Impreza|easy|sedan
Legacy|easy|sedan
Outback|easy|sedan
Solterra|easy|sedan|2023
WRX|medium|sedan
[Tesla]
Cybertruck|hard|truck|2024
Model 3|easy|sedan|2018
Model S|easy|sedan
Model X|easy|mid
Model Y|easy|mid|2020
[Toyota]
4Runner|medium|mid
bZ4X|easy|sedan|2023
Camry|easy|sedan
Corolla|easy|sedan
Corolla Cross|easy|sedan|2022
Crown|medium|sedan|2023
GR Corolla|medium|sedan|2023
GR86|medium|sedan|2022
Grand Highlander|medium|mid|2024
Highlander|medium|mid
Land Cruiser|medium|mid|2024
Prius|easy|sedan
RAV4|easy|sedan
Sequoia|medium|truck|2023
Sienna|easy|mid
Supra|hard|sedan|2020
Tacoma|medium|mid
Tundra|medium|truck
Venza|easy|sedan|2021
[Volkswagen]
Atlas|medium|mid|2018
Golf / GTI|easy|sedan
ID.4|easy|sedan|2021
ID. Buzz|medium|mid|2024
Jetta|easy|sedan
Multivan|medium|mid|2022
Taos|easy|sedan|2022
Tiguan|easy|sedan
[Volvo]
C40|easy|sedan|2022
S60|easy|sedan
V60|easy|sedan|2019
XC40|easy|sedan|2019
XC60|medium|mid
XC90|medium|mid`;
data.vehicles=[];
let make;
for(const row of rows.split('\n')) {
 if(row.startsWith('[')){make={name:row.slice(1,-1),models:[]};data.vehicles.push(make);}
 else {const [name,rank,band,from='2017',to='2026']=row.split('|');make.models.push({name,from:Number(from),to:Number(to),rank,band});}
}
globalThis.SUPERAF_PRICE_DATA=data;
})();
