import * as React from 'react';
import { StackActions } from '@react-navigation/native';
export const navigationRef = React.createRef();

export const navigate = (name, params) => {
    navigationRef.current?.navigate(name, params);
}

export const replace = (name, params) => {
    navigationRef.current?.dispatch(StackActions.replace(name, params));
}
export const goBack = (name, params) => {
    navigationRef.current?.goBack(name, params);
}

export const push = (...args) => {
    navigationRef.current?.dispatch(StackActions.push(...args));
}

export const pop = (...args) => {
    navigationRef.current?.dispatch(StackActions.pop(...args));
}