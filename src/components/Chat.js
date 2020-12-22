import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, RefreshControl } from "react-native";
import { Container, Content, Header, Left, Body, Title } from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";

import { useSelector, useDispatch } from 'react-redux';
import { allChat, getBlogs } from '../actions';
import * as Animatable from "react-native-animatable";
import Loading from "../components/Loading";

function Chat({ navigation }) {

    const lang = useSelector(state => state.lang.lang);
    const dataChat = useSelector(state => state.dataChat.dataChat ? state.dataChat.dataChat : []);
    const token = useSelector(state => state.auth.user ? state.auth.user.token : null);
    const [loader, setLoader] = useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const dispatch = useDispatch();

    const onRefresh = React.useCallback(() => {
        dispatch(allChat(token, lang)).then(() => setLoader(false)).catch(() => setLoader(false));
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(allChat(token, lang)).then(() => setLoader(false)).catch(() => setLoader(false));
        });

        return unsubscribe;
    }, [navigation]);

    function renderLoader() {
        if (loader) {
            return (
                <Loading />
            );
        }
    }

    return (
        <Container>

            {renderLoader()}

            <Header style={[styles.headerView, styles.bg_default_2, styles.Width_100, styles.paddingHorizontal_15]}>
                <Left style={[styles.leftIcon,]}>
                    <TouchableOpacity style={[styles.Button]} transparent onPress={() => navigation.openDrawer()}>
                        <Image
                            style={[styles.width_25, styles.height_25]}
                            source={require('../../assets/image/menu.png')}
                        />
                    </TouchableOpacity>
                </Left>
                <Body style={[styles.bodyText]}>
                    <Title style={[styles.FairuzBold, styles.text_default, styles.textSize_18,]}>
                        {i18n.t('chat')}
                    </Title>
                </Body>
            </Header>

            <Content
                contentContainerStyle={[styles.bgFullWidth, styles.position_R, styles.paddingBottom_60, styles.bg_dash]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>

                <View style={[styles.Width_100, styles.paddingHorizontal_10]}>

                    {
                        dataChat.length != 0 ?
                            dataChat.map((chat) => {
                                return (
                                    <View style={[styles.Width_100, styles.overHidden]}>
                                        <Animatable.View animation="fadeInUp" easing="ease-out" delay={500} style={[styles.Width_100]}>
                                            <TouchableOpacity onPress={() => navigation.push('chatRoom', {
                                                userId: chat.other.id,
                                                blogId: chat.ad_id,
                                                image: chat.other.avatar,
                                                name: chat.other.name
                                            })} style={[styles.paddingVertical_15, styles.rowGroup, styles.bg_White, styles.Radius_5, styles.paddingHorizontal_5, styles.marginVertical_5, styles.Border, styles.border_dash, styles.Width_100, styles.bg_White]}>
                                                <View style={[styles.flex_20, styles.flexCenter]}>
                                                    <Image
                                                        style={[styles.width_60, styles.height_60, styles.Radius_40, styles.Border, styles.border_orange]}
                                                        source={{ uri: chat.other.avatar }}
                                                    />
                                                </View>
                                                <View style={[styles.flex_80]}>
                                                    <View style={[styles.rowGroup, styles.Width_100]}>
                                                        <Text style={[styles.FairuzBold, styles.text_default_2, styles.textSize_15]}>
                                                            {chat.other.name}
                                                        </Text>
                                                        <Text style={[styles.FairuzBold, styles.text_light_gray, styles.textSize_14,]}>
                                                            {chat.date}
                                                        </Text>
                                                    </View>
                                                    <View style={[styles.overHidden]}>
                                                        <Text style={[styles.FairuzNormal, styles.textSize_14, styles.text_orange, styles.textDir]}>
                                                            {chat.message}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </Animatable.View>
                                    </View>
                                )
                            }
                            )
                            :
                            <Animatable.View animation="zoomIn" easing="ease-out" delay={500} style={[styles.Width_100]}>
                                <View style={[styles.flexCenter, styles.height_full]}>
                                    <Image
                                        style={[styles.width_150, styles.height_150]}
                                        source={require('../../assets/image/empty.png')}
                                        resizeMode='contain'
                                    />
                                </View>
                            </Animatable.View>
                    }

                </View>

            </Content>
        </Container>
    );
}

export default Chat;
