import React, {Component} from 'react';

import IndexScene from '../../pages/myaccount/personal_idcards/index';

import {createStackNavigator} from 'react-navigation';

let headerOptions = {

}

const Router = createStackNavigator({
  'myaccount-personal_idcards-index': {
    screen: IndexScene
  }
}, {
  initialRouteName: 'myaccount-personal_idcards-index'
})

export default Router;