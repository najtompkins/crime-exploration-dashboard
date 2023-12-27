# Crime Data in LA --- Full-Stack Dashboard

### Team Members: <br> 
**Martin Bedino**: GitHub: [mbedino99](https://github.com/mbedino99) <br>
**David Pinsky**: GitHub: [dpinsky1](https://github.com/dpinsky1) <br>
**Lois Stetson**: GitHub: [loisstetson9](https://github.com/loisstetson9) <br>
**Nathan-Andrew Tompkins (self)**: GitHub: [najtompkins](https://github.com/najtompkins) <br>

* **

# Explore the Dashboard: [Here](https://najtompkins.github.io/crime-exploration-dashboard/docs) <br> Dashboard Repository Link: [Here](https://github.com/najtompkins/crime-exploration-dashboard)

## Project Summary
This full-stack interactive dashboard of LA's crime data (reported between 2020-2023) is designed as a demonstration of my team's ability to: <br>
1. Develop and deploy a local API using Flask in combination with an SQLite database processing variable SQL queries.
2. Design a single-page HTML5 dashboard that allows for interactive heat-map of crime data by district and crime-type.
2. Gather, clean, and combine LA Policing and Crime data from various open sources and import them into the SQLite database
4. Write a JavaScript logic that handles all dashboard interactions, including populating a Leaflet.js map, generating Plot.ly charts, etc.

 (*The non-local API can be explored from the interactive dashboard linked above, or directly by following instructions in point #2 of the "Deploying the Back-End"* section.*)

## How To Locally Deploy This Dashboard:

1. Download or clone this repository.
2. Download the [primary crime data](https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8/about_data) (2020-Present), from LA City's own website into the /data directory.
3. Run the data_cleaning.py file to clean and export the cleaned .csv files needed to run everything else.
4. Open the app.js file (located in the docs/index/js ([here](docs/index/js/app.js))) and comment-out lines 43, 55, 59, and 63. Un-comment lines 42, 54, 58, and 62. **This routes the API calls to pull locally, instead of the external server where the data is also hosted.** Save the file.
4. Run the api_server.py in the terminal. (This server will need to be shut down later)
    * *The code near the top of this file defaults to using the full DataCleaned.csv in the SQLite file. If you would like to use the other smaller exported .csv files, uncomment and comment-out code as directed within the code.*
    * Be sure that the Python modules: Pandas, Flask, Flask_CORS, SQLAlchemy, and GeoPandas are installed in your python environment.
5. Open the index.html file in your preferred browser. (Only Safari and Chrome were tested)
6. Explore the dashboard and allow a few moments for the API to populate the heatmap after each crime selection.
7. Close browser to close the dashboard and shut down the server by using CTRL + C in the terminal to conclude this project.

# Project

## Sourcing and Cleaning
1. There are 3 primary sources of the data used to populate this dashboard:
    1. The [primary crime data](https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8/about_data) (2020-Present), from LA City's own website.
        * *Note that the data used in this dashboard was exported in September of 2023.*
        * *[DataSample.csv](https://geohub.lacity.org/datasets/lahub::lapd-police-stations/explore), the file located in this repository, is a cleaned and deprecated version of the original source and comprises of 50,000 record samples to meet GitHub's repository upload size-limits. It is meant as a representation of the data and is not the actual source to use when deploying the local Flask app.*
    2. The [police station location data](https://geohub.lacity.org/datasets/lahub::lapd-police-stations/explore), which was used to populate points on the interactive Leatlet.js heatmap representing police stations amidst the crimes reported.
    3. The [the LA disctricts/area boundaries](https://geohub.lacity.org/datasets/lahub::neighborhood-service-areas/explore), used to draw the numerous GeoJSON encoded districts/area boundaries on the map.

2. A python script was developed ([data_cleaning.py](data_cleaning.py)) which imports the above LA crime data and places it into a Pandas dataframe. This drops the unneeded columns, cleans the records, then exports various sample sizes of the cleaned data: [DataCleaned.csv](data/DataCleaned.csv), which is all data less what was removed in cleaning, [DataSample.csv](data/DataSample.csv), which is a 50 thousand record sample of the data for the purposes of GitHub size limits, and [DataSample_50.csv](data/DataSample_50.csv), which is a < 50mb sample of the the cleaned data used when deploying the Flask App on a hosted server.
    * *Note that the cleaning of this data, while important, was a functional endeavor and not extensive. The full-stack nature was prioritized and the decision to remove all data that did not have a reported age above 1 year (roughly 24.4% of the full set) was made to increase efficiency of API calls.*

### Creating the Front-End (/docs/index.html)
*The front-end development process included using tools such as Bootstrap, Leaflet.js, Leaflet-heat.js, and Plot.ly. The general structure is outlined below.*
- Head
  - Imported dependecies include:
    - Bootstrap #1
    - Leaflet
    - Leaflet-Heatmap
    - style.css (local)
    - Plotly
    - Chart.js #1
- Body
    - Gradient background
        - Infobox with two dropdown menus for LA district or specific crime selections.
    - Leaflet heat-map, with different layers for stations, district boundaries, crimes. Populates as crimes are selected. Zooms as districts are selected.
    - Chart for age distribution of records.
    - Chart for sex distribution of records.
  - Footer (and dependancies)
    - Dashboard team credits
    - Chart.js script #2
    - D3 script
    - app.js (local script)
    - Bootstrap script #2

### Deploying the Back-End (api_server.py)
*This python file deploys a LOCAL Flask API app. For information on the deployed (hosted) app, see point #2.*<br>
<br>
Note: While cloning this repository in full is the best option **when your desire is to run this locally,** the api_server.py file requires the noted Python dependencies (outlined below) to be installed before local deployement is successful. It also requires the linked primary Crime Data source cited above. The DataCleaned.csv file that the data_cleaning.py file exports operates on this original (large) .csv. <br>

1. After importing our dependencies (Pandas, Flask, Flask_CORS, SQLAlchemy, GeoPandas) the DataCleaned.csv is read in and exported to an sqlite server. Our Flask app is then set up with a few main routes in mind:
    1. "/crimedata" - The first deploys all of the data from the CleanedData.csv in JSON format. While unused in the dashboard itself this route was vital to the debugging and creation of the visualization in the earlier stages of development.
    2. "/crimedata/-crime-" - Provides a queried selection of the dataset. Event listeners are set up to request data on a specific crime based on which crime is selected from the dropdown menu in the front-end index.html.
    3. "/crimedata/other/all" - Provides all crime data not specified in the dropdown menu when the user selects the "Other" dropdown option.
    4. "/stations" - Serves the location data for the police stations in the LA area, imported from the [police station location data](https://geohub.lacity.org/datasets/lahub::lapd-police-stations/explore) CSV file so the Leaflet.js map may add the points to a map layer.
    5. "/cityareas" - Provides [the LA district/area boundaries](https://geohub.lacity.org/datasets/lahub::neighborhood-service-areas/explore) of the LA area so the Leaflet.js map may add the areas to a map layer.
2. The differences between the local vs hosted Flask app are minimal. As such, the code for the hosted version is not directly included in this repository as a separate file, but is instead commented out in the api_server.py file. The differences include: 
    1. File paths for each of the .csv files. 
    2. Use of a much large DataSample.csv which uses < 50mb of the original cleaned data. (This is the reason for the call-response delay on the front-end.)<br>
        1. Use this URL structure to access this API: <br>
    ```https://tompkins.pythonanywhere.com/<flask route>```. <br> *The Flask routes are outlined above. Leave route blank to return the app's welcome page.*<br>

### Javascript Logic (app.js) <br>

1. We set up a number of Leaflet layer variables for the Stations and District Areas for the API calls to populate. The map is initialized next, being sure to include layer controls for interactability.
2. Our API urls are set to call from our local server and create a data() function to populate our heatmap as specific crimes are selected from the crime-selection dropdown menu.
    * *Commented alternatives to URL variables are located within the code for understanding of how this app works when deployed on a hosted server.*
3. Our district and police-station map layers are populated by calling each dataset for that data, then drawn onto the map. Note that it was necessary to be particularly careful when coding this logic, as a number of districts contain "negative" areas which are under a different district of area classification.
4. D3 tools were utilized to populate the dropdown menus with district names and crime types. Event listeners were added to each dropdown menus option so that as they are clicked the map updates with the specific crime queried, or zooms in on the unique district selected.
5. Age and Sex distribution charts are generated and populated below the primary dashboard element (leaflet map.) Both charts were generated using the Chart.js libarary.
