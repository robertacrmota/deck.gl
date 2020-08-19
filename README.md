

![](deckgl-thumb.gif)

Sample project to test [deck.gl](https://github.com/visgl/deck.gl). The data relates to pickups and dropoffs locations of Uber trips. The visualization includes two coordinated views: i) map with two data overlays and ii) a bar chart.


#### Data overlays
Hexagonal and scatterplot layers. Hexagonal layer displays pickup/dropoff spatial distribution. Scatterplot overlay shows pickups (orange) and dropoffs (purple) locations.

#### Chart
Bar chart shows pickup distribution per hour. It is built using [react-vis](http://uber.github.io/react-vis/)

#### Usage
Copy the content of this folder to your project. Run
```
npm install
npm start
```
