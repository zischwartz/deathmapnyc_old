files = !find dada.pink/nyc-crime-map-data/ -iname "*.csv"
import pandas
pandas.concat?
df = pandas.concat([pandas.read_csv(f) for f in files])
df
df = df.dropna()
df
df["CR"=="MURDER"]
df.str
df.CR
df.CR.str.contains("MURDER")
m = df[df.CR.str.contains("MURDER")]
m
m.to_json()
m.to_json(orient="records")
m.to_json("murders.json", orient="records")