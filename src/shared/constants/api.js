// const LIVE_URL = 'http://15.207.65.54:3001';
//http://df6abefbc3ab.ngrok.io
// const STAGING_URL = 'http://15.207.65.54:3000';
const LIVE_URL = "https://mavericks.api.getcollyde.com";
//const STAGING_URL = 'http://b52291be6e65.ngrok.io';

export const BASE_URL = LIVE_URL;

const VERSION = '/v1'

export const PREFIX_URL = BASE_URL + VERSION;

export const API = {
    PHONE_LOGIN: PREFIX_URL + `/user/phoneLogin`,
    VERIFY_OTP: PREFIX_URL + `/user/verify-otp`,
    SOCIAL_LOGIN: PREFIX_URL + `/user/socialLogin`,
    TIMEZONES: (params = '') => PREFIX_URL + `/timezone/getAllTimezones` + params,
    UPDATE_PROFILE: PREFIX_URL + `/user/updateProfile`,
    UPLOAD_FILE: PREFIX_URL + `/uploadFile`,
    WATCH_PARTIES: (params = '') => PREFIX_URL + `/watchParty/listing` + params,
    CHAT_ROOMS: (params = '') => PREFIX_URL + `/group` + params,
    GET_PROFILE: PREFIX_URL + `/user/getProfile`,
    BAN_USER: PREFIX_URL + `/watchParty/banUser`,
    FLAG_MESSAGE: PREFIX_URL + `/watchParty/group/reportMessage`,
}