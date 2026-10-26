---
title: pork lubber
category: osint
---

bro SCREW ardc and 44 net this was such a pain

basically, ARIN WHOIS pointed to a geofeed csv. Using that geofeed.csv, i got:

`curl -s "https://portal.ampr.org/storage/geofeed.csv" | grep "44\.30\."
44.30.0.0/16,US,,,
44.30.0.0/24,CN,,Shijiazhuang,
44.30.1.0/24,GB,,London,
44.30.1.0/27,GB,,London,
44.30.1.32/29,GB,,,
44.30.2.0/23,US,NEW JERSEY,MIDLAND PARK,
44.30.4.0/24,PL,Mazowsze,Ciechanów,
44.30.5.0/24,US,New Jersey,Watchung,
44.30.6.0/24,CA,,,
44.30.7.0/24,US,IN,West Lafayette,
44.30.8.0/24,CN,Shandong,Qingdao,
44.30.9.0/24,US,Ny,Clifton Park,
44.30.10.0/24,US,,Riesel,
44.30.11.0/24,GB,Lincolnshire,Peterborough,
44.30.12.0/24,US,7,Eugene,
44.30.13.0/24,US,,Tualatin,
44.30.14.0/24,TR,,Izmit / Kocaeli,
44.30.15.0/24,CN,Guangdong,Guangzhou,
44.30.16.0/24,US,Latah County, ID,Genesee,
44.30.17.0/24,US,,Hebron,
44.30.18.0/24,TW,,New Taipei City,
44.30.19.0/24,US,WA,Bothell,
44.30.20.0/24,CA,Ontario,Mississauga,
44.30.21.0/24,US,,,
44.30.22.0/24,IN,Tamil Nadu,Madurai,
44.30.23.0/24,US,,Bel Air,
44.30.24.0/24,IE,,Wicklow,
44.30.25.0/24,US,,Concord,
44.30.26.0/24,US,texas,magnolia,
44.30.27.0/24,BE,,Duffel,
44.30.28.0/24,CN,,,
44.30.29.192/27,US,,,
44.30.30.0/24,JP,,Tokyo,
44.30.31.0/24,AU,Western Australia,Perth,
44.30.32.0/24,US,,Mckinney,
44.30.33.0/24,GB,West Midlands,Birmingham,
44.30.34.0/24,NL,Flevoland,Almere,
44.30.35.0/24,CN,Guangdong,Guangzhou,
44.30.36.0/24,CN,Anhui,Chuzhou,
44.30.37.0/24,JP,,,
44.30.38.0/24,US,ca,oakland,
44.30.39.0/24,CA,,Winnipeg,
44.30.40.0/24,US,TN/USA,Knoxville,
44.30.41.0/24,SI,,Ljubljana,
44.30.42.0/24,US,,Iola,
44.30.43.0/24,US,United States,BRENHAM,
44.30.44.0/24,US,,Commerce,
44.30.45.0/24,RO,Mures,Targu Mures,
44.30.46.0/24,CA,,Rosedale,
44.30.47.0/24,DK,,Valby,
44.30.48.0/24,US,NY,New York,
44.30.49.0/24,AT,,,
44.30.50.0/24,DE,,Lehrte,
44.30.51.0/24,US,IL,Zion,
44.30.52.0/24,US,,San Gabriel,
44.30.53.0/24,CA,BC,Agassiz,
44.30.54.0/24,US,,,
44.30.55.0/24,CN,SHANGHAI,SONGJIANG DISTRICT,
44.30.56.0/24,NO,,Stokke,
44.30.57.0/24,US,OR,Dundee,
44.30.58.0/24,US,,Tulsa,
44.30.59.0/24,US,CA,Cupertino,
44.30.60.0/24,US,Missouri,Rolla,
44.30.61.0/24,US,,,
44.30.62.0/24,JP,Tokyo-to,Akishima-shi,
44.30.63.0/24,CN,Beijing,Beijing,
44.30.64.0/24,HR,Zagrebacka,Samobor,
44.30.65.0/24,AU,,,
44.30.66.0/24,US,CA,Auburn,
44.30.67.0/24,US,,,
44.30.68.0/24,ZA,Western Province,Riebeek Kasteel,
44.30.69.0/24,GB,Berkshire,Reading,
44.30.70.0/24,US,Pennsylvania,Pittsburgh,
44.30.70.0/27,US,Pennsylvania,Pittsburgh,
44.30.70.32/28,US,Pennsylvania,Pittsburgh,
44.30.70.48/28,US,Pennsylvania,Pittsburgh,
44.30.71.0/24,US,,Paducah,
44.30.72.0/24,UA,Lvivska,Lviv,
44.30.73.0/24,PL,,Bielsko-Biała,
44.30.74.0/24,PL,małopolska,Giebułtów,
44.30.75.0/24,CN,Zhejiang,Ningbo,
44.30.76.0/24,US,MA,East Bridgewater,
44.30.77.0/24,ZA,,Sandton,
44.30.78.0/24,US,,Oakland,
44.30.79.0/24,FR,Bretagne,Quimper,
44.30.80.0/24,US,,,
44.30.81.0/24,US,California,Riverside,
44.30.82.0/24,US,,Studio City,
44.30.83.0/24,IE,Ireland,Dublin,
44.30.84.0/24,BR,Sao Paulo,Campinas,
44.30.85.0/24,SI,,Izola,
44.30.86.0/24,DE,Hamburg,Hamburg,
44.30.87.0/24,IT,Como,Rovellasca,
44.30.88.0/24,DE,Baden-Württemberg,Karlsruhe,
44.30.89.0/24,JP,Tokyo-to,Taito-ku,
44.30.90.0/24,DK,,Horsens,
44.30.91.0/24,NZ,,Lower Hutt,
44.30.92.0/24,US,,Newport Beach,
44.30.93.0/24,US,,Rockwall,
44.30.94.0/24,AT,Wien,Wien,
44.30.95.0/24,GR,,Glyfada,
44.30.96.0/24,GB,,SUTTON-IN-ASHFIELD,
44.30.97.0/24,US,,San Mateo,
44.30.98.0/24,US,WV/Kanawah,South Charleston,
44.30.99.0/24,SI,,Radomlje,
44.30.100.0/24,US,,Pasadena,
44.30.101.0/24,US,,Elizabeth East,
44.30.102.0/24,US,PA,Athens,
44.30.103.0/24,GR,Rodopi,Komotini,
44.30.104.0/24,FI,,Björkboda,
44.30.105.0/24,US,Ohio,Ottawa,
44.30.106.0/23,US,,Ohio,
44.30.108.0/24,US,TX,Fate,
44.30.109.0/24,US,Georgia,Alpharetta,
44.30.110.0/24,CA,Ontario,Peterborough,
44.30.111.0/24,US,,Loveland,
44.30.112.0/24,US,New Mexico,Socorro,
44.30.113.0/24,GB,,Edinburgh,
44.30.114.0/24,DE,Sachsen,Freiberg,
44.30.115.0/24,DE,Niedersachsen,Braunschweig,
44.30.116.0/24,TW,Taiwan,New Taipei City,
44.30.117.0/24,GB,,London,
44.30.118.0/24,BE,,,
44.30.119.0/24,CA,BC,Victora,
44.30.120.0/24,GB,,London,
44.30.121.0/24,CN,China, Shanxi,Taiyuan,
44.30.122.0/24,US,New York,Rochester,
44.30.123.0/24,TR,,Istanbul,
44.30.124.0/24,GB,Tyne and Wear,Houghton le Spring,
44.30.125.0/24,AU,Queensland,Eatons Hill,
`
which basically just told me that 44.30.122.0/24 was the subnet. I tried whois.arin.net, but that didn't give me a callsign to look up in FCC or "crown's reckonin"

then, I tried RADB, which tells us who announces the subnet. 

`└─$ whois -h whois.radb.net 44.30.122.0/24
route:          44.0.0.0/9
origin:         AS7377
descr:          Amateur Radio Digital Communications
                5663 Balboa Ave Suite 432
                San Diego, CA 92111-2705 USA
                https://www.ardc.net
admin-c:        LEWIS1112
admin-c:        SMITH5996
tech-c:         LEWIS1112
tech-c:         SMITH5996
remarks:        Abuse reports to: abuse@ardc.net
notify:         hostmaster@ardc.net
mnt-by:         MAINT-ARDC
changed:        chris@ardc.net 20241104 # 10:53 GMT
source:         RADB
last-modified:  2024-11-04T10:53:31Z
rpki-ov-state:  not_found # No ROAs found, or RPKI validation not enabled for source

route:          44.30.122.0/24
origin:         AS54054
descr:          KQ4LGT
admin-c:        BURWE9
tech-c:         LEWIS1112
mnt-by:         MAINT-ARDC
notify:         noc@ardc.net
changed:        noc@ardc.net 20260313 # 16:24 GMT
source:         RADB
last-modified:  2026-03-13T16:24:49Z
rpki-ov-state:  not_found # No ROAs found, or RPKI validation not enabled for source
`

decsr sure looks like a callsign to me.

looked it up (hi stella) to find virginia
