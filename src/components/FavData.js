import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import {
    Icon, Container,
    Content,
    Header,
    Left,
    Right,
    Body,
    Title,
} from 'native-base'
import styles from '../../assets/style';
import * as Animatable from "react-native-animatable";
import { useSelector, useDispatch } from "react-redux";
import { advUser } from "../actions";
import i18n from "../../locale/i18n";


function FavData({ navigation, }) {

    const advFavData = useSelector(state => state.userAds.advFavData ? state.userAds.advFavData : []);
    const token = useSelector(state => state.auth.user ? state.auth.user.token : null);
    const lang = useSelector(state => state.lang.lang);
    const [loaderBlogs, setLoaderBlogs] = useState(true);
    console.log(advFavData);
    const dispatch = useDispatch()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            dispatch(advUser(lang, token)).then(() => { setLoaderBlogs(false); }).catch(() => setLoaderBlogs(false));
        });

        return unsubscribe;
    }, []);


    function noResults() {
        return (
            <View style={[styles.Width_100, styles.bgFullWidth, styles.flexCenter, styles.marginVertical_50]}>
                <Image style={[styles.width_150, styles.height_150]} source={require('../../assets/image/empty.png')} resizeMode={"contain"} />
            </View>
        );
    }


    function renderLoaderBlogs() {
        if (loaderBlogs) {
            return (
                <View style={[styles.position_A, styles.bg_White, styles.flexCenter, styles.right_0, styles.top_0, styles.Width_100, styles.height_full, styles.bgFullWidth, { zIndex: 9999 }]}>
                    <View style={[styles.flexCenter]}>
                        <Animatable.Text animation="fadeIn" easing="ease-out" iterationCount="infinite" style={[styles.flexCenter, Platform.OS === 'android' ? { textAlign: 'center', width: 70, height: 70 } : null]}>
                            <Image
                                style={[styles.width_50, styles.height_50]}
                                source={require('../../assets/image/loading.png')}
                                resizeMode='contain'
                            />
                        </Animatable.Text>
                        <Text style={[styles.FairuzBold, styles.text_default, styles.textSize_16, styles.marginVertical_10]}>
                            {i18n.t('loadIn')}
                        </Text>
                    </View>
                </View>
            );
        }
    }

    return (



        <Container>

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
                        {i18n.t('fav')}
                    </Title>
                </Body>

            </Header>

            <Content contentContainerStyle={styles.bgFullWidth}>
                <View style={[styles.Width_100]}>
                    {renderLoaderBlogs()}
                    {
                        (advFavData.length === 0) ?
                            noResults()
                            :

                            <View style={[styles.rowGroup, styles.paddingHorizontal_5, styles.paddingVertical_10]}>
                                {
                                    advFavData.map((blog) => {
                                        return (
                                            <View style={[styles.overHidden, styles.flex_50, styles.paddingHorizontal_5]}>
                                                <Animatable.View animation="fadeInRight" easing="ease-out" delay={blog.animation} style={[styles.Width_100]}>
                                                    <TouchableOpacity onPress={() => navigation.push('detailsAdv', { blog_id: blog.id })} style={[styles.Width_100, styles.marginVertical_5]}>
                                                        <View style={[styles.bg_White, styles.Width_100, styles.Border, styles.border_dash, styles.overHidden]}>
                                                            <View style={[styles.overHidden, styles.position_R, styles.height_130, styles.Width_100]}>
                                                                <Image
                                                                    style={[styles.Width_100, styles.height_130]}
                                                                    source={{ uri: blog.icon }}
                                                                />
                                                                <Text style={[styles.FairuzBold, styles.paddingHorizontal_10, styles.text_White, styles.textSize_13, styles.position_A, styles.Width_100, styles.right_0, styles.bottom_0, styles.overlay_black]}>
                                                                    {blog.date}
                                                                </Text>
                                                            </View>
                                                            <View style={[styles.paddingHorizontal_5]}>
                                                                <View style={[styles.rowGroup]}>
                                                                    <Text style={[styles.FairuzBold, styles.text_purple, styles.textSize_14]} numberOfLines={1} ellipsizeMode='tail'>
                                                                        {blog.title}
                                                                    </Text>
                                                                </View>
                                                                <View style={[styles.rowGroup, styles.marginVertical_5]}>
                                                                    <Text style={[styles.FairuzBold, styles.text_orange, styles.textSize_13]}>
                                                                        {blog.price}
                                                                    </Text>
                                                                </View>
                                                                <View style={[styles.rowIng]}>
                                                                    <Icon style={[styles.textSize_10, styles.text_bold_gray]} active type="FontAwesome5" name='map-marker-alt' />
                                                                    <Text style={[styles.FairuzBold, styles.text_bold_gray, styles.textSize_13, styles.marginHorizontal_5]}>
                                                                        {blog.country} - {blog.city}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                </Animatable.View>
                                            </View>
                                        )
                                    }
                                    )
                                }
                            </View>
                    }
                </View>
            </Content>
        </Container>
    );
}

export default FavData;
