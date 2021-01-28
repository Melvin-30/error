import React from 'react';
import * as firebase from 'firebase';
import { StyleSheet, Text, View,TouchableOpacity,KeyboardAvoidingView, Alert} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
export default class login extends React.Component{
    constructor(){
        super()
        this.state={
        EmailID:"",
        Password:""
    }
}
login=async(email,password)=>{
   
    if(email&&password){
        try {
            const response=await firebase.auth().signInWithEmailAndPassword(email,password)
        if(response){
            this.props.navigation.navigate("Issue")
        }
        } catch (error) {
            switch(error.code){
                case "auth/user-not-found":
                    Alert.alert("User Don't Exsists")
                    break 
                    case "auth/invalid-email":
                    Alert.alert("Incorrect Email or Password")
                    break
            }
        }
        
    }else{
        Alert.alert("Enter Email And Password")
    }

}    
render(){
        return(
            <KeyboardAvoidingView>
            <View>
                <Text>Login screen</Text>
                <TextInput
                style={styles.inputBox}
                placeholder="Email ID"
                keyoardType="email-address"
                onChangeText={(text)=>this.setState({EmailID:text})}
                />
                <TextInput
                style={styles.inputBox}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text)=>this.setState({Password:text})}
                />
                </View>
                <View>
                <TouchableOpacity
                style={styles.scanButton}
                onPress={()=>{this.login(this.state.EmailID,this.state.Password)}}>
                    <Text>Login</Text>
                </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
            )
    }
   
}
const styles=StyleSheet.create({
    scanButton:{
        backgroundColor:"red",
        width:50,
        borderWidth:1.5,
        borderLeftWidth:0
    },
    buttonText:{
        fontSize:20,
        textAlign:'center',
        marginTop:10,
    },
    inputBox:{
        width:200,
        height:40,
        borderWidth:1.5,
        borderRightWidth:0,
        fontSize:20
    }
})