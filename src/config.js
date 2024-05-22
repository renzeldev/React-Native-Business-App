export const API_BASE_URL = 'http://100.100.1.179:3210/'
export const SERVER_URL = 'http://10.0.3.2:5000'
export const SERVER_IP = 'http://10.0.3.2'
export const SERVER = 'http://10.0.3.2:3000'

export const nationality_dropdowns = [{
  '汉族': {name: '汉族'},
  '满族': {name: '满族'},
  '藏族': {name: '藏族'},
}]

export const DASHBOARD_FAVORITE_LINKS = [{
  title: '个人资料',
  image: require('./commonUI/images/个人中心_图标_个人资料.png'),
  route: 'myaccount-personal_info-index'
}, {
  title: '个人证照',
  image: require('./commonUI/images/个人中心_图标_个人证照.png'),
  route: 'myaccount-personal_idcards-index'
}, {
  title: '我的公司',
  image: require('./commonUI/images/个人中心_图标_我的公司.png'),
  route: 'myaccount-my_company-index'
}, {
  title: '我的地址',
  image: require('./commonUI/images/个人中心_图标_我的地址.png'),
  route: 'myaccount-my_address-index'
}]

export const DASHBOARD_LINKS = [[
  {
    title: '公积金',
    image: require('./commonUI/images/个人中心_图标_公积金.png'),
    route: 'myaccount-official_money-index'
  },
  {
    title: '社保',
    image: require('./commonUI/images/个人中心_图标_社保.png'),
    route: 'myaccount-welfare-index'
  },
  {
    title: '个人纳税',
    image: require('./commonUI/images/个人中心_图标_个人纳税.png'),
    route: 'myaccount-tax-index'
  }
], [
  {
    title: '在线办理记录',
    image: require('./commonUI/images/个人中心_图标_在线办理.png'),
    route: 'myaccount-online-index'
  },
  {
    title: '窗口办理记录',
    image: require('./commonUI/images/个人中心_图标_窗口办理记录.png'),
    route: 'myaccount-teller-index'
  },
  {
    title: '预约记录',
    image: require('./commonUI/images/个人中心_图标_预约记录.png'),
    route: 'myaccount-subscribe-index'
  },
  {
    title: '咨询记录',
    image: require('./commonUI/images/个人中心_图标_咨询记录.png'),
    route: 'myaccount-inquiry-index'
  },
  {
    title: '委托记录',
    image: require('./commonUI/images/个人中心_图标_委托记录.png'),
    route: 'myaccount-commitment-index'
  }
], [
  {
    title: '我的收件柜',
    image: require('./commonUI/images/个人中心_图标_我的收件柜.png'),
    route: 'myaccount-mydocs-index'
  },
  {
    title: '代办收藏',
    image: require('./commonUI/images/个人中心_图标_代办收藏.png'),
    route: 'myaccount-proxy-index'
  },
  {
    title: '安全中心',
    image: require('./commonUI/images/个人中心_图标_安全中心.png'),
    route: 'myaccount-security-index'
  }

]]