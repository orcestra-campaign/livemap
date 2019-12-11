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
    faSatelliteDish
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

const icons = {
    "meteor": { w: "50px", h: "22px", l: "-20px", t: "-10px", src: meteor },
    "mooring": { w: "24px", h: "30px", l: "-8px", t: "-10px", src: mooring },
    "wave glider": { w: "24px", h: "30px", l: "-10px", t: "-15px", src: waveglider },
    "slocum glider": { w: "30px", h: "30px", l: "-10px", t: "-15px", src: slocum },
    "drifter": { w: "15px", h: "30px", l: "-7.5px", t: "-15px", src: drifter },
    "svp drifter": { w: "25px", h: "25px", l: "-10px", t: "-10px", src: svpdrifter },
    "saildrone": { w: "30px", h: "42px", l: "-10px", t: "-20px", src: saildrone },
    "plane": { fa: faPlane },
    "ship": { fa: faShip },
    "station": { fa: faHome },
    "buoy": { fa: faLifeRing },
    "ground radar": { fa: faSatelliteDish },
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
    render() {
        const props = any_icon(this.props.asset_types)
        if ( props.fa !== undefined ) {
            const style = {
                "margin-left": "-0.5em",
                "margin-top": "-0.5em",
            }
            return <FontAwesomeIcon className="icon"
                                    icon={ props.fa }
                                    size="2x"
                                    style={ style } />
        } else {
            const style = {
                "margin-left": props.l,
                "margin-top": props.t,
            }
            return <img style={ style } width={ props.w } height={ props.h } src={ props.src } alt={this.props.asset_types[0]} />
        }
    }
}
