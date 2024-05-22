import React, {Component} from 'react'
import {createStackNavigator} from 'react-navigation'

import LoginRouter from './auth/login'
import SignupRouter from './auth/signup'
import DashboardRouter from './myaccount/dashboard'
import PersonalInfoScene from './myaccount/personal_info'
import PersonalIdcardsScene from './myaccount/personal_idcards'
import MyCompanyScene from './myaccount/my_company'
import MyAddressScene from './myaccount/my_address'
import CommitmentScene from './myaccount/commitment'
import InquiryScene from './myaccount/inquiry'
import MydocsScene from './myaccount/mydocs'
import OfficialMoneyScene from './myaccount/official_money'
import OnlineScene from './myaccount/online'
import ProxyScene from './myaccount/proxy'
import SecurityScene from './myaccount/security'
import SubscribeScene from './myaccount/subscribe'
import TaxScene from './myaccount/tax'
import TellerScene from './myaccount/teller'
import WelfareScene from './myaccount/welfare'

import Home from '../pages/home';
import Login from '../pages/auth/login/login';
import Dashboard from '../pages/dashboard/dashboard';
import Eboard from '../pages/dashboard/Eboard';
import ShowArticle from '../pages/dashboard/Eboard/showarticle';

let headerOptions = {
	headerStyle: {
		display: 'none'
	}
}

const MainRouter = createStackNavigator({
  home: {
    screen: Home,
    navigationOptions: headerOptions
  },
  login: {
    screen: Login,
    navigationOptions: headerOptions
  },
  dashboard: {
    screen: Dashboard,
    navigationOptions: headerOptions
  },
  eboard: {
    screen: Eboard,
    navigationOptions: headerOptions
  },
  showarticle: {
    screen: ShowArticle,
    navigationOptions: headerOptions
  }
}, {
  initialRouteName: 'home'
})

// const MainRouter = createStackNavigator({
// 	login: {
// 		screen:	LoginRouter,
// 		navigationOptions: headerOptions
// 	},
// 	signup: {
// 		screen:	SignupRouter,
// 		navigationOptions: headerOptions
// 	},
// 	dashboard: {
// 		screen: DashboardRouter ,
// 		navigationOptions: headerOptions
// 	},
// 	personal_info: {
// 		screen: PersonalInfoScene,
//     navigationOptions: headerOptions
// 	},
//   personal_idcards: {
//     screen: PersonalIdcardsScene,
//     navigationOptions: headerOptions
//   },
//   my_company: {
//     screen: MyCompanyScene,
//     navigationOptions: headerOptions
//   },
//   my_address: {
//     screen: MyAddressScene,
//     navigationOptions: headerOptions
//   },
//   commitment: {
//     screen: CommitmentScene,
//     navigationOptions: headerOptions
//   },
//   inquiry: {
//     screen: InquiryScene,
//     navigationOptions: headerOptions
//   },
// 	mydocs: {
//     screen: MydocsScene,
//     navigationOptions: headerOptions
//   },
//   official_money: {
//     screen: OfficialMoneyScene,
//     navigationOptions: headerOptions
//   },
//   online: {
//     screen: OnlineScene,
//     navigationOptions: headerOptions
//   },
//   proxy: {
//     screen: ProxyScene,
//     navigationOptions: headerOptions
//   },
//   security: {
//     screen: SecurityScene,
//     navigationOptions: headerOptions
//   },
//   subscribe: {
//     screen: SubscribeScene,
//     navigationOptions: headerOptions
//   },
//   tax: {
//     screen: TaxScene,
//     navigationOptions: headerOptions
//   },
//   teller: {
//     screen: TellerScene,
//     navigationOptions: headerOptions
//   },
//   welfare: {
//     screen: WelfareScene,
//     navigationOptions: headerOptions
//   },
// }, {
// 	initialRouteName: 'login'
// })

export default MainRouter;