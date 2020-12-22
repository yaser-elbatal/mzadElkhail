import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, RefreshControl } from "react-native";
import { Container, Content, Header, Left, Body, Title, Icon } from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import * as Animatable from 'react-native-animatable';
import { useSelector, useDispatch } from 'react-redux';
import { allChat, allNotifications, inboxChat, removeNotifications } from '../actions';
import Loading from "../components/Loading";
import * as Notifications from "expo-notifications";

function Notification({ navigation }) {

    const lang = useSelector(state => state.lang.lang);
    const notifications = useSelector(state => state.article.notifications ? state.article.notifications : []);
    const token = useSelector(state => state.auth.user ? state.auth.user.token : null);
    const [loader, setLoader] = useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const dispatch = useDispatch();

    function handleNotification(notification) {

        const type = notification.request.content.data.type;

        if (type == 2 || type == 3) {
            dispatch(allNotifications(token, lang)).then(() => setLoader(false)).catch(() => setLoader(false));
        }

    }

    useEffect(() => {

        Notifications.addNotificationReceivedListener(handleNotification);

    }, []);

    const onRefresh = React.useCallback(() => {
        dispatch(allNotifications(token, lang)).then(() => setLoader(false)).catch(() => setLoader(false));
    }, []);

    function fetchData() {
        dispatch(allNotifications(token, lang)).then(() => setLoader(false)).catch(() => setLoader(false));
    }

    function removeNoty(id) {
        setLoader(true);
        dispatch(removeNotifications(token, id, lang)).then(() => {
            setLoader(false);
            fetchData();
        }).catch(() => setLoader(false));
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
                        {i18n.t('Notifications')}
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
                }
            >

                <View style={[styles.Width_100, styles.paddingHorizontal_10, styles.paddingVertical_15]}>

                    {
                        notifications.length !== 0 ?
                            notifications.map((noty) => {
                                return (
                                    <View style={[styles.Width_100, styles.overHidden, styles.paddingHorizontal_5]}>
                                        <Animatable.View animation="fadeInUp" easing="ease-out" delay={500} style={[styles.Width_100, styles.position_R]}>
                                            <TouchableOpacity
                                                onPress={() => navigation.push('detailsAdv', {
                                                    blog_id: noty.ad_id,
                                                    comment_id: noty.comment_id
                                                })}
                                                style={[styles.paddingVertical_15, styles.bg_White, styles.Radius_10, styles.paddingHorizontal_10, styles.marginVertical_10, styles.Border, styles.border_dash, styles.position_R, { borderLeftWidth: 7, borderLeftColor: '#434343' }]}>
                                                <TouchableOpacity
                                                    onPress={() => removeNoty(noty.id)}
                                                    style={[styles.position_A, styles.bg_red, styles.Radius_50, styles.width_25, styles.height_25, styles.flexCenter, { top: -10, right: -6 }]}>
                                                    <Icon
                                                        style={[styles.textSize_13, styles.text_default_2]}
                                                        type="AntDesign"
                                                        name='close'
                                                    />
                                                </TouchableOpacity>
                                                <Text style={[styles.textSize_16, styles.FairuzNormal, styles.text_default_2, styles.textDir]}>
                                                    {noty.message}
                                                </Text>
                                                <View style={[styles.Width_100]}>
                                                    <Text style={[styles.textSize_16, styles.FairuzNormal, styles.text_orange, styles.textRight]}>
                                                        {noty.date}
                                                    </Text>
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

export default Notification;
