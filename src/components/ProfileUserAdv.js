import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Animated, Linking, ActivityIndicator,
} from "react-native";
import {
    Container,
    Content,
    Header,
    Left,
    Right,
    Body,
    Title,
    Item,
    Input,
    Icon, Toast
} from 'native-base'
import styles from '../../assets/style';
import i18n from "../../locale/i18n";
import * as Animatable from 'react-native-animatable';

import { useSelector, useDispatch } from 'react-redux';
import { notifyStatus, providerData, rateUser } from '../actions';
import StarRating from 'react-native-star-rating';

import ItemsAdv from '../components/ItemsAdvUser'
import Loading from "../components/Loading";

function ProfileUserAdv({ navigation, route }) {

    const lang = useSelector(state => state.lang.lang);
    const [provider_id] = useState(route.params.provider_id);
    const [blogId] = useState(route.params.blogId);
    const [loader, setLoader] = useState(true);
    const proData = useSelector(state => state.dataUser.proData ? state.dataUser.proData : null);
    const token = useSelector(state => state.auth.user ? state.auth.user.token : null);
    const auth = useSelector(state => state.auth.user ? state.auth.user : null);
    const [active, setActive] = useState(1);
    const [rating, setRating] = useState(0);
    const [userId, setUserId] = useState(route.params.id);
    const dispatch = useDispatch();

    function fetchData() {
        dispatch(providerData(provider_id, lang)).then(() => { setRating(proData.user.rate); setLoader(false) }

        ).catch(() => setLoader(false));

    }

    useEffect(() => {
        fetchData();
    }, []);

    function setAct(num) {
        setActive(num);
    }

    function toggleRating(num) {
        if (auth) {
            setRating(num);
            dispatch(rateUser(token, userId, num, lang));
        } else {
            navigation.navigate('login');
            Toast.show({
                text: i18n.t('chickLogin'),
                type: "danger",
                duration: 3000,
                textStyle: {
                    color: "white",
                    fontFamily: 'FairuzBlack',
                    textAlign: 'center'
                }
            });
        }
    }

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
                    <TouchableOpacity style={[styles.Button]} transparent onPress={() => navigation.goBack()}>
                        <Image
                            style={[styles.width_25, styles.height_25]}
                            source={require('../../assets/image/right.png')}
                        />
                    </TouchableOpacity>
                </Left>
                <Body style={[styles.bodyText]}>
                    <Title style={[styles.FairuzBold, styles.text_default, styles.textSize_18,]}>
                        {proData ? proData.user.name : i18n.t('deadv')}
                    </Title>
                </Body>
            </Header>

            <Content contentContainerStyle={styles.bgFullWidth}>

                {
                    proData ?
                        <View style={[]}>

                            <View style={[styles.rowGroup, styles.paddingHorizontal_5, styles.paddingVertical_10, styles.bg_default]}>
                                <View style={[styles.overHidden]}>
                                    <View style={[styles.Width_100, styles.flexCenter]}>
                                        <View style={[styles.Width_100, styles.rowIng, styles.overHidden]}>
                                            <View style={[styles.overHidden, styles.flex_30, styles.flexCenter]}>
                                                <Image
                                                    style={[styles.width_80, styles.height_80, styles.Radius_50, styles.Border_2, styles.border_orange]}
                                                    source={{ uri: proData.user.avatar }}
                                                />
                                            </View>
                                            <View style={[styles.flex_70, styles.paddingHorizontal_5]}>
                                                <View style={[styles.rowGroup]}>
                                                    <Text style={[styles.FairuzBold, styles.text_White, styles.textSize_14, styles.textDir]} numberOfLines={1} ellipsizeMode='tail'>
                                                        {proData.user.name}
                                                    </Text>
                                                </View>
                                                <View style={[styles.rowIng]}>
                                                    <StarRating
                                                        emptyStar={'ios-star-outline'}
                                                        fullStar={'ios-star'}
                                                        halfStar={'ios-star-half'}
                                                        iconSet={'Ionicons'}
                                                        maxStars={5}
                                                        starSize={15}
                                                        rating={rating}
                                                        fullStarColor={'#DAA520'}
                                                        selectedStar={(rating) => toggleRating(rating)}
                                                        starStyle={styles.starStyle}
                                                    />
                                                </View>
                                                {/*<View style={[ styles.rowIng ]}>*/}
                                                {/*    <Icon style={[styles.textSize_10, styles.text_bold_gray ]} active type="FontAwesome5" name='phone'/>*/}
                                                {/*    <Text style={[styles.FairuzBold , styles.text_bold_gray, styles.textSize_13, styles.marginHorizontal_5]}>*/}
                                                {/*        { proData.user.phone }*/}
                                                {/*    </Text>*/}
                                                {/*</View>*/}
                                                {/*<View style={[ styles.rowIng ]}>*/}
                                                {/*    <Icon style={[styles.textSize_10, styles.text_bold_gray ]} active type="MaterialCommunityIcons" name='email'/>*/}
                                                {/*    <Text style={[styles.FairuzBold , styles.text_bold_gray, styles.textSize_13, styles.marginHorizontal_5]}>*/}
                                                {/*        { proData.user.email }*/}
                                                {/*    </Text>*/}
                                                {/*</View>*/}
                                                <View style={[styles.rowIng]}>
                                                    <View style={[styles.rowIng]}>
                                                        <Icon style={[styles.textSize_10, styles.text_orange]} active type="Feather" name='map-pin' />
                                                        <Text style={[styles.FairuzBold, styles.text_White, styles.textSize_13, styles.marginHorizontal_5]}>
                                                            {proData.user.country}
                                                        </Text>
                                                    </View>
                                                    <View style={[styles.rowIng]}>
                                                        <Icon style={[styles.textSize_10, styles.text_orange]} active type="Feather" name='map-pin' />
                                                        <Text style={[styles.FairuzBold, styles.text_White, styles.textSize_13, styles.marginHorizontal_5]}>
                                                            {proData.user.city}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={[styles.rowCenter, styles.Width_100, styles.marginVertical_10, styles.paddingHorizontal_10, styles.marginVertical_25]}>

                                    <TouchableOpacity
                                        // style       = {[ styles.width_80, styles.height_50, styles.Radius_5, styles.flexCenter, styles.marginHorizontal_15, styles.paddingHorizontal_5, { backgroundColor : '#00AFF0'} ]}
                                        style={[styles.width_80, styles.height_50, styles.Radius_10, styles.flexCenter, styles.marginHorizontal_15, styles.paddingHorizontal_5, styles.border_orange, styles.Border]}
                                        onPress={() => { Linking.openURL('tel://' + proData.user.phone) }}
                                    >
                                        <Image
                                            style={[styles.width_20, styles.width_20]}
                                            source={require('../../assets/image/icon/phone_call.png')}
                                            resizeMode={'contain'}
                                        />
                                    </TouchableOpacity>

                                    {
                                        auth ?
                                            <TouchableOpacity
                                                // style       = {[ styles.width_80, styles.height_50, styles.Radius_5, styles.flexCenter, styles.marginHorizontal_15, styles.paddingHorizontal_5, { backgroundColor : '#dd4b39'} ]}
                                                style={[styles.width_80, styles.height_50, styles.Radius_10, styles.flexCenter, styles.marginHorizontal_15, styles.paddingHorizontal_5, styles.border_orange, styles.Border]}
                                                onPress={() => navigation.push('chatRoom', {
                                                    userId: proData.user.id,
                                                    blogId: blogId,
                                                    name: proData.user.name,
                                                    image: proData.user.avatar,
                                                })}
                                            >
                                                <Image
                                                    style={[styles.width_20, styles.width_20]}
                                                    source={require('../../assets/image/icon/comments.png')}
                                                    resizeMode={'contain'}
                                                />
                                            </TouchableOpacity>
                                            :
                                            <View />
                                    }

                                    <TouchableOpacity
                                        // style       = {[ styles.width_80, styles.height_50, styles.Radius_5, styles.flexCenter, styles.marginHorizontal_15, styles.paddingHorizontal_5, { backgroundColor : '#25D366'} ]}
                                        style={[styles.width_80, styles.height_50, styles.Radius_10, styles.flexCenter, styles.marginHorizontal_15, styles.paddingHorizontal_5, styles.border_orange, styles.Border]}
                                        onPress={() => { Linking.openURL('http://api.whatsapp.com/send?phone=' + proData.user.phone) }}
                                    >
                                        <Image
                                            style={[styles.width_20, styles.width_20]}
                                            source={require('../../assets/image/icon/whatsapp.png')}
                                            resizeMode={'contain'}
                                        />
                                    </TouchableOpacity>

                                </View>

                            </View>

                            <View style={[styles.rowGroup, styles.bg_orange, styles.paddingVertical_15, { alignItems: 'center', justifyContent: 'center' }]}>
                                <Text style={{ color: 'white', fontFamily: 'FairuzBlack', }}>{i18n.t('AdvAdmin')}</Text>
                                {/* <TouchableOpacity
                                    onPress={() => setAct(1)}
                                    style={[styles.flex_50, styles.flexCenter]}
                                >
                                    <Image
                                        source={active === 1 ?
                                            require('../../assets/image/iconTap/three_lightbrown.png')
                                            :
                                            require('../../assets/image/iconTap/marketing_yellow_brbul.png')}
                                        style={[styles.width_30, styles.height_30]}
                                        resizeMode={'contain'}
                                    />
                                </TouchableOpacity> */}
                                {/* <TouchableOpacity
                                    onPress={() => setAct(2)}
                                    style={[styles.flex_50, styles.flexCenter]}
                                >
                                    <Image
                                        source={active === 2 ?
                                            require('../../assets/image/iconTap/one_lightbrown.png')
                                            :
                                            require('../../assets/image/iconTap/Advertising_brbul.png')}
                                        style={[styles.width_30, styles.height_30]}
                                        resizeMode={'contain'}
                                    />
                                </TouchableOpacity> */}
                            </View>

                            <View style={[styles.flexCenter, styles.position_R, styles.Width_100]}>

                                {
                                    // active === 1 ?
                                    <ItemsAdv item={proData.ads} navigation={navigation} value={'advData'} />
                                    // : active === 2 ?
                                    //     <ItemsAdv item={proData.photoAds} navigation={navigation} value={'advPhotoData'} />
                                    //     :
                                    //     <View />
                                }

                            </View>

                        </View>
                        :
                        <View />
                }

            </Content>
        </Container>
    );
}

export default ProfileUserAdv;
