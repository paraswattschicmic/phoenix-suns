import React, { useEffect } from 'react';
import { connect } from 'react-redux';

const AuthCheck = ({
    route = {},
    children,
    authToken = ''
}) => {
    useEffect(() => {
        let { name = '' } = route;
        if (!authToken) {
            // alert()
        }
    }, [])
    return (
        <>
            {children}
        </>
    );
}

const mapStateToProps = state => {
    return {
        authToken: state.common.authToken
    }
};
export default connect(mapStateToProps)(AuthCheck);
