import React, {useState} from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import Login from './login'
import { BrowserRouter as Router,Route,Switch  } from 'react-router-dom';
import { UseStateValue } from './StateProvider';
function App() {
  const [{user},dispatch]= UseStateValue();
  //const [user,setUser] = useState(null);
  return (
    // BEM naming convention
    <div className="App">
        {!user ? 
        (
          <Login/>
        ):
        (
          <div className="app__body">
            <Router>
            <Sidebar/>
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat />
              </Route>
              <Route path="/">
                {/* <h1>Home Screen</h1> */}
              </Route>
            </Switch> 
            </Router>
            {/* Chat */}
          </div>
        )}
    </div>
  );
}

export default App;
