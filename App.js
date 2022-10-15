import { StyleSheet, Text, View,TouchableOpacity,TextInput,ScrollView, Alert} from 'react-native';
import { theme } from './color';
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from '@expo/vector-icons'; 

export default function App() {

  const STORAGE_KEY = "@toDos";


  const [working,setWorking] = useState(true); 
  const travel = ()=>{setWorking(false)};
  const [toDos,setToDos] = useState({});
  const work = ()=>{setWorking(true)}; 
  const onChangeText = (payload) =>{
    setText(payload);
  }
  useEffect(() => {
    loadToDos();
  }, []);


  const [text,setText] = useState("");
  const addToDo = async()=>{
    if(text===""){
      return ;
    }
    const newToDos = Object.assign({},toDos,{[Date.now()]:{text,work:working}})
    setToDos(newToDos);
    setText("");
    await saveToDos(newToDos);
    console.log(newToDos);
  }

  const saveToDos = async (toSave) => {
    try{
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));

    }catch(e){

    }
  };

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };

  const deleteToDo = async(key)=>{
    Alert.alert("Do you want to delete?","진짜루?",
    [
      {text:"no"},
      {text:"Yes I do",
      style:"destructive",
      onPress:async()=>{
      const newToDos = {...toDos}; 
      delete newToDos[key];
      setToDos(newToDos);
      await saveToDos(newToDos);
      }}
    ]
    )
    
    return
      
  }

  return (
    <View style={styles.container}>
      {console.log(toDos)}
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
        <Text style={{...styles.btnText, color:working?"white":theme.grey}}>work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
        <Text style={{...styles.btnText, color: !working?"white":theme.grey}}>travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        value={text}
        placeholder={working?"Add a To Do" : "Where do you want to Go?"}
        style={styles.input}
        returnKeyType="done"
        />
      </View>
      <ScrollView>
      {Object.keys(toDos).map((key) =>
          toDos[key].work == working ? (
            <View style={styles.toDo} key={key}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={()=>{deleteToDo(key)}}>
              <Feather name="delete" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ) : null

        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header:{
    justifyContent:"space-between",
    flexDirection:"row",
    marginTop:100,

  },
  btnText:{
    fontSize:38,
    fontWeight:"600",
    color:theme.grey
  },
  input:{
    backgroundColor:"white",
    paddingVertical:10,
    paddingHorizontal:10,
    borderRadius:30,
    marginVertical:10
  },
  test:{
    color:"white"

  },
  toDo:{
    backgroundColor:theme.toDoBg,
    marginBottom:10,
    paddingVertical:20,
    paddingHorizontal:40,
    borderRadius:15,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  toDoText:{
    color:"white",
    fontSize:16,
  }

});