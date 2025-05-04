import { useState } from 'react'
import firebaseConfig from './components/Authentication/firebase.config'
import './App.css'
import ToDoList from './components/TodoList/ToDoList'

function App() {

  return (
    <>
      <ToDoList />
    </>
  )
}

export default App
