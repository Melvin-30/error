import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity, Image,TextInput,KeyboardAvoidingView,ToastAndroid, Alert} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import firebase from "firebase";
import db from "../config.js"


export default class issues extends React.Component{
    constructor(){
        super();
        this.state={
            cameraPermission:null,
            scanned:false,
            scannedBookID:'',
            scannedStudentID:'',
            buttonState:"normal",
        transactionmsg : ''
        }
    }

    getCameraPermission=async id=>{
        const{status}=await Permissions.askAsync(Permissions.CAMERA)
        
        this.setState({
            cameraPermission:status==="granted",
            ButtonState:id,
            scanned:false
        })
    }

    handleBarCodeScanner=async({type,data})=>{
        const {ButtonState}=this.state
        if(ButtonState==="BookID"){
        this.setState({
            scanned:true,
            scannedBookID:data,
            buttonState:"normal"
        })
        }else if(ButtonState==="StudentId"){
            this.setState({
                scanned:true,
                scannedStudentID:data,
                buttonState:"normal"
            })  
        }
    }
    checkBookeligibility=async()=>{
        const bookref=await db.collection("Books").where("BookID",'==',this.state.scannedBookID).get()
        var Transactiontype=""
        if(bookref.docs.length===0){
            Transactiontype=false
        }else{
            bookref.docs.map((doc)=>{
                var book=doc.data()
                if(book.BookAvailability){
                    Transactiontype="Issue"
                }else{
                    Transactiontype="Return"
                }
            })
        }
        return Transactiontype
    }
    
    handledTransaction=async()=>{
        var Transactiontype=await this.checkBookeligibility();
        if(!Transactiontype){
            Alert.alert("The Book Doesn't Exsists in the Database")
            this.setState({
                scannedStudentID:'',
                scannedBookID:''
            })
        }else if(Transactiontype==="Issue"){
            var isStudentEligible=await this.checkforissue()
            if(isStudentEligible){
                this.initiateBookIssue()
            }
        }else{
            var isStudentEligible=await this.checkforReturn()
            if(isStudentEligible){
                this.initiateBookReturn()
            }
        }
        db.collection("Books").doc(this.state.scannedBookID).get().then((doc)=>{
            var book=doc.data()
            if(book.BookAvailability){
                this.initiateBookIssue()
                transactionmsg="Book Issued"
                console.log("true")
            }else{
                this.initiateBookReturn()
                transactionmsg="Book Returned"
                console.log("false")
            } 
        })
        this.setState({
            transactionmsg:transactionmsg
        })
    }
    checkforissue=async()=>{
        const studentref=await db.collection("Student").where("StudentID",'==',this.state.scannedStudentID).get()
        var isStudentEligible=""
        if(studentref.docs.length===0){
            this.setState({
                scannedStudentID:"",
                scannedBookID:""
            })
            isStudentEligible=false
            Alert.alert("The Student Doesn't Exsists")
        }else{
            studentref.docs.map((doc)=>{
                var student=doc.data()
                if(student.BooksIssued<2){
                    isStudentEligible=true
                }else{
                    isStudentEligible=false
                    Alert.alert("Already Issued Two Books")
                    this.setState({
                        scannedStudentID:"",
                        scannedBookID:""
                    })
                }
            })
        }
        return isStudentEligible
    }
    checkforReturn=async()=>{
        const Transref=await db.collection("Transaction").where("BookID",'==',this.state.scannedBookID).get()
        var isStudentEligible=""
        Transref.docs.map((doc)=>{
            var lasttrans=doc.data()
            if(lasttrans.StudentID===this.state.scannedStudentID){
                isStudentEligible=true
            }else{
                isStudentEligible=false
                Alert.alert("The Book Wasn't Issued by this student")
                this.setState({
                    scannedStudentID:"",
                    scannedBookID:""
                })
            }
        })
        return isStudentEligible
    }
    initiateBookIssue=async()=>{
        console.log("issue")
        console.log(this.state.scannedBookID)
        console.log(this.state.scannedStudentID)
        db.collection("Transaction").add({
            "StudentID":this.state.scannedStudentID,
            "BookID":this.state.scannedBookID,
            "Date":firebase.firestore.Timestamp.now().toDate(),
            "Transactiontype":"Issue"
        })
        console.log(this.state.scannedBookID)
        db.collection("Books").doc(this.state.scannedBookID).update({
          
            "BookAvailability":false
        })
        db.collection(Students).doc(this.state.scannedStudentID).update({
            "BooksIssued":firebase.firestore.FieldValue.increment(1)
        })
        this.setState({
            scannedBookID :'',
            scannedStudentID :''
        })
      
    }
    initiateBookReturn = async()=>{
        console.log("return")
        console.log(this.state.scannedBookID)
        console.log(this.state.scannedStudentID)
        db.collection("Transaction").add({
            "StudentID":this.state.scannedStudentID,
            "BookID":this.state.scannedBookID,
            "Date":firebase.firestore.Timestamp.now().toDate(),
            "Transactiontype":"Return"
        })
        console.log(this.state.scannedBookID)
        db.collection("Books").doc(this.state.scannedBookID).update({
            BookAvailability:true
        })
        db.collection("Students").doc(this.state.scannedStudentID).update({
            BooksIssued:firebase.firestore.FieldValue.increment(-1)
        })
        this.setState({
            scannedStudentID :'',
            scannedBookID : ''
        })
        
    }
    render(){
        const cameraPermission=this.state.cameraPermission;
        const scanned=this.state.scanned;
        const buttonState=this.state.buttonState
        if(buttonState!=="normal"&&cameraPermission){
            return(
                <BarCodeScanner
                onBarCodeScanned={scanned?undefined:this.handleBarCodeScanner}
                styles={StyleSheet.absoluteFillObject}/>
            );
        } 
        else if(buttonState==="normal"){
            return(
                
                <View style={styles.Container}>
                <View><Image
                source={require("../assets/booklogo.jpg")}
                style={{width:40,height:40}}
                /><Text style={{textAlign:"center",fontSize:30}}>Willy</Text>
                </View>
                <View style={styles.inputView}>
                <TextInput
                style={styles.inputBox}
                placeholder="bookID"
                onChangeText={text =>this.setState({scannedBookID:text})}
                value={this.state.scannedBookID}
                />
                <TouchableOpacity 
                style={styles.scanButton}
                onPress={()=>
                {this.getCameraPermission("BookId")}                
                }
                >
                    <Text style={styles.buttonText}>Scan</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.inputView}>
                <TextInput
                style={styles.inputBox}
                placeholder="StudentID"
                onChangeText={text =>this.setState({scannedStudentID:text})}
                value={this.state.scannedStudentID}
                />
                <TouchableOpacity 
                style={styles.scanButton}
                onPress={()=>
                {this.getCameraPermission("StudentId")}                
                }
                >
                 <Text style={styles.buttonText}>Scan</Text>
                </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity 
                    style={styles.submitButton}onPress={async()=>{var transactionmsg=await this.handledTransaction();
                    this.State({
                        scannedBookID :'',
                        scannedStudentID: ''
                    })
                    
                    
                    }}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
            )
        }
    }
}
const styles=StyleSheet.create({
    Container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    DisplayText:{
        fontSize:20
        //textDocumentLine:'underline',
    },
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
    inputView:{
        flexDirection:"row",
        margin:20,
    },
    inputBox:{
        width:200,
        height:40,
        borderWidth:1.5,
        borderRightWidth:0,
        fontSize:20
    },
    
})