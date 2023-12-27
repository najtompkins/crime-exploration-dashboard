# Import dependencies
import pandas as pd
from flask import Flask, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import re

# Read in the full dataset
df = pd.read_csv('data/Crime_Data_from_2020_to_Present.csv')

# Drop unnessesary columns
df = df.drop(['DR_NO',
              'Date Rptd',
              'Rpt Dist No',
              'Part 1-2',
              'Mocodes',
              'Vict Descent',
              'Premis Cd',
              'Weapon Used Cd',
              'Status',
              'Crm Cd 2', 
              'Crm Cd 3',
              'Crm Cd 4'], axis=1)

# *******************************************************
# Cleaned Data
# *******************************************************

# Remove negative age data
cleanedDf = df.drop(df[df['Vict Age'] < 1].index)

# Export cleaned data
cleanedDf.to_csv("data/DataCleaned.csv", index=False)

# *******************************************************
# Sample data for Github upload limit
# *******************************************************

# Specify the number of samples desired
n_rows_to_select = 50000

# Randomly select rows
sample_df = cleanedDf.sample(n=n_rows_to_select, random_state=99)

# export sample of data for git upload purposes
sample_df.to_csv("data/DataSample.csv", index=False)

# *******************************************************
# Sample data < 50mb
# *******************************************************

# Specify the number of samples desired
n_rows_to_select = 250000

# Randomly select rows
random_sample_df = cleanedDf.sample(n=n_rows_to_select, random_state=42)

# export sample of data for git upload purposes
random_sample_df.to_csv("data/DataSample_50.csv", index=False)
