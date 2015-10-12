just death?
https://data.cityofnewyork.us/Public-Safety/NYPD-Motor-Vehicle-Collisions/h9gi-nx95

persons killed and persons injured:
curl https://data.cityofnewyork.us/api/views/h9gi-nx95/rows.json?accessType=DOWNLOAD > rows.json


lets use ipython but not deal with deps
boot2docker
docker run -it ipython/scipystack /bin/bash

docker run -it -v $PWD:/root ipython/scipystack /bin/bash


just deaths
https://data.cityofnewyork.us/Public-Safety/motor_related_deaths/9tve-dvm5






# CRIME RELATED

 sudo pip install nyc-crime-map

and then run it like so. ::

    nyc-crime-map


from within the notebook, this way we can get current data


Or just grab all his data

wget -r --no-parent -A '*71.csv' http://dada.pink/nyc-crime-map-data/


# within ipython
files = !find dada.pink/nyc-crime-map-data/ -iname "*.csv"

http://stackoverflow.com/questions/21149920/pandas-import-multiple-csv-files-into-dataframe-using-a-loop-and-hierarchical-i

d = pandas.concat([pandas.read_csv(f) for f in files])



# shape of ny
invert
https://github.com/ebrelsford/Leaflet.snogylop
but wait
http://www.mapshaper.org/