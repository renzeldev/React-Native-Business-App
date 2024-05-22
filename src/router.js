import React from 'react';
import {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native';
import {Router, Route, Schema, Animations, TabBar, Scene} from 'react-native-router-flux';
import Home from './pages/home';
import Login from './pages/auth/login/login';
import Signup from './pages/auth/signup/signup';
import Dashboard from './pages/dashboard/dashboard';
import {connect} from 'react-redux';
import Question from './pages/dashboard/Question';
import Eboard from './pages/dashboard/Eboard';
import ShowArticle from './pages/dashboard/Eboard/showarticle';
import WriteArticle from './pages/dashboard/Eboard/writearticle';
import News from './pages/dashboard/News';
import Service from './pages/dashboard/Service';
import Friend from './pages/dashboard/Friend';
import ChatRoom from './pages/dashboard/Friend/chatroom';
import FavouriteList from './pages/dashboard/Eboard/favouritelist';




class Routes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowMsg: false,
        }
    }

    // componentWillReceiveProps = (nextProps) => {
    //     if(nextProps.msg.isOn) {
    //         this.setState({isShowMsg: true});
    //     } 

    //     if(!nextProps.msg.isOn) {
    //         this.setState({isShowMsg: false});
    //     }
    // }

    render() {
        return (
            <Router>
                {/* <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
                <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
                <Schema name="withoutAnimation"/>
                <Schema name="tab" type="switch" icon={TabIcon} /> */}
                <Scene key = "root" >
                    <Scene key = 'home' component = {Home}  initial = {true} />
                    <Scene key = 'login' component = {this.props.auth.isAuthenticated ?(Home): (Login)} />
                    <Scene key = 'signup' component = {this.props.auth.isAuthenticated ? (Home) : (Signup)} />
                    <Scene key = 'dashboard' component = {Dashboard}   />
                    <Scene key = 'question' component = {Question}  />
                    <Scene key = 'eboard' component = {Eboard}  />
                    <Scene key = 'showarticle' component = {ShowArticle}  />
                    <Scene key = 'writearticle' hideNavBar = {true} component = {WriteArticle}  />
                    <Scene key = 'news' component = {News} />
                    <Scene key = 'service' component = {Service} {...navBar} />
                    <Scene key = 'friend' component = {Friend} />
                    <Scene key = 'chatroom' hideNavBar = {true} component = {ChatRoom} />
                    <Scene key = 'favouritelist' hideNavBar = {true} component = {FavouriteList} />
                </Scene>
            </Router> 
            // <Router hideNavBar={true}>
            //     <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
            //     <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
            //     <Schema name="withoutAnimation"/>
            //     <Schema name="tab" type="switch" icon={TabIcon} />

            //     <Route name="launch" component={Launch} initial={true} wrapRouter={true} title="Launch"/>
            //     <Route name="register" component={Register} title="Register"/>
            //     <Route name="home" component={Home} title="Replace" type="replace"/>
            //     <Route name="login" schema="modal">
            //         <Router>
            //             <Route name="loginModal" component={Login} title="Login" schema="modal"/>
            //             {/* <Route name="loginModal2" component={Login2} title="Login2"/> */}
            //         </Router>
            //     </Route>
            //     {/* <Route name="error" component={Error} title="Error"  type="modal"/>
            //     <Route name="register2" component={Register} title="Register2"  schema="withoutAnimation"/> */}
            //     <Route name="tabbar">
            //         <Router footer={TabBar} hideNavBar={true} tabBarStyle={{borderTopColor:'#00bb00',borderTopWidth:1,backgroundColor:'white'}}>
            //             <Route name="tab1" schema="tab" title="Tab #1" defaultRoute='tab1_1'>
            //                 <Router>
            //                     <Route name="tab1_1" component={TabView} title="Tab #1_1" />
            //                     <Route name="tab1_2" component={TabView} title="Tab #1_2" />
            //                 </Router>
            //             </Route>
            //             <Route name="tab2" schema="tab" title="Tab #2" hideNavBar={true}>
            //                 <Router onPop={()=>{console.log("onPop is called!"); return true} }>
            //                     <Route name="tab2_1" component={TabView} title="Tab #2_1" />
            //                     <Route name="tab2_2" component={TabView} title="Tab #2_2" />
            //                 </Router>
            //             </Route>
            //             <Route name="tab3" schema="tab" title="Tab #3" component={TabView} hideTabBar={true}/>
            //             <Route name="tab4" schema="tab" title="Tab #4" component={TabView} />
            //             <Route name="tab5" schema="tab" title="Tab #5" component={TabView} />
            //         </Router>
            //     </Route>
            // </Router>
            // </View>
        )
    }
}

const navBar = {
    headerStyle: {
        display:'none'
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    msg: state.msg
    // discuss: state.discuss,
    // error: state.errorReducer,
    // error: state.errorReducer,
    // ques: state.ques,
    // eboard: state.eboard,
})


export default connect(mapStateToProps)(Routes);