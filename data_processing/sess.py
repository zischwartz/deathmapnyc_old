  import pandas as pd
import numpy as np
pd.read_csv
pd.read_csv?
df = pd.read_csv("NYPD_Motor_Vehicle_Collisions.csv")
df
len(df)
df.info
df.head()
df[1]
df[1,1]
df[1...]
df[1:2]
df[1:24]
df[1:2]
df[1:3]
df["DATE"]
df[1:3]
df["LATITUDE","LONGITUDE"]
df
df[1:3]
df["LATITUDE","LONGITUDE"]
df["LATITUDE"]["LONGITUDE"]
df["LATITUDE"]
df["LATITUDE"].head()
df[["LATITUDE","LONGITUDE"]]
df[["LATITUDE","LONGITUDE"]]
df[["LATITUDE","LONGITUDE"]].dropna()
df_no_na = df[["LATITUDE","LONGITUDE"]].dropna()
df_no_na = df[["LATITUDE","LONGITUDE","NUMBER OF PERSONS KILLED"]].dropna()
df_no_na
df_no_na.sort?
df_no_na.sort(["NUMBER OF PERSONS KILLED"])
df_no_na
df_no_na.to_json("motor_related_deaths.json")
%history
df_no_na.to_json()
df_no_na.to_json(orient="records")
df_no_na.to_json(orient="split")
df_no_na.to_json(orient="records")
df_no_na
df_no_na["NUMBER OF PERSONS KILLED"]
df_no_na["k"] = df_no_na["NUMBER OF PERSONS KILLED"]
df_no_na
df.drop("NUMBER OF PERSONS KILLED")
df.drop(["NUMBER OF PERSONS KILLED"])
df.columns
df.columns = ["lat", "lon", "k"]
df_no_na.columns = ["lat", "lon", "k"]
df
df.drop("NUMBER OF PERSONS KILLED", 1)
df_no_na.drop(0, 1)
df_no_na
df.columns
df_no_na.columns
df
df_no_na.columns
df_no_na
df_no_na.drop("NUMBER OF PERSONS KILLED", 0)
df_no_na.drop("NUMBER OF PERSONS KILLED", 1)
df
df_no_na
df = df_no_na.drop("NUMBER OF PERSONS KILLED", 1)
df.columns
df.columns = ["lat", "long", "k"]
df.to_json(orient="records")
df.to_json()
df.to_json(orient="records")
df.to_json("motor_related_deaths.json"orient="records")
df.to_json("motor_related_deaths.json", orient="records")
q