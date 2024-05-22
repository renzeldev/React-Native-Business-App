import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text, Image, TouchableOpacity, DrawerLayoutAndroid, ImageBackground, ScrollView} from 'react-native';
import Menu from '../../Menu';
import {em} from '../../commonUI/base';
import { TopBar } from '../../commonUI/components/topbar';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Carousel, {Pagination} from 'react-native-snap-carousel';

// import Icon from 'react-native-vector-icons/EvilIcons';
// import Icon from 'react-native-icons';
// import Carousel from 'react-native-snap-carousel';

// const myIcon = ()

class Dashboard extends Component {

    static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}
    constructor(props) {
        super(props) ;
        this.state = {
            entries: [
                {
                    image: require('../../commonUI/icon/preview_09.png'),
                    text: "This is the friendship site.\n" + "You can make friends."     
                },
                {
                    image: require('../../commonUI/icon/preview_10.png'),
                    text: "You can do free chatting like WeChat or WECN."
                },
                {
                    image: require('../../commonUI/icon/preview_11.png'),
                    text: "You can send E-mail when your friend is offline."
                },
                {
                    image: require('../../commonUI/icon/preview_12.png'),
                    text: "You can send voice mail full of your awesome vibration."
                },
            ],
            activeSlide: 0,
        }
    }
    
    _renderItem = ({item, index}) => {
        return (
            
                <View style = {{alignItems:'center', justifyContent:'center', flexDirection: 'column'}}>
                    <Image source = {item.image} style = {{height:250*em, resizeMode:'stretch', width:'100%'}} />
                    <Text style = {{textAlign:'center', color:'white'}}>{ item.text }</Text>
                </View>
            
        );
    } 

    // _renderCarouselItem = ({item, index}) => {
    //     return (
    //         <View style={{}}>
    //             <Text style={{color:'white'}}>{ item.title }</Text>
    //         </View>
    //     );
    // }

    render() {
        return (
            <ImageBackground source={require('../../commonUI/image/header.jpg')} style={{flex:1, width:'100%', height:'100%', resizeMode: 'cover'}}>
                <View style = {{flex:1}}>
                    <TopBar title="Dashboard" onBack={() => {Actions.pop()}}  />
                    <ScrollView scrollEnabled={true} style={{ marginTop: 10*em }}>
                        <View style = {{flexDirection:'column'}}>
                            <View style = {styles.container}>
                                <Text style = {styles.instructions}>
                                    Multi Function & Active Exchange
                                </Text>
                            </View>  
                            <View style = {[styles.container, {backgroundColor:'black', flexDirection:'row', paddingTop:30, paddingBottom:30, paddingRight:20, paddingLeft:20}]}>
                                <ImageSide 
                                    onPress = {() => {}} 
                                    style = {{alignItems:'center', width:'20%'}} 
                                    source = {require('../../commonUI/images/个人中心_图标_我的收件柜.png')} 
                                    title = "Schedule" />
                                <View style = {{width:'60%', alignItems:'center', justifyContent:'center'}}>
                                    <Text style = {{color:'white', textAlign:'center'}}>
                                        {
                                            "Manage your schedules\n" +
                                            "Help you not to forget your schedules\n" +
                                            "Add tasks by yourself\n" +
                                            "Stimulate you to finish\n" +
                                            "Please use"
                                        }
                                    </Text>
                                </View>
                                <ImageSide 
                                    onPress = {() => {}} 
                                    style = {{alignItems:'center', width:'20%'}} 
                                    source = {require('../../commonUI/images/个人中心_图标_在线办理.png')} 
                                    title = "Task" />
                            </View>
                            <View style = {[styles.container, { flexDirection:'column', padding:0}]}>
                                <View style = {{flex:1, flexDirection:'row', height:350*em}}>
                                
                                    <View style = {{ flex:1, flexDirection:'column', backgroundColor:'#f30'}}>
                                        <TouchableOpacity onPress = {() => {Actions.eboard()}} >
                                            <ImageBackground
                                                source = {require('../../commonUI/image/forum.jpg')}
                                                style = {{width:'100%', height:'100%', resizeMode:'cover'}}
                                            >
                                                <ImageSide 
                                                    onPress = {() => {
                                                        this.props.setEboardDefault();
                                                        // this.props.navigation.navigate('eboard');
                                                        Actions.eboard();
                                                    }} 
                                                    titlestyle = {{color:'black'}} 
                                                    style = {{alignItems:'center', }} 
                                                    source = {require('../../commonUI/icon/eboard.png')} 
                                                    />
                                                <Text style = {[styles.textField]}>
                                                    {
                                                        "You can see articles.\n" + 
                                                        "And also you can add article and comments."
                                                    }
                                                </Text>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>
                                    
                                   
                                    <View style = {{flex:1, alignItmes:'center', flexDirection:'column', backgroundColor:'#5d0'}}>
                                        <TouchableOpacity onPress = {() => {Actions.news()}} >
                                            <ImageBackground
                                                source = {require('../../commonUI/image/news-header.jpg')}
                                                style = {{width:'100%', height:'100%', resizeMode:'cover'}}
                                            >
                                                <ImageSide 
                                                    onPress = {() => {Actions.news();}} 
                                                    titlestyle = {{color:'black'}} 
                                                    style = {{alignItems:'center', }} 
                                                    source = {require('../../commonUI/icon/extra/world.png')} 
                                                    />
                                                <Text style = {styles.textField}>
                                                    {
                                                        "You can see recent affairs and news.\n"
                                                    }
                                                </Text>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>
                                   
                                </View>
                                <View style = {{flex:1, flexDirection:'row', height:350*em}}>
                                    
                                
                                    <View style = {{ flex:1, flexDirection:'column', alignItems:'center', backgroundColor:'#0bd'}}>
                                        <TouchableOpacity onPress = {() => {Actions.service()}} >
                                            <ImageBackground 
                                                source = {require('../../commonUI/image/shop.jpg')}
                                                style = {{width:'100%', height:'100%', resizeMode:'cover'}}
                                            >
                                                <ImageSide 
                                                    onPress = {() => {
                                                        Actions.service();
                                                    }} 
                                                    titlestyle = {{color:'black'}} 
                                                    style = {{alignItems:'center', }} 
                                                    source = {require('../../commonUI/icon/extra/shoppingbasket.png')} 
                                                    />
                                                <Text style = {styles.textField}>
                                                    {
                                                        "You can get service\n" + 
                                                        "including software and delivery."
                                                    }
                                                </Text>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>
                                    
                                   
                                    <View style = {{flex:1, alignItmes:'center', flexDirection:'column', backgroundColor:'#d90'}}>
                                        <TouchableOpacity onPress = {() => {Actions.question()}}>
                                            <ImageBackground 
                                                source = {require('../../commonUI/image/common.jpg')}
                                                style = {{width:'100%', height:'100%', resizeMode:'cover'}}
                                            >
                                                <ImageSide 
                                                    onPress = {() => {Actions.question()}}
                                                    titlestyle = {{color:'black'}} 
                                                    style = {{alignItems:'center', }} 
                                                    source = {require('../../commonUI/icon/question.png')} 
                                                    />
                                                <Text style = {styles.textField}>
                                                    {
                                                        "If there is any question or problem,\n" + 
                                                        "please raise at any time you want."
                                                    }
                                                </Text>
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>
                                    
                                </View>
                            </View>
                            <View style = {[styles.container, {backgroundColor:'black', flexDirection:'row', padding:20}]}>
                                <ImageSide 
                                    onPress = {() => {Actions.friend();}} 
                                    style = {{alignItems:'center', padding:20}} 
                                    source = {require('../../commonUI/icon/extra/group.png')} 
                                    title = "Friendship" />
                                
                                <View style = {{flex:4, flexDirection:'column'}}>
                                    <Carousel
                                        // style = {{alignItems:'center'}}
                                        ref={(c) => { this._carousel = c; }}
                                        data={this.state.entries}
                                        renderItem={this._renderItem}
                                        sliderWidth={500*em}
                                        itemWidth={500*em}
                                        autoplay = {true}
                                        autoplayDelay = {2000}
                                        autoplayInterval = {3000}
                                        loop = {true}
                                        // swipeThreshold = {1}
                                        loopClonesPerSide = {this.state.entries.length}
                                        // enableMomentum = {false}
                                        // lockScrollWhileSnapping = {true}
                                        onSnapToItem={(index) => this.setState({ activeSlide: index })}
                                    />
                                    <Pagination 
                                        dotsLength={this.state.entries.length}
                                        activeDotIndex={this.state.activeSlide}
                                        containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
                                        dotStyle={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: 5,
                                            marginHorizontal: 4,
                                            backgroundColor: 'rgba(255, 255, 255, 0.92)'
                                        }}
                                        inactiveDotStyle={{
                                            // Define styles for inactive dots here
                                        }}
                                        inactiveDotOpacity={0.4}
                                        inactiveDotScale={0.6}
                                    />
                                </View>
                            </View> 
                            <View style = {{flex:1}}>
                                
                                {/* <Icon
                                name='fontawesome|facebook-square'
                                size={70}
                                color='#3b5998'
                                /> */}
                            </View> 
                            <View style = {styles.container, {backgroundColor:'transparent', flexDirection:'row'}}> 
                                <ImageSide 
                                    onPress = {() => {}} 
                                    style = {{alignItems:'center', width:'20%'}} 
                                    source = {require('../../commonUI/icon/twitter.png')} 
                                    title = "Twitter" />
                                <ImageSide 
                                    onPress = {() => {}} 
                                    style = {{alignItems:'center', width:'20%'}} 
                                    source = {require('../../commonUI/icon/youtube.png')} 
                                    title = "YouTube" />
                                <ImageSide 
                                    onPress = {() => {}} 
                                    style = {{alignItems:'center', width:'20%'}} 
                                    source = {require('../../commonUI/icon/facebook.png')} 
                                    title = "Facebook" />
                                <ImageSide 
                                    onPress = {() => {}} 
                                    style = {{alignItems:'center', width:'20%'}} 
                                    source = {require('../../commonUI/icon/linkedin.png')} 
                                    title = "Linkedin" />
                            </View> 
                        </View>
                    </ScrollView>
                    
                </View>
                
            </ImageBackground>
        )
    }
}

class ImageSide extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            
                <View style = {[styles.imageside, this.props.style]}>
                    <TouchableOpacity onPress = {this.props.onPress}>
                        <View style = {[ { alignItems:'center'}]}>
                            <Image source = {this.props.source} style = {{ resizeMode:'cover',  borderRadius:5, width:80*em, height:80*em}} />
                        </View>
                    
                        {this.props.title ? (
                            <Text style = {[{color:'white', marginTop:5, textAlign:'center'}, this.props.titlestyle]}>
                                {this.props.title}
                            </Text>
                        ) : (
                            null
                        )}
                    </TouchableOpacity>
                </View>
            
        )
    }
}

const styles = StyleSheet.create({
	container: {
      flex: 1,
	  // justifyContent: 'center',
	  // backgroundColor: '#F5FCFF'
	},
	instructions: {
        fontSize:25, 
        color:'white', 
        justifyContent:'center', 
        padding:20, 
        marginTop:50, 
        marginBottom:50
    },
    
    imageside: {
        flex:1,
        marginTop:30,
        marginBottom:30,
        alignItems:'center',
        flexDirection:'column'
        // width:'20%',
        // height: 100,
        // padding:'auto',
    },
  
	inputform: {
	  marginTop: 50*em,
	  flex:1,
	  justifyContent:'center'
	}, 
  
	buttontext: {
	  textAlign:'center', 
	  margin:5, 
	  padding:3, 
	  color:'white', 
	  borderWidth:1, 
	  borderColor:'#ccc' ,
	  alignItems:'center'
    },
    
    textField: {
        flex:1, 
        color:'white', 
        textAlign:'center',
        padding:10,
        backgroundColor:'rgba(0,0,0,0.8)'
    }
});

const  mapStateToProps = (state) => ({
    eboard: state.eboard
})

const mapDispatchToProps = {
    setEboardDefault: () => { return { type: 'DEFAULT_SETTING' } }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);