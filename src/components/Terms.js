import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, I18nManager, Dimensions, ActivityIndicator } from "react-native";
import { Container, Content, Header, Button, Left, Body, Title } from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";

import { useSelector, useDispatch } from 'react-redux';
import { termsCondition } from '../actions';
import * as Animatable from "react-native-animatable";
import HTML from "react-native-render-html";
import Loading from "./Loading";



function Terms({ navigation }) {

    const lang = useSelector(state => state.lang.lang);
    const [loader, setLoader] = useState(true);
    const terms = useSelector(state => state.article.terms ? state.article.terms : '');
    const dispatch = useDispatch();

    function fetchData() {
        dispatch(termsCondition(lang)).then(() => setLoader(false)).catch(() => setLoader(false));
    }

    useEffect(() => {
        fetchData();
    }, []);

    function renderLoader() {
        if (loader) {
            return (
                <Loading />
            );
        }
    }

    return (
        <Container style={[styles.bg_dash]}>

            {renderLoader()}

            <Header style={[styles.headerView, styles.bg_default_2, styles.Width_100, styles.paddingHorizontal_15]}>
                <Left style={[styles.leftIcon,]}>
                    <TouchableOpacity style={[styles.Button]} transparent onPress={() => navigation.goBack()}>
                        <Image
                            style={[styles.width_25, styles.height_25]}
                            source={require('../../assets/image/right.png')}
                        />
                    </TouchableOpacity>
                </Left>
                <Body style={[styles.bodyText]}>
                    <Title style={[styles.FairuzBold, styles.text_default, styles.textSize_18,]}>
                        {i18n.t('terms')}
                    </Title>
                </Body>
            </Header>

            <Content contentContainerStyle={[styles.bgFullWidth, styles.position_R, styles.paddingHorizontal_15, styles.paddingVertical_15]}>

                <View style={[styles.bg_White, styles.Radius_10, styles.bgFullWidth]}>
                    <View style={[styles.flexCenter, styles.marginVertical_20, styles.Width_100,]}>
                        <Image
                            style={[styles.width_170, styles.height_170, { borderRadius: 25 }]}
                            source={require('../../assets/image/logo.png')}
                            resizeMode='contain'
                        />
                    </View>

                    <View style={[styles.Width_90, styles.flexCenter, styles.paddingHorizontal_10]}>
                        <HTML
                            html={terms}
                            imagesMaxWidth={Dimensions.get('window').width}
                            baseFontStyle={{
                                fontSize: 16,
                                fontFamily: 'FairuzNormal',
                                color: '#363636',
                                writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'
                            }}
                        />
                    </View>
                </View>

            </Content>
        </Container>
    );
}

export default Terms;
