import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { View } from "react-native";


function InitScreen({navigation}) {

    const lang                              = useSelector(state => state.lang.lang);

    function fetchData(){

        if(lang === null || lang === undefined) {
            navigation.navigate('language');
        } else {
            navigation.navigate('home');
        }

    }
    
    useEffect(() => {
        fetchData()
    }, []);

    return (
        <View/>
    );

}

export default InitScreen;
