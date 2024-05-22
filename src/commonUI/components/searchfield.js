import React, {Component} from 'react';
import {Platform, StyleSheet, TextInput, View, Text, Image, TouchableOpacity, FlatList, TouchableHighlight, Animated, ImageBackground, ScrollView, Alert} from 'react-native';
import {em} from '../base';
import { ImageButton } from './buttons';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
// import { Modal } from '../../../commonUI/components/modal';
import axios from 'axios';
import ModalDropdown from 'react-native-modal-dropdown';

const DEMO_OPTIONS_1 = ['option 1', 'option 2', 'option 3', 'option 4', 'option 5', 'option 6', 'option 7', 'option 8', 'option 9'];
const DEMO_OPTIONS_2 = [
  {"name": "Rex", "age": 30},
  {"name": "Mary", "age": 25},
  {"name": "John", "age": 41},
  {"name": "Jim", "age": 22},
  {"name": "Susan", "age": 52},
  {"name": "Brent", "age": 33},
  {"name": "Alex", "age": 16},
  {"name": "Ian", "age": 20},
  {"name": "Phil", "age": 24},
];

class SearchField extends Component {


    constructor(props) {
        super(props);
        this.state = {
            dropdown_4_options: null,
            dropdown_4_defaultValue: 'loading...',
            dropdown_6_icon_heart: true,
        }
    }

    onChangeText(value) {
        this.props.onChangeText(value);
        this.setState({text: value});
    }

    _dropdown_2_renderButtonText(rowData) {
        const {name, age} = rowData;
        return `${name} - ${age}`;
      }
    
      _dropdown_2_renderRow(rowData, rowID, highlighted) {
        let icon = rowData.check ? require('../images/checkbox_checked.png') : require('../images/checkbox_unchecked.png');
        // let icon = highlighted ? require('../images/checkbox_checked.png') : require('../images/checkbox_unchecked.png');
        // rowData.check = highlighted;
        let evenRow = rowID % 2;
        return (
          
            <View style={[styles.dropdown_2_row, {backgroundColor: evenRow ? 'lemonchiffon' : 'white', borderBottomWidth:1, borderColor:'#006688'}]}>
              <TouchableOpacity onPress = {() => {
                // Alert.alert(rowData.name);
                  this.props.selectField({name:rowData.name, check:!rowData.check})
                  // this.refs.dropdown_2.select(rowID);
                  }}>
                <Image style={styles.dropdown_2_image}
                     mode='stretch'
                     source={icon}
                />
              </TouchableOpacity>
              <Text style={[styles.dropdown_2_row_text, rowData.check && {color: 'mediumaquamarine'}]}>
                {`${rowData.name}`}
              </Text>
            </View>
          
        );
      }
    
      _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        if (rowID == DEMO_OPTIONS_1.length - 1) return;
        let key = `spr_${rowID}`;
        return (<View style={styles.dropdown_2_separator}
                      key={key}
        />);
      }
    
      _dropdown_3_adjustFrame(style) {
        console.log(`frameStyle={width:${style.width}, height:${style.height}, top:${style.top}, left:${style.left}, right:${style.right}}`);
        style.top -= 15;
        style.left += 150;
        return style;
      }
    
      _dropdown_4_willShow() {
        setTimeout(() => this.setState({
          dropdown_4_options: DEMO_OPTIONS_1,
          dropdown_4_defaultValue: 'loaded',
        }), 2000);
      }
    
      _dropdown_4_willHide() {
        this.setState({
          dropdown_4_options: null,
          dropdown_4_defaultValue: 'loading',
        });
      }
    
      _dropdown_4_onSelect(idx, value) {
        // BUG: alert in a modal will auto dismiss and causes crash after reload and touch. @sohobloo 2016-12-1
        //alert(`idx=${idx}, value='${value}'`);
        console.debug(`idx=${idx}, value='${value}'`);
      }
    
      _dropdown_5_show() {
        this._dropdown_5 && this._dropdown_5.show();
      }
    
      _dropdown_5_select(idx) {
        this._dropdown_5 && this._dropdown_5.select(idx);
      }
    
      _dropdown_5_willShow() {
        return false;
      }
    
      _dropdown_5_willHide() {
        let idx = this._dropdown_5_idx;
        this._dropdown_5_idx = undefined;
        return idx == 0;
      }
    
      _dropdown_5_onSelect(idx, value) {
        this._dropdown_5_idx = idx;
        if (this._dropdown_5_idx != 0) {
          return false;
        }
      }
    
      _dropdown_6_onSelect(idx, value) {
        this.setState({
          dropdown_6_icon_heart: !this.state.dropdown_6_icon_heart,
        })
      }

      selectField(idx, value) {
        Alert.alert(value, "sdfdfdfd");
        // this.props.selectField(value);
      }

    render() {
        const dropdown_6_icon = this.state.dropdown_6_icon_heart ? require('../images/heart.png') : require('../images/flower.png');
        return (
            <View style = {{flexDirection:'row', alignItems:'center', backgroundColor:'#0055ff', width:'100%', padding:15}}>
                <View style = {{flex:1, marginRight:10, alignItems:'center'}}>
                    <ModalDropdown ref="dropdown_2"
                           style={styles.dropdown_6}
                           textStyle={styles.dropdown_2_text}
                           dropdownStyle={styles.dropdown_2_dropdown}
                           options={this.props.field}
                          //  renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                           renderRow={this._dropdown_2_renderRow.bind(this)}
                          //  onSelect = {(idx, value) => this.props.selectField(value)}
                          //  renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                    >
                       <Image style={styles.dropdown_6_image}
                                source={require('../image/sidebar_toggler_icon_blue.png')} 
                        />
                    </ModalDropdown>
                </View>
                <View style = {{ borderWidth:1, alignItems:'center', backgroundColor:'white', flex:5, borderRadius:10}}>
                    <TextInput 
                        placeholder = "Search..." 
                        placeholderTextColor = "#ccc" 
                        style = {{justifyContent:'center', fontSize:30*em, width:'100%'}}
                        onChangeText = {this.onChangeText.bind(this)}
                        value = {this.props.value}
                    >    
                    </TextInput>
                </View> 
                <View style = {{flex:1, marginLeft:10, marginRight:10, alignItems:'center', borderRadius:10, borderWidth:1, borderColor:"#ccc"}}>
                    <ImageButton 
                        style = {{width:30*em, height:30*em, resizeMode:'cover'}} 
                        ImageUrl = {require('../icon/searchiconlight.png')} 
                        onPress = {() => {this.props.search()}}

                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    dropdown_6: {
        // zIndex:9999,
        flex: 1,
        left: 8,
        alignItems:'center',
        justifyContent:'center',
      },
      dropdown_6_image: {
        width: 30*em,
        height: 30*em,
      },
      container: {
        flex: 1,
      },
      row: {
        flex: 1,
        flexDirection: 'row',
      },
      cell: {
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
      },
      scrollView: {
        flex: 1,
      },
      contentContainer: {
        height: 500,
        paddingVertical: 100,
        paddingLeft: 20,
      },
      textButton: {
        color: 'deepskyblue',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'deepskyblue',
        margin: 2,
      },
    
      dropdown_1: {
        flex: 1,
        top: 32,
        left: 8,
      },
      dropdown_2: {
        alignSelf: 'flex-end',
        width: 150,
        marginTop: 32,
        right: 8,
        borderWidth: 0,
        borderRadius: 3,
        backgroundColor: 'cornflowerblue',
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
      dropdown_2_image: {
        marginLeft: 4,
        width: 30,
        height: 30,
      },
      dropdown_2_row_text: {
        marginHorizontal: 4,
        fontSize: 16,
        color: 'navy',
        textAlignVertical: 'center',
      },
      dropdown_2_separator: {
        height: 1,
        backgroundColor: 'cornflowerblue',
      },
      dropdown_3: {
        width: 150,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 1,
      },
      dropdown_3_dropdownTextStyle: {
        backgroundColor: '#000',
        color: '#fff'
      },
      dropdown_3_dropdownTextHighlightStyle: {
        backgroundColor: '#fff',
        color: '#000'
      },
      dropdown_4: {
        margin: 8,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 1,
      },
      dropdown_4_dropdown: {
        width: 100,
      },
      dropdown_5: {
        margin: 8,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 1,
      }
})

export default SearchField;