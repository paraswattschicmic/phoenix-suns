export const SOCIAL_LOGIN_REQUEST = "SOCIAL_LOGIN_REQUEST"
export const PHONE_LOGIN_REQUEST = "PHONE_LOGIN_REQUEST"
export const VERIFY_OTP_LOGIN_REQUEST = "VERIFY_OTP_LOGIN_REQUEST"
export const LOGOUT_REQUEST = "LOGOUT_REQUEST"

export const socialLoginRequest = payload => {
    return {
        type: SOCIAL_LOGIN_REQUEST,
        payload
    }
}
export const phoneLoginRequest = payload => {
    return {
        type: PHONE_LOGIN_REQUEST,
        payload
    }
}
export const verifyOTPLoginRequest = payload => {
    return {
        type: VERIFY_OTP_LOGIN_REQUEST,
        payload
    }
}

export const logoutRequest = payload => {
    return {
        type: LOGOUT_REQUEST,
        payload
    }
}