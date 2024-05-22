import React, { useState, useEffect, useRef } from 'react';
import {Platform, StyleSheet, TextInput, View, Text, Image, TouchableOpacity, FlatList, TouchableHighlight, Animated, ImageBackground, ScrollView, Alert} from 'react-native';
import {em} from '../../../commonUI/base';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import { TopBar } from '../../../commonUI/components/topbar';
import { TextWithLeftIcon, ShowToast } from '../../../commonUI/components/elements';
import { InputMultiTextWithTitle, InputSingleTextFormWithTitle } from '../../../commonUI/components/inputs';
import { getArticles, setEboardLoading, countArticles, submitComment } from '../../../store/actions/eboardAction';
// import { Modal } from '../../../commonUI/components/modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { SERVER_URL, SERVER } from '../../../config';
import spinner from '../../../commonUI/image/loading.gif';
import ModalComponent from '../../../commonUI/components/modal';
import Pagination from '../../../commonUI/components/pagination';
import SearchField from '../../../commonUI/components/searchfield';
import isEmpty from '../../../store/validation/is-empty';
import ModalDropdown from 'react-native-modal-dropdown';
// import AwesomeButton from "react-native-really-awesome-button";
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import Spin from '../../../commonUI/components/spin';

const WriteArticle = (props) => {

    const [ article, setArticle ] = useState({
        title: '',
        content: '',
        type: ''
    });
    
    const [ loading, setLoading ] = useState( false );

    const readyAritcle = (field, value) => {
        setArticle({ ...article, [field]:value });
    }

    const canSubmit = () => {
        return article.title && article.content && article.type;
    }

    const submit = () => {
        if( canSubmit() ) {
            setLoading( true );
            axios.post( SERVER_URL + '/main/eboard', article)
            .then( res => {
                setLoading( false );
                Actions.eboard();
            })
        }
    }


    return (
        <View style = {{ flex:1 }}>
            { loading ? ( 
                <Spin text = "Loading..."/> 
            ):(
                <View style = {{ flex:1 }}>
                    <TopBar title="New Article" 
                        onBack={() => {
                            Actions.eboard();
                        }} 
                    />
                    <View style = {{flex:1}} >
                        <TitleBar 
                            readyAritcle = { readyAritcle }
                            type = { article.type }
                        />
                    </View>
                    <View style = {{ flex: 5 }}>
                        <ContentBar 
                            readyAritcle = { readyAritcle }
                        />
                    </View>
                    <View style = {{ alignItems:'center', justifyContent:'center', padding:10 }}>
                        <AwesomeButtonRick 
                            size = 'small' 
                            type = { canSubmit() ? "secondary" : 'disabled' }
                            onPress = { submit }
                        >
                                Submit
                        </AwesomeButtonRick>
                    </View>
                </View>
            )}
            
        </View>

    )
}

const TitleBar = ({ readyAritcle, type }) => {

    const [ isFocused, setIsFocused ] = useState(false);

    const onChangeText = ( title ) => {
        readyAritcle( 'title', title );
    }

    const _dropdown_2_renderRow = (rowData, rowID, highlighted) => {
        let evenRow = rowID % 2;
        return (
          
            <View style={[styles.dropdown_2_row, {backgroundColor: evenRow ? 'lightgray' : 'white', borderBottomWidth:1, borderColor:'#006688'}]}>
                <TouchableOpacity onPress = {() => {
                    readyAritcle( 'type', rowData.name )
                }}>
                <View style = {{flexDirection:'row'}}>
                    <View style = {{width:25, alignItems:'center', justifyContent:'center'}}>
                        
                    </View>
                    <Text style={[styles.dropdown_2_row_text]}>    
                        {`${rowData.name}`}
                    </Text>
                </View>
              </TouchableOpacity>
            </View>
          
        );
    }
    return (
        <View style = {{margin:10, flexDirection: 'row'}}>
            <View style = {{flex:5, flexDirection:'column', marginRight:10}}>
                <Text style = {{color:'#006688'}}>
                    Title
                </Text>
                <View style = {{width:'100%', marginTop:10}}>
                    <TextInput 
                        placeholder = "Type your title."
                        placeholderTextColor = "#ccc"
                        onFocus = {e => {
                            setIsFocused(true);
                        }}
                        onBlur = {e => setIsFocused(false)}
                        style = {{borderRadius:10, borderWidth:1, borderColor: isFocused ? '#006688' : '#000000'}}
                        onChangeText = { onChangeText }
                    />
                </View>
            </View>
            <View style = {{flex:2, flexDirection:'column', marginLeft:10}}>
                <Text style = {{color:'#006688'}}>
                    Field
                </Text>
                <View style = {{ flexDirection:'row', marginTop:20, borderWidth:1, borderRadius:5, borderColor:'#006688' }}>
                    <View style = {{ borderRightWidth:1, flex:4 }}>
                        <Text style = {{ padding:5 }}>
                            { type }
                        </Text>
                    </View> 
                    {/* <View style = {{position:'absolute', right:10, top:20}}> */}
                    <View style = {{ flex:1 }}>    
                        <ModalDropdown 
                            // ref={(ref) => this.dropdown = ref}
                            style={styles.dropdown_6}
                            textStyle={styles.dropdown_2_text}
                            dropdownStyle={styles.dropdown_2_dropdown}
                            options={[
                                { name:'English' },
                                { name:'Chinese' },
                                { name:'Russian' },
                                { name:'Others' }
                            ]}
                            renderRow={_dropdown_2_renderRow}
                        >
                            <Icon name = "arrow-drop-down" size = {25} backgroundColor = 'transparent' color = "#006688" />
                        </ModalDropdown>
                    </View>
                </View>
                
            </View>
        </View>
    )
}

const ContentBar = ({ readyAritcle }) => {

    const onChangeText = ( content ) => {
        readyAritcle( 'content', content );
    }

    const [ isFocused, setIsFocused ] = useState(false);

    return (
        <View style = {{flex:1, margin:10, flexDirection: 'column' }}>
            <Text style = {{ color:'#006688'}}>
                Content
            </Text>
            <View style = {{flex:1, marginTop:10, marginBottom:10}}>
                <TextInput 
                    multiline = {true}
                    placeholder = "Type your Content."
                    placeholderTextColor = "#ccc"
                    textAlignVertical = "top"
                    onFocus = {e => {
                        setIsFocused(true);
                    }}
                    onBlur = {e => setIsFocused(false)}
                    style = {{ borderRadius:10, borderWidth:1, borderColor: isFocused ? '#006688' : '#000000', flex:1 }}
                    onChangeText = { onChangeText }
                />             
            </View>
        </View>
    )
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
    addComment: (data) => submitComment(data)
}

const styles = StyleSheet.create({
    iconStyle: {
        width:30*em, height:30*em, resizeMode:'cover', justifyContent:'center', marginLeft:30, marginRight:3
    },

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
    
      commentHeaderText: {
        textAlign:'left', 
        margin:5, 
        padding:3, 
        color:'white', 
        alignItems:'center'
      },
  
      commentMainText: {
          textAlign:'left', 
          margin:5, 
          padding:3, 
          color:'black', 
          alignItems:'center',
          height:'100%',
      },  
      
      commentBar: {
          flex: 1, 
          marginTop:10,  
          marginLeft:20, 
          marginRight:20, 
          flexDirection:'column'
      },
  
      commentMain: {
          backgroundColor:'white',  
        //   borderWidth:1, borderTopWidth:0, borderRadius:10
      },
  
      commentHeader: {
          borderWidth:1, borderRadius:10, backgroundColor:'#2266aa'
      },
      dropdown_6: {
        // zIndex:9999,
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    dropdown_2_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dropdown_2_dropdown: {
        width: 150,
        borderColor: 'cornflowerblue',
        borderWidth: 2,
        borderRadius: 3,
        marginTop:15,
        height:'auto',
        maxHeight:200
    },
    dropdown_2_row: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
    },
    dropdown_2_row_text: {
        marginHorizontal: 4,
        fontSize: 16,
        color: 'navy',
        textAlignVertical: 'center',
    }

})

export default connect(mapStateToProps, mapDispatchToProps)(WriteArticle);