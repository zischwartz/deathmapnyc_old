
df = pandas.read_csv("NYPD_Motor_Vehicle_Collisions.csv")
veh = pandas.concat([df.DATE, df.LATITUDE, df.LONGITUDE, df["NUMBER OF PERSONS KILLED"]], axis=1)