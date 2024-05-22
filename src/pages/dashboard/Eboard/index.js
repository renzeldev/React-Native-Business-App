import React, {Component} from 'react';
import {DrawerLayoutAndroid, Dimensions, StyleSheet, RefreshControl, View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator, Animated, ImageBackground, ScrollView, Alert} from 'react-native';
import {em} from '../../../commonUI/base';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import { TopBar } from '../../../commonUI/components/topbar';
import { TextWithLeftIcon } from '../../../commonUI/components/elements';
import { getArticles, setEboardLoading, countArticles, getMyFavourites } from '../../../store/actions/eboardAction';
// import { Modal } from '../../../commonUI/components/modal';
import axios from 'axios';
import { SERVER_URL, SERVER } from '../../../config';
import spinner from '../../../commonUI/image/loading.gif';
import ModalComponent from '../../../commonUI/components/modal';
import Pagination from '../../../commonUI/components/pagination';
import SearchField from '../../../commonUI/components/searchfield';
import isEmpty from '../../../store/validation/is-empty';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EIcon from 'react-native-vector-icons/Entypo';
import ModalDropdown from 'react-native-modal-dropdown'
import FastImage from 'react-native-fast-image';
import Spin from '../../../commonUI/components/spin';
import { CheckField } from '../../../commonUI/components/inputs';

const windowHeight = Dimensions.get('window').height;

class Eboard extends Component {

    static navigationOptions = {
		headerStyle: {
			display: 'none'
		}
	}
    constructor(props) {
        super(props) ;
        this.state = {
            loading:'false',
            articles:[],
            shownArticles:[],
            page_number : 1,
            search_item:'',
            isSearchHandle: true,
            isSearchTitle: true,
            isSearchContent: true,
            // searchHandle:"",
            // searchTitle:"",
            // searchContent:"",
            max_page_number: Number,
            searchedItem: {
                handle:'',
                title:'',
                content:'',
                type: '',
            },
            sortInfo: {},
            isSetPouplar: false,
            isModalVisible: false,
            dropdown_4_options: null,
            favourites:[],
            dropdown_4_defaultValue: 'loading...',
            dropdown_6_icon_heart: true,
            isRefreshing : false,
        }
    }

    _dropdown_6_onSelect(idx, value) {
        this.setState({
          dropdown_6_icon_heart: !this.state.dropdown_6_icon_heart,
        })
    }

    getArticles(page_number, searchedItem) {
        
        // dispatch(setEboardLoading);
        this.props.setEboardLoading();
        // const {searchedItem} = this.state;
        if(!searchedItem.handle && !searchedItem.title && !searchedItem.content && !searchedItem.type) {
            axios.get(SERVER_URL + `/main/eboard/show/${page_number}`)
            .then(res => this.props.getArticles(res.data))
            .catch(err => this.props.getArticles([]));
        } else {
            axios.post(SERVER_URL + `/main/eboard/searched/show/${page_number}`, searchedItem)
            .then(res => this.props.getArticles(res.data))
            .catch(err => this.props.getArticles([]));
            //window.alert(searchedItem.handle)
            //console.log(searchedItem);
        }
    }

    countArticles(searchedItem) {
        if(!searchedItem.handle && !searchedItem.title && !searchedItem.content && !searchedItem.type ) {
            axios.get(SERVER_URL + '/main/eboard/count/articles')
            .then(res => this.setState({max_page_number : res.data % 10 == 0 ? res.data/10 : parseInt(res.data/ 10) + 1}))
            .catch(err => this.setState({max_page_number: 0}));
          } else {
            // console.log(searchedItem);
            axios.post(SERVER_URL + '/main/eboard/searched/count/articles', searchedItem)
            .then(res => this.setState({max_page_number : res.data % 10 == 0 ? res.data/10 : parseInt(res.data/ 10) + 1}))
            .catch(err => this.setState({max_page_number: 0}));
          }
    }

    getArticlesByPopular(page_number, searchedItem) {
        
        // dispatch(setEboardLoading);
        this.props.setEboardLoading();
        // const {searchedItem} = this.state;
        if(!searchedItem.handle && !searchedItem.title && !searchedItem.content && !searchedItem.type) {
            axios.get(SERVER_URL + `/main/eboard/popular/show/${page_number}`)
            .then(res => this.props.getArticles(res.data))
            .catch(err => this.props.getArticles([]));
        } else {
            axios.post(SERVER_URL + `/main/eboard/popular/searched/show/${page_number}`, searchedItem)
            .then(res => this.props.getArticles(res.data))
            .catch(err => this.props.getArticles([]));
            //window.alert(searchedItem.handle)
            //console.log(searchedItem);
        }
    }

    // countArticlesByPopular(searchedItem) {
    //     if(!searchedItem.handle && !searchedItem.title && !searchedItem.content && !searchedItem.type ) {
    //         axios.get(SERVER_URL + '/main/eboard/count/articles')
    //         .then(res => this.setState({max_page_number : res.data % 5 == 0 ? res.data/5 : parseInt(res.data/5) + 1}))
    //         .catch(err => this.setState({max_page_number: 0}));
    //       } else {
    //         // console.log(searchedItem);
    //         axios.post(SERVER_URL + '/main/eboard/searched/count/articles', searchedItem)
    //         .then(res => this.setState({max_page_number : res.data % 5 == 0 ? res.data/5 : parseInt(res.data/5) + 1}))
    //         .catch(err => this.setState({max_page_number: 0}));
    //       }
    // }

    getSortInfo() {
        axios.get(SERVER_URL + '/main/eboard/getSortInfo')
        .then( res => {
            this.setState({sortInfo:res.data});
        })
    }

    componentDidMount() {
        // Alert.alert('sfdf');
        this.getSortInfo();
        this.getMyFavourites();
        !this.props.eboard.isSetPouplar ? this.getArticles( this.props.eboard.page_number, this.props.eboard.searchedItem ) : this.getArticlesByPopular( this.props.eboard.page_number, this.props.eboard.searchedItem );
        this.countArticles( this.props.eboard.searchedItem );
        
        if(!isEmpty(this.props.eboard.searchedItem.handle)){
            this.setState({search_item: this.props.eboard.searchedItem.handle})
        }

        if(!isEmpty(this.props.eboard.searchedItem.title)){
            this.setState({search_item: this.props.eboard.searchedItem.title})
        }

        if(!isEmpty(this.props.eboard.searchedItem.content)){
            this.setState({search_item: this.props.eboard.searchedItem.content})
        }
        
        this.setState({searchedItem: this.props.eboard.searchedItem});
        
        // this.getAllQuestions();
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.eboard.favourites) {
            this.setState({ 
                favourites: nextProps.eboard.favourites,
                sortInfo: { ...this.state.sortInfo, favor: nextProps.eboard.favourites.length }
            });
        }

        if(nextProps.eboard.articles) {
            // Alert.alert("sfdfdf");
            const { articles } = nextProps.eboard;
            this.setState({ articles: articles });
            this.setState({shownArticles: articles.slice(0,3)});
        }
    }
    
    _renderItem = ({item, index}) => {
        return (
            // <ArticleBar title = {item.title} content = {item.content} user = {item.user} type = {item.type} comments = {item.comments} agree = {item.agree} disagree = {item.disagree} />
            <ArticleBar article = {item} showArticle = {this.showArticle.bind(this)} favourites = {this.state.favourites} />
        );
    } 

    showArticle(article) {
        // Alert.alert(article.title);
        this.props.showArticle(article);
    }

    closeModal() {
        this.setState({isModalVisible: false});
    }

    onChangeSearchItem(value) {
        this.setState({search_item : value});
        // this.setState({searchedItem : { handle: value, title: value, content: value }});
    }


    search() {
        // Alert.alert(this.state.searchedItem.handle);
        const searchedItem = {
            handle: this.state.isSearchHandle? this.state.search_item:'',
            title: this.state.isSearchTitle? this.state.search_item:'',
            content: this.state.isSearchContent? this.state.search_item:'',
            type: this.state.searchedItem.type,
        }
        this.setState({searchedItem : searchedItem});
        this.countArticles(searchedItem);
        this.getArticles(1, searchedItem);
    }

    clickFirstBtn() {
        !this.state.isSetPouplar ? this.getArticles(1, this.state.searchedItem):this.getArticlesByPopular(1, this.state.searchedItem);
    }

    clickPreviousBtn() {
        !this.state.isSetPouplar ? this.getArticles(this.props.eboard.page_number - 1, this.state.searchedItem) : this.getArticlesByPopular(this.props.eboard.page_number - 1, this.state.searchedItem);
    }

    clickNextBtn() {
        !this.state.isSetPouplar ? this.getArticles(this.props.eboard.page_number + 1, this.state.searchedItem) : this.getArticlesByPopular(this.props.eboard.page_number + 1, this.state.searchedItem);
    }

    clickLastBtn() {
        !this.state.isSetPouplar ? this.getArticles(this.state.max_page_number, this.state.searchedItem) : this.getArticlesByPopular(this.state.max_page_number, this.state.searchedItem);
    }

    clickRangeField() {
        this.setState({isModalVisible: true});
    }

    closeModal() {
        this.setState({isModalVisible: false});
    }

    changeInputRange(value) {
        !this.state.isSetPouplar ? this.getArticles(value, this.state.searchedItem) : this.getArticlesByPopular(value, this.state.searchedItem)
        
    }

    selectField(data) {
        if(data.name == 'handle') {
            this.setState({isSearchHandle: data.check});
        } else if (data.name == 'title') {
            this.setState({isSearchTitle : data.check});
        } else if (data.name == 'content') {
            this.setState({isSearchContent: data.check});
        }
    }

    abstractBySort(sort) {
        const searchedItem = {
            handle: this.state.isSearchHandle? this.state.search_item:'',
            title: this.state.isSearchTitle? this.state.search_item:'',
            content: this.state.isSearchContent? this.state.search_item:'',
            type: sort,
        }
        this.setState({ searchedItem : searchedItem });
        this.countArticles(searchedItem);
        this.getArticles(1, searchedItem);
    }

    sortByPopular() {
        // this.countArticlesByPopular(searchedItem);
        if(this.state.isSetPouplar) {
            this.setState({isSetPouplar: false});
            this.getArticles(1, this.state.searchedItem);
        } else {
            this.setState({isSetPouplar: true});
            this.getArticlesByPopular(1, this.state.searchedItem);
        }
        
    }

    getMyFavourites() {
        // Alert.alert("favo");
        axios.get(`${SERVER_URL}/main/eboard/getMyFavor`)
        // .then( res => this.setState({favourites: res.data}));
        .then( res => this.props.getMyFavourites(res.data));
    }

    onRefresh() {
        // this.setState({isRefreshing: true});
        // if( this.state.articles.length - this.state.shownArticles.length < 3 ) {
        //     this.setState({ shownArticles : this.state.articles });
        // } else {
        //     const shownArticles = this.state.shownArticles.concat( this.state.articles.slice( this.state.shownArticles.length,  this.state.shownArticles.length + 3 ) );
        //     this.setState({ shownArticles : shownArticles });
        // }
        this.setState({ isRefreshing: false });
    }

    onScroll(e) {
        var height = e.nativeEvent.contentSize.height,
            offset = e.nativeEvent.contentOffset.y;
        if( windowHeight + offset >= height ) {
            this.setState({ isRefreshing: true });
            setTimeout( () => {
                if( this.state.articles.length - this.state.shownArticles.length < 3 ) {
                    this.setState({ shownArticles : this.state.articles });
                } else {
                    const shownArticles = this.state.shownArticles.concat( this.state.articles.slice( this.state.shownArticles.length,  this.state.shownArticles.length + 3 ) );
                    this.setState({ shownArticles : shownArticles });
                }
                this.setState({ isRefreshing: false });
            }, 500 )
            
        }
        
    }   

    render() {
        const {loading} = this.props.eboard;
        const {articles} = this.state;
        const {shownArticles} = this.state;
        return (
            
            <View style = {{flex:1}}>
                <DrawerLayoutAndroid
                    ref = {drawer => this.drawer = drawer}
                    drawerWidth = {250}
                    drawerPosition = {DrawerLayoutAndroid.positions.Right}
                    renderNavigationView = {
                        () =>   <ArticleSort 
                                    isSetPouplar = { this.state.isSetPouplar }
                                    sortByPopular = { this.sortByPopular.bind(this) }
                                    abstractBySort = { this.abstractBySort.bind(this) }
                                    sortInfo = { this.state.sortInfo }
                                    {...this.props}
                                />
                    }
                > 
                    <TopBar 
                        title="E-Board" 
                        onBack={() => {Actions.pop()}} 
                        actionBtn = {() => {
                            Actions.writearticle();
                        }}
                        actionBtnTitle = {<Icon name = 'add-circle' size = {30*em} color = 'white'/>}
                    />
                    <ModalComponent 
                        isVisible = {this.state.isModalVisible} 
                        title = "Input page number" 
                        contentType = "InputNumber" 
                        closeModal = {this.closeModal.bind(this)}
                        getArticles = {this.changeInputRange.bind(this)}
                        max_page_number = {this.state.max_page_number}
                    />
                    <SearchField 
                        onChangeText = {this.onChangeSearchItem.bind(this)} 
                        search = {this.search.bind(this)} 
                        value = {this.state.search_item}
                        field = { [ {name:'handle', check:this.state.isSearchHandle}, {name:'title', check: this.state.isSearchTitle}, {name: 'content', check: this.state.isSearchContent}] }   
                        selectField = {this.selectField.bind(this)}
                    />    
                    { loading  ? (
                        
                        <Spin text = "Articles Loading..."/>
                    ) : (
                        articles == null ? (
                            <View style = {{flex:1, alignItems:'center', justifyContent:'center'}}>
                                <Text style = {{textAlign:'center', fontSize:25*em}}>
                                    There's no article shown.
                                </Text>
                            </View>
                        ) : (
                            <View style = {{flex:1}}>
                                <ScrollView
                                    refreshControl = { 
                                        <RefreshControl 
                                            refreshing = { this.state.isRefreshing }
                                            onRefresh = { this.onRefresh.bind(this) }
                                            progressViewOffset = { 100 }
                                        />
                                    }
                                    onScroll = { this.onScroll.bind(this) }
                                >
                                    <FlatList 
                                        data = {shownArticles} 
                                        keyExtractor={(item) => item._id} 
                                        renderItem={this._renderItem} 
                                        vertical={true} 
                                        // onEndReached={() => this.onRefresh() }
                                        // onEndReachedThreshold={0.5} 
                                    />
                                </ScrollView>
                                
                            </View>
                        )
                        
                    )}
                    <Pagination 
                        clickFirstBtn = {this.clickFirstBtn.bind(this)}
                        clickPreviousBtn = {this.clickPreviousBtn.bind(this)}
                        clickNextBtn = {this.clickNextBtn.bind(this)}
                        clickLastBtn = {this.clickLastBtn.bind(this)}
                        clickRangeField = {this.clickRangeField.bind(this)}
                        page_number = {this.props.eboard.page_number}
                        max_page_number = {this.state.max_page_number}
                    />
                </DrawerLayoutAndroid>
            </View>
        )
    }
}

const ArticleSort = ({ sortInfo, abstractBySort, sortByPopular, isSetPouplar }) => {
    return (
        <View style={{ flex: 1 }}>
                {/* <Image source = {this.props.auth.isAuthenticated && this.props.auth.user.image?{uri: `data:${this.props.auth.user.image}`}:require('./commonUI/image/login_bg.png')} style = {{width:'100%', height:'30%'}}/> */}
                <View style = {{width:'100%', height: 250*em}}>
                    <Image source = {require('../../../commonUI/image/login_bg.png')} resizeMode = "cover" style = {{width:'100%', height:'100%'}} />
                </View>
                <View style={styles.button} >
                    <TouchableOpacity onPress = {() => {
                        abstractBySort('');
                    }}>
                        <View style = {{flexDirection:'row'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black', flex:4}}
                            ><EIcon name = 'language' size = {20} color = '#006688' /> All Articles
                            </Text>
                            <Text style = {{fontSize:15, padding:10, color:'black', flex:1, justifyContent:'center', alignSelf:'center'}}>
                                { sortInfo.all }
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style = {[ styles.button, { flexDirection:'column', borderTopWidth:1, borderTopColor:'#ccc' }]}>
                    <TouchableOpacity onPress = {() => {
                        abstractBySort('English');
                    }}>
                        <View style = {{ flexDirection:'row' }}>
                            <Text 
                                style = {{ fontSize:20, padding:10, color:'black', flex:4 }}
                            ><Icon name = 'language' size = {20} color = '#006688' /> English
                            </Text>
                            <Text style = {{fontSize:15, padding:10, color:'black', flex:1, justifyContent:'center', alignSelf:'center'}}>
                                {sortInfo.english}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {
                        abstractBySort('Chinese');
                    }}>
                        <View style = {{flexDirection:'row'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black', flex:4}}
                            ><Icon name = 'language' size = {20} color = '#006688' /> Chinese
                            </Text>
                            <Text style = {{fontSize:15, padding:10, color:'black', flex:1, justifyContent:'center', alignSelf:'center'}}>
                                {sortInfo.chinese}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {
                        abstractBySort('Russian');
                    }}>
                        <View style = {{flexDirection:'row'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black', flex:4}}
                            ><Icon name = 'language' size = {20} color = '#006688' /> Russian
                            </Text>
                            <Text style = {{fontSize:15, padding:10, color:'black', flex:1, justifyContent:'center', alignSelf:'center'}}>
                                {sortInfo.russian}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {
                            // Actions.question();
                        abstractBySort('Others');
                    }}>
                        <View style = {{flexDirection:'row'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black', flex:4}}
                            ><Icon name = 'language' size = {20} color = '#006688' /> Others
                            </Text>
                            <Text style = {{fontSize:15, padding:10, color:'black', flex:1, justifyContent:'center', alignSelf:'center'}}>
                                {sortInfo.all - sortInfo.english - sortInfo.chinese - sortInfo.russian}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style = {[styles.button, {flexDirection:'column', borderTopWidth:1, borderTopColor:'#ccc'}]}>
                    <TouchableOpacity onPress = {() => {
                        // sortByPopular();
                        Actions.favouritelist();
                    }}>
                        <View style = {{flexDirection:'row'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black', flex:4}}
                            ><Icon name = 'stars' size = {20} color = '#006688' /> Favourite
                            </Text>
                            <Text style = {{fontSize:15, padding:10, color:'black', flex:1, justifyContent:'center', alignSelf:'center'}}>
                                {sortInfo.favor}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => {
                        sortByPopular();
                    }}>
                        <View style = {{borderRadius:10, flexDirection:'row', backgroundColor: isSetPouplar ? 'rgba(0,0,255,0.3)' : 'rgba(255,255,255,0.7)'}}>
                            <Text 
                                style = {{fontSize:20, padding:10, color:'black', flex:4}}
                            ><Icon name = 'favorite' size = {20} color = '#006688' /> Popular
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
    )
}

class ArticleBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const isFavourite = (this.props.favourites.indexOf(this.props.article._id) != -1);
        const star = isFavourite ? require('../../../commonUI/icon/star.png') : require('../../../commonUI/icon/star-empty.png');
        return (
            <View style = {{borderWidth:1, padding: 10, flexDirection:'row'}}>
            {/* <View> */}
                {/* <TouchableOpacity onPress = { () => {
                    this.props.showArticle(this.props.article);
                    Action.showarticle();
                } }> */}
                    <View style = {{flex:1, flexDirection:'column'}}>
                        <View style = {{flex:5, paddingTop:20}}>
                            <Image 
                                source = {{uri : SERVER + '/avatar/' + this.props.article.user + '.png'}} 
                                resizeMode = 'contain'
                                // source = {require('../../../commonUI/icon/people19.png')} 
                                style = {{ width:'100%', height:'100%'}}
                            />
                        </View>
                        <View style = {{flex:1, justifyContent:'center'}}>
                            <Text style = {{textAlign:'center', fontSize:25*em, color:'#0088ee', justifyContent:'center'}}>
                                {this.props.article.user}
                            </Text>
                        </View>
                    </View>
                    <View style = {{flex:4, paddingLeft:10, flexDirection:'column'}}>
                        <TouchableOpacity onPress = { () => {
                            this.props.showArticle(this.props.article);
                            Actions.showarticle();
                        } }>
                            <View style = {{paddingBottom:5, borderBottomWidth:1, borderStyle:'dotted', borderColor:'#001122'}}>
                                <Text style = {{height:60*em, justifyContent:'center', color:'#0088ee'}}>
                                    {this.props.article.title}
                                </Text> 
                            </View>
                            <View style = {{borderBottomWidth:1, paddingBottom:5}}>
                                {/* <TextInput multiline = {true} value = {'fefwfewfwefwef\n' + 'fefwfewfwefwef\n' + 'fefwfewfwefwef\n' 
                                + 'fefwfewfwefwef\n' + 'fefwfewfwefwef\n' + 'fefwfewfwefwef\n' + 'fefwfewfwefwef\n'}  style = {{height: 200*em, justifyContent:'center', overflowY:'none'}}>

                                </TextInput> */}
                                <Text style = {{height: 200*em, justifyContent:'center'}}>
                                    {this.props.article.content}
                                </Text>
                            </View>
                            <View style = {{justifyContent:'center'}}>
                                <Text>
                                    Field:{this.props.article.type}
                                </Text>
                            </View>
                            <View style = {{marginTop:10, flexDirection:'row'}}>
                                
                                <View style = {{ flexDirection:'row', flex:1}}>
                                    <Image source = {require('../../../commonUI/icon/thumbup.png')} style = {styles.iconStyle} />
                                    <Text style = {{justifyContent:'center'}}>{`${this.props.article.agree.length}`}</Text>
                                </View>
                                <View style = {{ flexDirection:'row', flex:1}}>
                                    <Image source = {require('../../../commonUI/icon/thumbdown.png')} style = {styles.iconStyle} />
                                    <Text style = {{justifyContent:'center'}}>{`${this.props.article.agree.length}`}</Text>
                                </View>
                                <View style = {{ flexDirection:'row', flex:1}}>
                                    <Image source = {require('../../../commonUI/icon/extra/info.png')} style = {styles.iconStyle} />
                                    <Text style = {{justifyContent:'center'}}>{`${this.props.article.comments.length}`}</Text>
                                </View>
                                <View style = {{ flexDirection:'row', flex:1}}>
                                    <Image source = {require('../../../commonUI/icon/eye.png')} style = {styles.iconStyle} />
                                    <Text style = {{justifyContent:'center'}}>{`${this.props.article.views}`}</Text>
                                </View>
                                <View style = {{ flexDirection:'row', flex:1}}>
                                    <Image source = {star} style = {styles.iconStyle} />
                                </View>
                            </View>  
                        </TouchableOpacity>   
                    </View>
                {/* </TouchableOpacity> */}
                {/* </View> */}
            </View>
        )
    }
}






const mapStateToProps = (state) => ({
    auth:state.auth,
    eboard:state.eboard,
    error: state.errorReducer,
})

const mapDispatchToProps = {
    setEboardLoading: () => setEboardLoading(),
    getArticles : (articles) => getArticles(articles),
    countArticles: (number) => countArticles(number),
    showArticle: (article) => {
        return {
            type: 'GET_ARTICLE',
            payload: article,
        }
    },
    getMyFavourites: ( list ) => {
        return {
            type: 'GET_MY_FAVOURITES',
            payload: list
        }
    }
}

const styles = StyleSheet.create({
    iconStyle: {
        width:30*em, 
        height:30*em, 
        resizeMode:'cover', 
        justifyContent:'center', 
        marginRight:5
    },

    dropdown_6: {
        zIndex:9999,
        flex: 1,
        left: 8,
    },
    dropdown_6_image: {
        width: 40,
        height: 40,
    },

    button: {
        margin: 10,
        marginBottom: 0,
        justifyContent:'center'
        // flexDirection: 'row',
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Eboard);