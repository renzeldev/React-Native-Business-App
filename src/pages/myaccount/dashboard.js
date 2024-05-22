import React, {Component} from 'react'
import {View, Text, ImageBackground, Image, FlatList, TouchableOpacity, ScrollView, Alert} from 'react-native'
import {connect} from 'react-redux'

import {W, H, em, colors} from '../../commonUI/base'
import {textStyles} from '../../commonUI/styles'
import {API_BASE_URL, DASHBOARD_FAVORITE_LINKS, DASHBOARD_LINKS} from "../../config"
import {SecondaryButton} from '../../commonUI/components/buttons'
import {unsetLoggedUser} from '../../store/actions/auth'
import setAuthToken from '../../store/utils/setAuthToken';
import {setCurrentUser} from '../../store/actions/authActions'
import {Actions} from 'react-native-router-flux'

class Scene extends Component {
  static navigationOptions = {
    headerStyle: {
      display: 'none'
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
    
  }
  componentWillMount() {
    if(!this.props.auth.isAuthenticated) {
      
    } 
    // Alert.alert(this.props.auth.user.name);
  }

  render() {
    const {user} = this.props.auth;
    return (
      <View>
        <HeaderBar userName={user.name} userPhotoUri={user.user_photo_uri} logout={this.logout.bind(this)}/>
        <FeatureLinks navigation={this.props.navigation}/>
        <PageLinksList navigation={this.props.navigation}/>
        <BottomBar/>
      </View>
    )
  }
  logout() {
    setAuthToken({});
    this.props.setCurrentUser({});
    Actions.home();
    // this.props.navigation.navigate('login')
    // setTimeout(()=>{this.props.unsetLoggedUser()}, 20)
  }
}
const mapStateToProps = (state) => ({
  auth:state.auth
})

const mapDispatchToProps = {
  setCurrentUser : (data) => setCurrentUser(data)
}

export default connect(mapStateToProps, mapDispatchToProps)(Scene)

class HeaderBar extends Component {
  render() {
    const userPhotoUri = API_BASE_URL+'user_photos/'+this.props.userPhotoUri
    const {userName} = this.props
    return (
      <View style={{
        width: 720*em, height: 240*em,
        justifyContent: 'center', alignItems: 'center'
      }}>
        <ImageBackground source={require('../../commonUI/images/内页_头部背景.png')} style={{
          width: '100%', height: '100%',
        }}>
          <View style={{
            marginTop: 30*em, marginLeft: 30*em, marginRight: 30*em, marginBottom: 20*em,
            flexDirection: 'row', flexWrap: 'nowrap',
            justifyContent: 'space-between'}}>
            <View style={{
              flexDirection: 'row'
            }}>
              <Image source={{uri:userPhotoUri}} style={{
                width: 110*em, height: 110*em,
              }}/>
              <Text style={{
                fontSize: 30*em, fontWeight: 'bold', color:colors.white,
                marginTop: 30*em, marginLeft: 15*em
              }}>{userName}</Text>
            </View>
            <View style={{
              marginTop: 25*em
            }}>
              <SecondaryButton title='退出' buttonStyle={{
                backgroundColor:'transparent', borderColor: colors.white, height: 50*em
              }} inputStyle={{color: colors.white}} onPress={this.logout.bind(this)}/>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }
  logout() {
    this.props.logout()
  }
}

class FeatureLinks extends Component {
  render() {
    return (
      <View style={{
        paddingTop: 30*em, paddingLeft: 20*em, paddingRight: 20*em, paddingBottom: 20*em,
        marginTop: -60*em, marginLeft: 30*em, marginRight: 30*em,
        backgroundColor: colors.white,
        borderRadius: 5, borderWidth: 1, borderColor: '#ccc'
      }}>
        <FlatList data={DASHBOARD_FAVORITE_LINKS} keyExtractor={(item) => item.title} renderItem={this.renderItem} horizontal={true}/>
      </View>
    )
  }
  renderItem = ({item, index}) => {
    return (
      <View style={{
        width: 155*em,
        alignItems: 'center'
      }}>
        <TouchableOpacity onPress={this.onClickLink.bind(this, item.route)} style={{
          alignItems: 'center'
        }}>
          <Image source={item.image} style={{width: 66*em, height: 54*em}}/>
          <Text>{item.title}</Text>
        </TouchableOpacity>
      </View>
    )
  }
  onClickLink(route) {

    this.props.navigation.navigate(route)
  }
}

class PageLinksList extends Component {
  render() {
    return (
      <ScrollView scrollEnabled={true} style={{
        height: H-255,
        marginTop: 10*em,
      }}>
        {DASHBOARD_LINKS.map((groupData, i) => (
          <PageLinksGroup groupData={groupData} key={'page-links-group'+i} navigation={this.props.navigation}/>
        ))}
      </ScrollView>
    )
  }
}

class PageLinksGroup extends Component {
  render() {
    const {groupData} = this.props
    return (
      <View style={{
        marginBottom: 10*em,
        borderTopWidth: 1, borderColor: '#ccc'
      }}>
        <FlatList data={groupData} keyExtractor={(item) => item.title} renderItem={this.renderItem}/>

      </View>
    )
  }
  renderItem = ({item, index}) =>{
    return (
      <View style={{
        paddingTop: 25*em, paddingBottom: 25*em, paddingLeft: 30*em, paddingRight: 30*em,
        borderBottomWidth: 1, borderColor: '#ccc',
        backgroundColor: '#fff'
      }}>
        <View style={{
          flexDirection: 'row',
          flexWrap: 'nowrap',
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity style={{
            flexDirection: 'row',
          }} onPress={this.onClickLink.bind(this, item.route)}>
            <Image source={item.image} style={{width: 50*em, height: 50*em,}}/>
            <Text style={{
              fontSize: 30*em, height: 50*em, lineHeight: 50*em,
              color: '#333',
              marginLeft: 10*em
            }}>{item.title}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            height: 50*em, justifyContent: 'center'
          }} onPress={this.onClickLink.bind(this, item.route)}>
            <Image source={require('../../commonUI/images/注册_图标_导向.png')} style={{
              width: 16*em, height: 28*em
            }}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  onClickLink(route) {
    this.props.navigation.navigate(route)
  }
}

class BottomBar extends Component {
  render() {
    return (
      <View style={{
        marginTop: -30*em,
        position: 'relative'
      }}>
        <ImageBackground source={require('../../commonUI/images/个人中心首页_bottom.png')} style={{
          width: 720*em, height: 150*em
        }}>
          <TouchableOpacity style={{
            alignItems: 'center',
            position: 'absolute', left: 120*em, top: 57*em
          }}>
            <Image source={require('../../commonUI/images/个人中心_图标_我的_未选择状态.png')} style={{width: 44*em, height: 44*em}}/>
            <Text>首页</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            alignItems: 'center',
            position: 'absolute', left: 305*em, top: 13*em
          }}>
            <Image source={require('../../commonUI/images/个人中心_图标_一键求助.png')} style={{width: 88*em, height: 88*em}}/>
            <Text>一键救助</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            alignItems: 'center',
            position: 'absolute', right: 120*em, top: 57*em
          }}>
            <Image source={require('../../commonUI/images/个人中心_图标_我的_选择状态.png')} style={{width: 44*em, height: 44*em}}/>
            <Text style={textStyles.primary}>我的</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    )
  }
}