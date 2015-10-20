
df = pandas.read_csv("NYPD_Motor_Vehicle_Collisions.csv")
veh = pd.concat([df.DATE, df.LATITUDE, df.LONGITUDE, df["NUMBER OF PERSONS KILLED"], df.DATE], axis=1)