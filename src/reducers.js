import * as R from 'ramda'
import * as moment from 'moment';

function prepare_state(state) {
    return state;
}

const initialState = prepare_state({
    platform: {}
})

function platform_id(topic) {
    // eslint-disable-next-line
    return /platform\/([^\/]+)\/.*/.exec(topic)[1];
}

function eurec4a_reducer(state = initialState, action) {
    switch (action.type) {
            /*
        case CLOSE_DEVICE:
            return {
                ...state,
                devices: state.devices.filter(device => device.logger_id !== action.id)
            };
            */
        case "PLATFORM_META":
            {
                const id = platform_id(action.topic);
                if(action.payload === "DELETE") {
                    return R.dissocPath(['platform', id], state);
                } else {
                    const {url, contact, ...meta} = {
                        ...action.payload,
                        urls: ((action.payload.url && [action.payload.url]) || []).concat(action.payload.urls || []),
                        contacts: ((action.payload.contact && [action.payload.contact]) || []).concat(action.payload.contacts || [])
                    };
                    const idLens = R.lensPath(['platform', id, 'meta'])
                    return R.over(idLens, device => { return meta; }, state);
                }
            }
        case "PLATFORM_LOCATION":
            {
                const id = platform_id(action.topic);
                if(action.payload === "DELETE") {
                    return R.dissocPath(['platform', id, 'location'], state);
                } else {
                    const idLens = R.lensPath(['platform', id, 'location'])
                    const location = {...action.payload, time: moment.utc(action.payload.time)};
                    return R.over(idLens, device => { return location; }, state);
                }
            }
        default:
            return state;
    }
}

export default eurec4a_reducer;
