import * as R from 'ramda'

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
                const idLens = R.lensPath(['platform', id, 'meta'])
                return R.over(idLens, device => { return action.payload; }, state); 
            }
        case "PLATFORM_LOCATION":
            {
                const id = platform_id(action.topic);
                const idLens = R.lensPath(['platform', id, 'location'])
                return R.over(idLens, device => { return action.payload; }, state); 
            }
        default:
            return state;
    }
}

export default eurec4a_reducer;
