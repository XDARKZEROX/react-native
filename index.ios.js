/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  AlertIOS
} from 'react-native';

import * as firebase from 'firebase';
const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');
const styles = require('./styles.js');

const firebaseConfig = {
      apiKey: "AIzaSyBjz5TaJ_QOYRJj0nG5JdwSD7ufnBULKNg",
      authDomain: "mytodoapp-aga.firebaseapp.com",
      databaseURL: "https://mytodoapp-aga.firebaseio.com",
      storageBucket: "mytodoapp-aga.appspot.com",
      messagingSenderId: "32459173554"
}

const firebaseApp = firebase.initializeApp(firebaseConfig);

class myTodoApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };

    this.itemsRef = this.getRef().child('items');
  }

  getRef(){
    return firebaseApp.database().ref();
  }

  listenForItems(itemsRef){
    itemsRef.on('value',(snap)=> {
      var items = [];
      snap.forEach((child)=>{
        items.push({
          title : child.val().title,
          _key: child.key
        })
      })
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      })
    })
  }
  _renderItem(item) {
    const onPress = ()=> {
      AlertIOS.alert(
        'Completado', null, [
          { text: 'Quitar', onPress: (text)=> this.itemsRef.child(item._key).remove()},
          { text: 'Cancelar', onPress: ()=> console.log('Se cancelo...'), style:'cancel'}
        ]
      )


    }

    return (
      <ListItem item={item} onPress={onPress}/>
    );
  }

 _addItem(){
   AlertIOS.prompt(
     'Agregar todo', null, [
       { text: 'Agregar', onPress: (text)=> this.itemsRef.push({title: text})},
       { text: 'Cancelar', onPress: (text)=> console.log('Se cancelo...')}
     ]
   )

 }
  componentDidMount() {
      this.listenForItems(this.itemsRef)
        /*
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows([
              { title: 'Pizza' }])
          })
          */
  }

  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
      <View style={styles.container}>

        <StatusBar title="Mis pendientes"/>
        <ListView dataSource={this.state.dataSource}
        renderRow={this._renderItem.bind(this)}
        style={styles.listview}
        enableEmptySections={true}
        />

      <ActionButton title="Add + " onPress={ this._addItem.bind(this)} />

      </View>
      </TouchableHighlight>
    );
  }
}



AppRegistry.registerComponent('myTodoApp', () => myTodoApp);
