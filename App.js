/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Alert, Platform, StyleSheet, View, Image, TouchableHighlight, DrawerLayoutAndroid} from 'react-native';
import MainRouter from './src/routes/index';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './src/store/reducers/index';
import Menu from './src/Menu';
import Routes from './src/router';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import ModalComponent from './src/commonUI/components/modal';
import {MessageModal} from './src/commonUI/components/elements';
import { hideMessageModal } from './src/store/actions/msgActions';

// import store from './src/store';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const store = createStore(reducer)
type Props = {};
class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      isMsgShown: false
    }
  }

  openDrawer() {
    this.drawer.openDrawer();
  }

  jump(scene) {
    // navigation.navigate(scene);
    Actions.jump(scene);
    // this.props.navigation.navigate(scene);
    this.drawer.closeDrawer();
  }

  closeModal() {
    store.dispatch(hideMessageModal);
  }

  componentDidMount() {
    // var string = '';
    // Object.keys(store.getState()).map(t => string += t + '_');
    // Alert.alert(string);
  }

  render() {
    return (
      <Provider store={store}>
        
        <View style={styles.container}>
          <DrawerLayoutAndroid
                ref = {drawer => this.drawer = drawer}
                drawerWidth = {300}
                drawerPosition = {DrawerLayoutAndroid.positions.Left}
                renderNavigationView = {() => <Menu onPress = {this.jump.bind(this)} />}>
            <Routes />  
          </DrawerLayoutAndroid>
          
          
        </View>
      </Provider>
    );
  }
}


export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  }
});
