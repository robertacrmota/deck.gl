import {MapStylePicker} from './controls';
import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL from 'deck.gl';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v9';
const MAPBOX_TOKEN = 'pk.eyJ1Ijoicm9iZXJ0YWNybW90YSIsImEiOiJja2R3ejVwNmMyeHFvMnJtaGtzOWN4Zmw3In0.Kv9z-dywsFVuT31mjJP7IA';// process.env.MapboxAccessToken; // eslint-disable-line

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
    style: 'mapbox://styles/mapbox/dark-v9'
  };

  // --------------------------------------------------------
  // react-map-gl callbacks
  // --------------------------------------------------------

  onStyleChange = (style) => this.setState({style});

  // --------------------------------------------------------
  // react lifecycle methods
  // --------------------------------------------------------


  render() {
    return (
      <div>
        <MapStylePicker onStyleChange={this.onStyleChange} currentStyle={this.state.style}/>
          {MAPBOX_TOKEN ? ( 
            <DeckGL initialViewState={INITIAL_VIEW_STATE} controller>
              <StaticMap mapStyle={this.state.style} mapboxApiAccessToken={MAPBOX_TOKEN} />
            </DeckGL>
          ) : (
            <SetToken />
          )}
      </div>
    );
  }
}
