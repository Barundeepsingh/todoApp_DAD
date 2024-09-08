import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React from 'react';
import "./App.css";
import {Login} from './pages/login/Login';
import {Navbar} from './components/navbar/navbar';
import SignUp from './pages/signUp/SignUp';
import TodoList from './pages/create-todo/TodoList';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path ='/login' element={<Login/>} />
          <Route path ='/signUp' element={<SignUp/>} />
          <Route path ='/todoList' element={<TodoList/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
