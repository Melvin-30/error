import React from 'react';
import { Text, View,StyleSheet } from 'react-native';
import {FlatList, ScrollView, TextInput, TouchableOpacity} from 'react-native-gesture-handler'
import db from '../config'
export default class Search extends React.Component{
    constructor(props){
        super(props);
        this.state={
            allTrans:[],
            lastTrans:null,
            Search:''            
        }
    }
    componentDidMount=async()=>{
        const query=await db.collection('Transaction').limit(10).get()
        query.docs.map((doc)=>{
            this.setState({
                allTrans:[],
                lastTrans:doc
            })
        })
    }
    fetchmoretrans=async()=>{
        var text=this.state.Search.toUpperCase()
        var enteredText=text.split("")
        if(enteredText[0].toUpperCase()==="B"){
            const query=await db.collection("Transaction").where("BookID","==",text).startAfter(this.state.lastTrans).limit(10).get()
            query.docs.map((doc)=>{
                this.setState({
                    allTrans:[this.state.allTrans,doc.data()],
                    lastTrans:doc
                })
            })
        }else if(enteredText[0].toUpperCase()==="S"){
            const query=await db.collection("Transaction").where("StudentID","==",text).startAfter(this.state.lastTrans).limit(10).get()
            query.docs.map((doc)=>{
                this.setState({
                    allTrans:[this.state.allTrans,doc.data()],
                    lastTrans:doc
                })
            })
        }
    }
    SearchTrans=async(text)=>{
        var text=this.state.Search.toUpperCase()
        var enteredText=text.split("")
        if(enteredText[0].toUpperCase()==="B"){
            const query=await db.collection("Transaction").where("BookID","==",text).startAfter(this.state.lastTrans).limit(10).get()
            query.docs.map((doc)=>{
                this.setState({
                    allTrans:[this.state.allTrans,doc.data()],
                    lastTrans:doc
                })
            })
        }else if(enteredText[0].toUpperCase()==="S"){
            const query=await db.collection("Transaction").where("StudentID","==",text).startAfter(this.state.lastTrans).limit(10).get()
            query.docs.map((doc)=>{
                this.setState({
                    allTrans:[this.state.allTrans,doc.data()],
                    lastTrans:doc
                })
            })
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <View styles={styles.Searchbar}>
                    <TextInput style={styles.bar}
                    placeholder="Enter BookID/StudentID"
                    onChangeText={(text)=>{
                        this.setState({
                            Search:text
                        })
                    }}
                    />
                    <TouchableOpacity style={styles.SearchButton}
                    onPress={()=>{this.SearchTrans(this.state.Search)}}>
                        <Text>Search</Text>                                                
                    </TouchableOpacity>
                </View>
            <FlatList 
            data={this.state.allTrans}
            renderItem={({item})=>(
                <View style={{borderBottomWidth:2}}>
                <Text>{"Transaction Type : "+item.Transactiontype}</Text>
                <Text>{"BookID : "+item.BookID }</Text>
                <Text>{"StudentID : "+item.StudentID }</Text>
                <Text>{"Date : "+item.Date.toDate() }</Text>
            </View>
            )}
            keyExtractor={(item,index)=>index.toString()}    
            onEndReached={this.fetchmoretrans}
            onEndReachedThreshold={0.7}          
        />
        </View>
        )
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1, 
        marginTop:20
    },
    Searchbar:{
        flexDirection:"Row",
        height:40,
        width:"auto",
        borderWidth:0.5,
        alignItems:"center",
        backgroundColor:"grey"
    },
    SearchButton:{
        borderWidth:1,
        height:30,
        width:50,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"green"
    },
    bar:{
        borderWidth:2,
        height:30,
        width:300,
        paddingLeft:10
    }
})