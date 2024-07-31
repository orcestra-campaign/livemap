import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
//    faStopwatch,
//    faRuler,
    faPlane,
    faShip,
    faHome,
    faLifeRing,
    faQuestion,
    faSatelliteDish,
    faSatellite
} from '@fortawesome/free-solid-svg-icons'

import {
    faFly
} from '@fortawesome/free-brands-svg-icons'

import slocum from "./asset_icons/geomar_waveglider/slocum.png";
import meteor from "./asset_icons/geomar_waveglider/meteor.png";
import mooring from "./asset_icons/geomar_waveglider/mooring.png";
import drifter from "./asset_icons/geomar_waveglider/drifter.png";
import svpdrifter from "./asset_icons/geomar_waveglider/svp-drifter.png";
import saildrone from "./asset_icons/geomar_waveglider/saildrone.png";
import waveglider from "./asset_icons/geomar_waveglider/waveglider.png";
import seaglider from "./asset_icons/uea_icons/seaglider.png";
import caravela from "./asset_icons/uea_icons/caravela.png";
import quadcopter_top from "./asset_icons/strinqs/quadcopter_top.png";

const icons = {
    "meteor": { w: "50px", h: "22px", l: "-20px", t: "-10px", src: meteor },
    "mooring": { w: "24px", h: "30px", l: "-8px", t: "-10px", src: mooring },
    "wave glider": { w: "24px", h: "30px", l: "-10px", t: "-15px", src: waveglider },
    "slocum glider": { w: "30px", h: "30px", l: "-10px", t: "-15px", src: slocum },
    "seaglider": { w: "30px", h: "12px", l: "-10px", t: "-8px", src: seaglider },
    "caravela": { w: "42px", h: "20px", l: "-10px", t: "-10px", src: caravela },
    "drifter": { w: "15px", h: "30px", l: "-7.5px", t: "-15px", src: drifter },
    "svp drifter": { w: "25px", h: "25px", l: "-10px", t: "-10px", src: svpdrifter },
    "saildrone": { w: "30px", h: "42px", l: "-10px", t: "-20px", src: saildrone },
    "quadcopter": { w: "30px", h: "30px", l: "-15px", t: "-15px", src: quadcopter_top },
    "plane": { fa: faPlane },
    "ship": { fa: faShip },
    "station": { fa: faHome },
    "buoy": { fa: faLifeRing },
    "ground radar": { fa: faSatelliteDish },
    "satellite": { fa: faSatellite },
    "tethered balloon": { fa: faFly },
    "undefined": { fa: faQuestion },
}

const any_icon = asset_types => {
    var icon = undefined;
    for ( const asset_type of asset_types || [] ) {
        icon = icons[asset_type];
        if ( icon !== undefined ) {
            break;
        }
    }
    if ( icon === undefined ) {
        icon = icons["undefined"];
    }
    return icon;
};

export class AssetIcon extends Component {
    static defaultProps = {
        marker: false,
    };

    render() {
        const props = any_icon(this.props.asset_types)
        if ( props.fa !== undefined ) {
            if ( this.props.marker ) {
                const style = {
                    "marginLeft": "-0.5em",
                    "marginTop": "-0.5em",
                }
                return <FontAwesomeIcon className="icon"
                                        icon={ props.fa }
                                        size="2x"
                                        style={ style } />
            } else {
                return <FontAwesomeIcon className="icon" icon={ props.fa } />
            }
        } else {
            if ( this.props.marker ) {
                const style = {
                    "marginLeft": props.l,
                    "marginTop": props.t,
                }
                return <img style={ style } width={ props.w } height={ props.h } src={ props.src } alt={this.props.asset_types[0]} />
            } else {
                return <img style={ {height: "1.2em"} } src={ props.src } alt={this.props.asset_types[0]} />
            }
        }
    }
}
