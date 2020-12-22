import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator,
    Keyboard,
    I18nManager
} from "react-native";
import { Container, Content, Header, Button, Left, Textarea, Body, Title, Icon, Right } from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import * as Animatable from 'react-native-animatable';
import { useSelector, useDispatch } from 'react-redux';
import { inboxChat, sendMessage } from '../actions';
import Modal from "react-native-modal";
import * as Notifications from "expo-notifications";

function ChatRoom({ navigation, route }) {

    const scrollViewRef = useRef();
    const lang = useSelector(state => state.lang.lang);
    const token = useSelector(state => state.auth.user.token);
    const inChat = useSelector(state => state.dataChat.inChat ? state.dataChat.inChat : []);
    // const [inNewChat, setInNewChat] = useState(inChat);
    const [message, setMessage] = useState('');
    const [messageErr, setMessageErr] = useState('');
    const [loadChat, setLoadChat] = useState(false);
    const [errFun, setErrFun] = useState(false);
    const [viewLoader, setViewLoader] = useState(true);
    const [inputStatus, setInputStatus] = useState(false);
    const [userId] = useState(route.params.userId);
    const [advId] = useState(route.params.blogId);
    const [name] = useState(route.params.name);
    const [image] = useState(route.params.image);
    const [arrOF, setArrOF] = useState();
    const dispatch = useDispatch();

    function handleNotification(notification) {
        console.log('data', notification.request.content.data);

        const type = notification.request.content.data.type;

        if (type == 1) {
            dispatch(inboxChat(token, userId, advId, lang), () => setArrOF(inChat));
        }

    }

    useEffect(() => {

        Notifications.addNotificationReceivedListener(handleNotification);

    }, []);

    useEffect(() => {

        setViewLoader(true);

        const unsubscribe = navigation.addListener('focus', () => {
            setViewLoader(true);
            dispatch(inboxChat(token, userId, advId, lang), () => setArrOF(inChat)).then(() => { setViewLoader(false) }).catch(() => setViewLoader(false));
        });

        return unsubscribe;
    }, [navigation, route]);

    function sentMass() {
        if (message.length <= 0) {
            setMessageErr(i18n.t('mass'))
        } else {
            setMessageErr('');
            setLoadChat(true);
            const today = new Date();
            const date = today.getHours() + ":" + today.getMinutes();
            const newMass = { date, message };
            dispatch(sendMessage(token, userId, advId, message, lang)).then(() => {
                setErrFun(false);
                setLoadChat(false);
                inChat.push(newMass);
                setMessage('');
                Keyboard.dismiss();
            }).catch(() => {
                setErrFun(true);
                setLoadChat(false);
                Keyboard.dismiss();
            });
        }
    }

    function activeInput() {

        setInputStatus(true)

    }

    function unActiveInput() {

        setInputStatus(false)

    }

    function renderLoader() {
        if (viewLoader) {
            return (
                <View style={[styles.position_A, styles.bg_White, styles.flexCenter, styles.right_0, styles.top_0, styles.Width_100, styles.height_full, { zIndex: 9999 }]}>
                    <Animatable.Text animation="fadeIn" easing="ease-out" iterationCount="infinite" style={[styles.flexCenter, Platform.OS === 'android' ? { textAlign: 'center', width: 70, height: 70 } : null]}>
                        <Image
                            style={[styles.width_50, styles.height_50]}
                            source={require('../../assets/image/loading.png')}
                            resizeMode='stretch'
                        />
                    </Animatable.Text>
                    <Text style={[styles.FairuzBold, styles.text_default, styles.textSize_18, styles.marginTop_15]}>
                        {i18n.t('allch')}
                    </Text>
                </View>
            );
        }
    }

    return (

        <Container>

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
                        {name}
                    </Title>
                </Body>
                <Right style={[styles.leftIcon]}>
                    <TouchableOpacity style={[styles.Button, lang === 'en' ? { transform: [{ rotate: "180deg" }] } : null]} transparent onPress={() => navigation.navigate('profileUserAdv', { provider_id: userId, blogId: advId, id: userId })}>
                        <Image
                            style={[styles.width_25, styles.height_25]}
                            source={require('../../assets/image/iconHead/info.png')}
                        />
                    </TouchableOpacity>
                </Right>
            </Header>

            <KeyboardAvoidingView behavior="height" style={[styles.flex_1]} >
                {/*<View contentContainerStyle={[styles.bgFullWidth, styles.position_R, styles.paddingHorizontal_10, styles.paddingVertical_10, styles.bg_dash]}>*/}

                {inChat && inChat.length !== 0 ?

                    <ScrollView style={[styles.Width_100, styles.bg_White, styles.Radius_10, { height: 400 }]} ref={scrollViewRef} onContentSizeChange={(contentWidth, contentHeight) => { scrollViewRef.current.scrollToEnd({ animated: true }) }}>
                        <View style={[styles.Width_100, styles.paddingHorizontal_10, { paddingBottom: 100 }]}>

                            {
                                inChat.map((chat) => {
                                    return (
                                        <View>
                                            {
                                                chat.sender === 0 ?
                                                    <View style={[styles.Width_100, styles.rowIng, styles.overHidden, styles.marginVertical_10]}>
                                                        <View style={[styles.flex_80]}>
                                                            <View style={[styles.paddingVertical_10, styles.rowLeft, { flexDirection: 'column' }, styles.paddingHorizontal_20, styles.Radius_30, styles.bg_orange, { borderTopRightRadius: 0 },]}>
                                                                <Text style={[styles.FairuzBold, styles.text_default, styles.textSize_14, styles.textDir]}>
                                                                    {chat.message}
                                                                </Text>
                                                                <View style={[styles.rowLeft]}>
                                                                    <Text style={[styles.text_orange, styles.FairuzBold, styles.textSize_12, styles.textDir]}>{chat.date}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={[styles.flex_20, styles.flexCenter]}>
                                                            <Image
                                                                style={[styles.width_50, styles.height_50, styles.Radius_50, styles.Border, styles.border_orange]}
                                                                source={{ uri: image }}
                                                            />
                                                        </View>
                                                    </View>
                                                    :
                                                    <View style={[styles.Width_100, styles.overHidden, styles.marginVertical_10]}>
                                                        <View style={[styles.Width_100]}>
                                                            <View style={[styles.paddingVertical_10, styles.rowRight, { flexDirection: 'column' }, styles.paddingHorizontal_20, styles.Radius_30, setErrFun ? styles.bg_default_2 : styles.bg_red, { borderBottomLeftRadius: 0 }]}>
                                                                <Text style={[styles.FairuzBold, styles.text_default, styles.textSize_14, styles.textDir]}>
                                                                    {chat.message}
                                                                </Text>
                                                                <View style={[styles.rowLeft]}>
                                                                    <Icon style={[styles.textSize_15, styles.marginHorizontal_5, chat.seen === 1 ? styles.text_default : styles.text_White]} active type="MaterialCommunityIcons" name={chat.seen === 1 ? 'check-all' : 'check'} />
                                                                    <Text style={[styles.text_default, styles.FairuzBold, styles.textSize_12, styles.textDir]}>{chat.date}</Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                            }
                                        </View>
                                    )
                                })
                            }

                        </View>
                    </ScrollView>

                    :

                    <Animatable.View animation="fadeInUp" easing="ease-out" delay={500} style={[styles.Width_100,]}>
                        <View style={[styles.flexCenter, styles.height_full]}>
                            <Image
                                style={[styles.width_150, styles.height_150]}
                                source={require('../../assets/image/empty.png')}
                            />
                            <Text
                                style={[styles.FairuzBold, styles.text_default, styles.textSize_15, styles.textCenter]}>
                                {i18n.t('nochto')}
                            </Text>
                        </View>
                    </Animatable.View>
                }

                <Modal isVisible={errFun} style={[styles.bottomCenter, styles.Width_100]}>
                    <View style={[styles.overHidden, styles.bg_White, styles.Width_100, styles.position_R, styles.top_20, { borderTopLeftRadius: 30, borderTopRightRadius: 30 }]}>

                        <View style={[styles.borderBottom, styles.border_light_gray, styles.paddingVertical_15, styles.bg_default]}>
                            <Text style={[styles.FairuzBlack, styles.text_White, styles.textSize_14, styles.textCenter]}>
                                {i18n.t('err')}
                            </Text>
                        </View>

                        <View style={[styles.paddingHorizontal_10, styles.marginVertical_10]}>

                            <View style={[styles.borderBottom, styles.border_light_gray, styles.paddingVertical_15]}>

                                <Animatable.View animation="shake" easing="ease-out" delay={500} style={[styles.Width_100]}>
                                    <View style={[styles.flexCenter, styles.Width_100, styles.marginVertical_10]}>
                                        <Image
                                            style={[styles.width_120, styles.height_120]}
                                            source={require('../../assets/image/Err.png')}
                                            resizeMode='contain'
                                        />
                                    </View>
                                </Animatable.View>

                                <Text style={[styles.FairuzBlack, styles.text_red, styles.textSize_14, styles.textCenter, styles.marginVertical_15]}>
                                    {i18n.t('errT')}
                                </Text>

                                <TouchableOpacity
                                    style={[styles.bg_default, styles.marginVertical_10, styles.width_200, styles.height_50, styles.flexCenter]}
                                    onPress={() => setErrFun(false)}
                                >
                                    <Text style={[styles.FairuzBold, styles.textSize_15, styles.text_White]}>
                                        {i18n.t('close')}
                                    </Text>
                                </TouchableOpacity>

                            </View>

                        </View>

                    </View>
                </Modal>

                {/*</View>*/}

                <View style={[styles.Width_100, styles.rowGroup, styles.paddingHorizontal_5, styles.bg_White, styles.paddingVertical_10, styles.position_A, styles.right_0, inputStatus ? styles.bottom_20 : styles.bottom_0]}>
                    <View style={[styles.flex_85]}>
                        <Text style={[styles.text_red, styles.textSize_10, styles.FairuzBold, styles.textDir, styles.paddingHorizontal_10]}>{messageErr}</Text>
                        <Textarea
                            placeholder={i18n.t('mass')}
                            placeholderTextColor={[styles.text_black]}
                            onChangeText={(message) => setMessage(message)}
                            onBlur={() => unActiveInput()}
                            onFocus={() => activeInput()}
                            value={message}
                            style={[styles.paddingHorizontal_30, styles.Radius_10, styles.height_50, styles.FairuzBold, styles.textDir, styles.text_black, styles.bg_dash]}
                        />
                    </View>
                    <View style={[styles.flex_15, styles.flexCenter]}>
                        <TouchableOpacity
                            onPress={!loadChat ? () => sentMass() : null}
                            style={[styles.width_40, styles.height_40, styles.flexCenter, styles.Radius_30, styles.bg_orange, styles.marginTop_10]}>
                            {
                                loadChat ?
                                    <ActivityIndicator size="small" color="#565756" />
                                    :
                                    <Icon style={[styles.text_default, styles.textSize_20]} type="Ionicons" name='paper-plane' />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

        </Container>
    );
}

export default ChatRoom;
