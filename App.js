import React, { Component } from 'react';
import { Animated, AppRegistry, Alert, Button, FlatList, ListView, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import axios from "axios";
import { StackNavigator } from 'react-navigation';
import {
  Card,
  CardTitle,
  CardContent
} from 'react-native-card-view';
import { TabNavigator } from 'react-navigation';
const BusyIndicator = require('react-native-busy-indicator');
const loaderHandler = require('react-native-busy-indicator/LoaderHandler');

class LoginActivity extends React.Component {
  
  state = {username: '', password: ''};

  constructor()
  {
      super();
      global.globalData = {};
      console.log("App initialized.");
  }

  static navigationOptions =
  {
    title: '   Student Life Cycle Management Portal',
  };
  
  FunctionToOpenSecondActivity = () =>
  {
    this.props.navigation.navigate('Second');
  }

  login() // definition of the function login
  {
    if(this.state.username && this.state.password)
    {  
      loaderHandler.showLoader("Authenticating");
      // loading

      var details = {
        'username': this.state.username,
        'password': this.state.password,
        };
    
      var formBody = [];
      for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      fetch('https://radiant-gorge-40900.herokuapp.com/', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
      }).then((response) => response.json())
        .then((responseJson) => {
          global.globalData = responseJson;
          loaderHandler.hideLoader();
          ToastAndroid.showWithGravity(
            'Authentication Successful',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
          this.FunctionToOpenSecondActivity();
        })
      .catch((error) => {
        loaderHandler.hideLoader();
        ToastAndroid.showWithGravity(
          'Authentication failed. Wrong username or password!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      });
    }
    else
    {
      ToastAndroid.showWithGravity(
        "Can't leave the input fields empty!",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  } // end of the function login

  render() {
    currentComponent = this.state.data;
    return (
        <View style={styles.container}>
          <Text style={{fontSize: 25}}>Welcome to SLCM App</Text>
          <TextInput
            style={{height: 50, width: 420, fontSize: 15, textAlign: 'center'}}
            placeholder="Username"
            onChangeText={(text) => this.setState({username: text})}
          />
          <TextInput
            style={{height: 50, width: 420, fontSize: 15, textAlign: 'center'}}
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={(text) => this.setState({password: text})}
          />
          <Button
            onPress={this.login.bind(this)}
            title="Login"
            color="#841584"
          />
          <BusyIndicator />
      </View>
    );
  }
}

class AttendanceScreen extends Component 
{
  static navigationOptions = {
    title: 'Attendance',
    header: null
  };

  render() 
  {
    attendance = global.globalData.attendance;
    return(
        <ScrollView>
          {
            attendance.map(function(item, id){
              return (
                <Card key={id}>
                  <CardTitle>
                    <Text>{item.name}</Text>
                  </CardTitle>
                  <CardContent>
                    <Text>Subject Code: {item.subject_code}</Text>
                    <Text>Total: {item.total}</Text>
                    <Text>Present: {item.present}</Text>
                    <Text>Absent: {item.absent}</Text>
                    <Text>Percentage: {item.percentage}</Text>
                  </CardContent>
                </Card>
              )
            })
          }
        </ScrollView>
    );
  }
} // end of the AttendanceScreen

class ProfileScreen extends Component 
{
  static navigationOptions = {
    title: 'Profile',
    header: null
  };

  render() 
  {
    profile = global.globalData.profile;
    return(
        <Text>Username: {profile.username}</Text>
    );
  }
} // end of the ProfileScreen


class NotificationScreen extends Component 
{
  static navigationOptions = {
    title: 'Notifications',
    header: null
  };

  render() 
  {
    return(
        <Text>Notifications... under progress.</Text>
    );
  }
} // end of the NotificationScreen


class UserActivity extends Component
{
  static navigationOptions =
  {
    title: 'Academic Details',
    // headerRight: <Button onPress={this.logout} title= "x" />
  };

  logout() 
  {
    console.log("Logout button pressed");
  }

  render()
  {
    ToastAndroid.showWithGravity(
      'Welcome, ' + global.globalData.profile.username + '!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
    const MainNavigator = TabNavigator({
      profile: { screen: ProfileScreen },
      attendance: { screen: AttendanceScreen },
      notification: {screen: NotificationScreen }
    });

    return (
        <MainNavigator />

    );
  }
}

export default Project = StackNavigator(
  {
  First: { screen: LoginActivity },
  Second: { screen: UserActivity }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    flex: 10,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});