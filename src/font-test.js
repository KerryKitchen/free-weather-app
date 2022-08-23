// Used for main class
import React from 'react';

// Used for fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudSun, faCloudRain } from "@fortawesome/free-solid-svg-icons";
import { faSmog, faCloudShowersHeavy, faCloudBolt, faPooStorm } from "@fortawesome/free-solid-svg-icons";

//
class FontTest extends React.Component {

  // Returns an icon dependant on the code input
  getWeatherIcon(code) {

    let weatherIcon;

    switch(code) {
      case 0:
        weatherIcon = faSun;
        break;
      case 1:
      case 2:
        weatherIcon = faCloudSun;
        break;
      case 3:
        weatherIcon = faCloud;
        break;
      case 45:
        weatherIcon = faSmog;
        break;
      case 51:
      case 53:
      case 55:
      case 61:
      case 63:
      case 80:
      case 81:
        weatherIcon = faCloudRain;
        break;
      case 65:
      case 82:
        weatherIcon = faCloudShowersHeavy;
        break;
      case 95:
      case 96:
      case 99:
        weatherIcon = faCloudBolt;
        break;
      default:
        weatherIcon = faPooStorm;
    }

    return weatherIcon;
  }

	//
	render(){

		//
		const element = <FontAwesomeIcon icon={this.getWeatherIcon(0)} />

		//
		return (
			<div>Hello world! {element} </div>
		);
	}


}

export default FontTest;