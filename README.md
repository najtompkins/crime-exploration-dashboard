# LA_CrimeData_Dashboard
### Project #3: Full Stack Dashboard


### Project Proposal
#### Team Members: Martin Bedino, David Pinsky, Lois Stetson, Nathan-Andrew Tompkins

### City of Los Angeles Crime:

- We propose an analysis of the City of Los Angelos and the crime reported there to determine different variables and how they relate to crime rates based on age, types of weapons, locations of division police stations, etc... 
- There are a few points we plan to explore using interactive visualization:
  - Determine where crimes fall in relation to the police stations within the several LA divisions in. Map chart interactive visualization
  - What is the most used weapon
  - What are the distributions of the victim's ages?
  - How does time of year and time of day affects the amount of crime? 

#### Dashboard layout mockup is attached in repo:
![image](https://github.com/mbedino99/LA_CrimeData_Dashboard/assets/127718619/1a7762eb-b5ad-4fe5-bfe9-1cce71a92016)


#### Datasest:
https://www.kaggle.com/datasets/nathaniellybrand/los-angeles-crime-dataset-2020-present
- A sample of the data is provided in this repo

https://geohub.lacity.org/datasets/lahub::lapd-police-stations/explore

https://geohub.lacity.org/search?collection=Dataset&q=police

Github Repository link: https://github.com/mbedino99/LA_CrimeData_Dashboard.git

Images for Inspiration:

![image](https://github.com/mbedino99/LA_CrimeData_Dashboard/assets/127718619/cb94edf6-5bb4-4cd2-902f-bdac25d777f0)


[https://i.stack.imgur.com/PFxoj.png](https://i.stack.imgur.com/PFxoj.png)

[https://www.losangelesblade.com/content/files/2021/11/LA-LGBTQ-Heat-Map-e1636571868231.png](https://www.losangelesblade.com/content/files/2021/11/LA-LGBTQ-Heat-Map-e1636571868231.png)https://www.losangelesblade.com/content/files/2021/11/LA-LGBTQ-Heat-Map-e1636571868231.png

# Submission

### Import and Cleaning (Crime_data.ipynb)
- The ipynb notebook  imports the local .csv file downloaded from kaggle source listed above into a Pandas dataframe, dropping unneeded columns and then exporting a sample of the cleaned data as a .csv and the full cleaned data into its own .csv. It should be noted that our analysis does not include the full dataset, as in cleaning we found it necessary to exclude any row of data that did not have a reported age. (roughly 24.4% of the full data set).

### Deploying the local API (test.py)
- After importing our dependencies the DataCleaned.csv is read in and exported to an sqlite server. Our Flask app is then set up with a few main routes in mind:
  - The first contains all of the data from the CleanedData.csv in the JSON format. While unused in the final submission this route was vital to the debugging and creation of the visualization.
  - The second provides a queried selection of the data based on what type of crime is selected from the dropdown menu in the front-end index.html. This code is dynamic enough that a simple addition of a specified crime to the list found on line 32 is enough to query the set, allowing scalability to the front-end dropdown menu and future specifications of crimes not yet available in the code.
  - The third provides all data not specified in the dropdown menu when the user selects the "Other" dropdown option.
  - The fourth provides the location data for the police stations in the LA area, imported from a linked source above.
  - The fifth provides the district boundaries of the LA area in geoJson format, imported from a linked source above.
 
### Creating the Dashboard (index.html)
- Head
  - Imported dependecies include:
    - Bootstrap
    - Leaflet
    - Leaflet-Heatmap
    - Plotly
    - Chart.js
  - Body
    - Gradient background
    - Infobox with two dropdown menus to view a specific LA district or select specific crimes on the map
    - Leaflet heat-map, with different layers for stations, district boundaries, crimes.
    - Chart for age distirbution
    - Chart for sex distribution
  - Scripts
    - Leaflet dependency
    - D3 dependency
    - app.js dependency

### Javascript Logic (app.js)
- We first set up the layer variables for the leaflet map to be filled out later and then the map initialization itself, being sure to include layer controls.
- We set our data urls to pull from our local APIs and created a data() function to pull whatever data we want to set to our heatmap from our local api.
- Our district and police station layers were then populated by pulling from each local api link respectively, being conscientious about the "negative" areas of certain districts and how they are drawn.
- We added event listeners to the population of the dropdown menus so that whenever they are clicked, the map updates with the information queried, or zooms in on the district selected.
- We then populated the age distribution chart, and the sex distribution chart. Both made useing chart.js.
