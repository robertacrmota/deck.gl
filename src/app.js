import {renderLayers} from './deckgl-layers';
import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import { tooltipStyle } from './style';
import Charts from './charts';
import DeckGL from 'deck.gl';
import {LayerControls,
        MapStylePicker,
        SCATTERPLOT_CONTROLS,
        HEXAGON_CONTROLS} from './controls';


import taxiData from '../../../data/taxi';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v9';
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const INITIAL_VIEW_STATE = {
  longitude: -74,
  latitude: 40.7,
  zoom: 11,
  minZoom: 5,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

function SetToken() {
  return (
    <div style={{fontSize: '20px'}}>
      <div>You don't have a Mapbox token set in your environemnt.</div>
      <ul>
        <li>
          Go to <a href="http://mapbox.com">Mapbox</a> and log in or sign up to
          get a token.
        </li>
        <li>Copy the token to your clipboard.</li>
        <li>Stop this app in the terminal (ctrl+c)</li>
        <li>
          <p>type: </p>
          <p>
            <code>export MapboxAccessToken="</code>, then paste your token, then
            type a closing ".
          </p>{' '}
          ie <code>export MapboxAcessToken="pk.123456"</code>
        </li>
        <li>
          Restart the app from the terminal (<code>yarn start</code>)
        </li>
      </ul>
    </div>
  );
}

export default class App extends Component {
  state = {
    hover: {
      x: 0,
      y: 0,
      hoveredObject: null
    },
    points: [],
    pickups: [],
    dropoffs: {},
    settings: Object.keys(HEXAGON_CONTROLS).reduce(
      (accu, key) => ({
        ...accu,
        [key]: HEXAGON_CONTROLS[key].value
      }),
      {}),
    style: 'mapbox://styles/mapbox/dark-v9'
  };


  _processData = () => {
    const data = taxiData.reduce(
      (accu, curr) => {
        const pickupHour = new Date(curr.pickup_datetime).getUTCHours();
        const dropoffHour = new Date(curr.dropoff_datetime).getUTCHours();

        const pickupLongitude = Number(curr.pickup_longitude);
        const pickupLatitude = Number(curr.pickup_latitude);

        if (!isNaN(pickupLongitude) && !isNaN(pickupLatitude)) {
          accu.points.push({
            position: [pickupLongitude, pickupLatitude],
            hour: pickupHour,
            pickup: true
          });
        }

        const dropoffLongitude = Number(curr.dropoff_longitude);
        const dropoffLatitude = Number(curr.dropoff_latitude);

        if (!isNaN(dropoffLongitude) && !isNaN(dropoffLatitude)) {
          accu.points.push({
            position: [dropoffLongitude, dropoffLatitude],
            hour: dropoffHour,
            pickup: false
          });
        }

        const prevPickups = accu.pickupObj[pickupHour] || 0;
        const prevDropoffs = accu.dropoffObj[dropoffHour] || 0;

        accu.pickupObj[pickupHour] = prevPickups + 1;
        accu.dropoffObj[dropoffHour] = prevDropoffs + 1;

        return accu;
      },
      {
        points: [],
        pickupObj: {},
        dropoffObj: {}
      }
    );

    const pickupsArr = Object.entries(data.pickupObj);

    this.setState({
      points : data.points, 
      pickups: pickupsArr.map(p => {return {x: Number(p[0]), y: p[1]}}), 
      dropoffs: data.dropoffObj
    });
  }

  _updateLayerSettings(settings) {
    this.setState({ settings });
  }

  _onHover({ x, y, object }) {
    const label = object ? (object.pickup ? 'Pickup' : 'Dropoff') : null;

    this.setState({ hover: { x, y, hoveredObject: object, label } });
  }

  // --------------------------------------------------------
  // react-map-gl callbacks
  // --------------------------------------------------------

  onStyleChange = (style) => this.setState({style});

  // --------------------------------------------------------
  // react lifecycle methods
  // --------------------------------------------------------

  componentDidMount() {
    this._processData();
  }

  render() {
    const data = this.state.points;
    if (!data.length) { return null; }

    const { hover, settings } = this.state;
    return (
      <div>
          {hover.hoveredObject && (
            <div style={{...tooltipStyle, transform: `translate(${hover.x}px, ${hover.y}px)`}}>
              <div>{hover.label}</div>
            </div>
          )}
          <MapStylePicker onStyleChange={this.onStyleChange} 
                          currentStyle={this.state.style}
          />
          <LayerControls settings={this.state.settings}
                         propTypes={HEXAGON_CONTROLS}
                         onChange={settings => this._updateLayerSettings(settings)}
          />
          {MAPBOX_TOKEN ? ( 
            <React.Fragment>
              <DeckGL layers={renderLayers({data: this.state.points, settings: this.state.settings, onHover: hover => this._onHover(hover)})}
                      initialViewState={INITIAL_VIEW_STATE} 
                      controller>
                  <StaticMap mapStyle={this.state.style} 
                            mapboxApiAccessToken={MAPBOX_TOKEN}             
                  />
              </DeckGL>
              <Charts {...this.state} />
            </React.Fragment>
          ) : (
            <SetToken />
          )}
      </div>
    );
  }
}
