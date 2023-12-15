import pandas as pd
from flask import Flask, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt
from datetime import timedelta
from flask_cors import CORS
import geopandas as gpd
import re
#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///LA_Crime_Data.sqlite")

# Write sample dataframe to SQL database
df = pd.read_csv('DataCleaned.csv')
df.to_sql('LA_Crime_Data', con= engine, if_exists='replace', index=False)


# # Write cleaned data to SQL database
# cleaned_df = pd.read_csv('DataCleaned.csv')
# cleaned_df.to_sql('LA_Crime_Data_cleaned', con= engine, if_exists='replace', index=False)


# # Write complete data to SQL database
# all_ages_df = pd.read_csv('Data_All_Ages.csv')
# all_ages_df.to_sql('LA_Crime_Data_All', con= engine, if_exists='replace', index=False)

crimes = [ 'ASSAULT', 'ARSON', 'BATTERY', 'BIKE', 'BOMB', 'BUNCO', 'BURGLARY', 'COUNTERFEIT', 'CREDIT CARD', 'CRIMINAL HOMICIDE', 'DISTURBING THE PEACE', 'FORGERY', 'EMBEZZLEMENT', 'EXTORTION', 'HUMAN TRAFFICKING', 'INDECENT EXPOSURE', 'KIDNAPPING', 'LEWD', 'PICKPOCKET', 'ROBBERY', 'SHOPLIFTING', 'SEX', 'STALKING', 'THEFT', 'TRESPASSING', 'VANDALISM', 'VEHICLE','OTHER']


#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)
#################################################
# Flask Routes
#################################################
@app.route("/")
def welcome():
    return "Welcome!"

# This route performs a get all query on the database.
@app.route("/crimedata")
def locations():
    with engine.connect() as conn:
        result = conn.execute('SELECT * FROM LA_Crime_Data')

        data = [dict(row) for row in result]   

    return jsonify(data)

# This route is used to perform queries based on a user input. 
@app.route("/crimedata/<thing>")
def assault(thing):
    upper = thing.upper()
    with engine.connect() as conn:
        result = conn.execute(f"SELECT * FROM LA_Crime_Data WHERE [Crm Cd Desc] REGEXP '{upper}';")

        data = [dict(row) for row in result]   

    return jsonify(data)

# This route gets all crimes not specified by the "thing" route.
@app.route("/crimedata/other/all")

def other():
    with engine.connect() as conn:
        result = conn.execute(f"SELECT * FROM LA_Crime_Data WHERE [Crm Cd Desc] NOT LIKE '%ASSAULT%'\
                                AND [Crm Cd Desc] NOT LIKE '%ARSON%'\
                                AND [Crm Cd Desc] NOT LIKE '%BATTERY%'\
                                AND [Crm Cd Desc] NOT LIKE '%BIKE%'\
                                AND [Crm Cd Desc] NOT LIKE '%BOMB%'\
                                AND [Crm Cd Desc] NOT LIKE '%BUNCO%'\
                                AND [Crm Cd Desc] NOT LIKE '%BURGLARY%'\
                                AND [Crm Cd Desc] NOT LIKE '%COUNTERFEIT%'\
                                AND [Crm Cd Desc] NOT LIKE '%CREDIT CARD%'\
                                AND [Crm Cd Desc] NOT LIKE '%CIMINAL HOMICIDE%'\
                                AND [Crm Cd Desc] NOT LIKE '%DISTURBING THE PEACE%'\
                                AND [Crm Cd Desc] NOT LIKE '%FORGERY%'\
                                AND [Crm Cd Desc] NOT LIKE '%EMBEZZLEMENT%'\
                                AND [Crm Cd Desc] NOT LIKE '%EXTORTION%'\
                                AND [Crm Cd Desc] NOT LIKE '%HUMAN TRAFFICKING%'\
                                AND [Crm Cd Desc] NOT LIKE '%INDECENT EXPOSURE%'\
                                AND [Crm Cd Desc] NOT LIKE '%KIDNAPPING%'\
                                AND [Crm Cd Desc] NOT LIKE '%LEWD%'\
                              AND [Crm Cd Desc] NOT LIKE '%PICKPOCKET%'\
                              AND [Crm Cd Desc] NOT LIKE '%ROBBERY%'\
                              AND [Crm Cd Desc] NOT LIKE '%SHOPLIFTING%'\
                              AND [Crm Cd Desc] NOT LIKE '%SEX%'\
                              AND [Crm Cd Desc] NOT LIKE '%STALKING%'\
                              AND [Crm Cd Desc] NOT LIKE '%THEFT%'\
                              AND [Crm Cd Desc] NOT LIKE '%TRESSPASSING%'\
                              AND [Crm Cd Desc] NOT LIKE '%VANDALISM%'\
                              AND [Crm Cd Desc] NOT LIKE '%VEHICLE%'\
                              ")

        data = [dict(row) for row in result]   

    return jsonify(data)

# This route calls an API to get Lat and Long data from a GEOJSON
@app.route("/stations")
def stations():

    gdf = gpd.read_file('LAPD_Police_Stations.geojson')

    # Initialize an empty GeoJSON dictionary
    new_geojson_dict = {
        "type": "FeatureCollection",
        "features": []
    }

    # Iterate through the GeoDataFrame features
    for index, row in gdf.iterrows():
        feature = {
            "type": "Feature",
            "geometry": row.geometry.__geo_interface__,  # Convert geometry to GeoJSON format
            "properties": row.drop('geometry').to_dict()  # Convert attributes to dictionary
        }
        new_geojson_dict["features"].append(feature)

    return (new_geojson_dict)

# This route calls an API to get Lat and Long data from a GEOJSON for the purpose of drawing boundaries.
@app.route("/cityareas")
def cityareas():

    gdf2 = gpd.read_file('Neighborhood_Service_Areas.geojson')

    # Initialize an empty GeoJSON dictionary
    new_geojson_dict2 = {
        "type": "FeatureCollection",
        "features": []
    }

    # Iterate through the GeoDataFrame features
    for index, row in gdf2.iterrows():
        feature = {
            "type": "Feature",
            "geometry": row.geometry.__geo_interface__,  # Convert geometry to GeoJSON format
            "properties": row.drop('geometry').to_dict()  # Convert attributes to dictionary
        }
        new_geojson_dict2["features"].append(feature)

    return (new_geojson_dict2)


#  Boilerplate
if __name__ == '__main__':
    app.run(debug=True)

