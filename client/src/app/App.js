import React from "react";
import Home from "../Components/Pages/Home/";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ConnectionStateProvider } from "../state/connectionContext";
import { GlobalContextProvider } from '../state/globalContext';
import "./App.scss";


function App() {
  return (
    <ConnectionStateProvider>
      <GlobalContextProvider>
        <Router>
          <Route
            render={({ location }) => (
              <Switch location={location} key={location.pathname}>
                <Route exact path="/" component={Home} />
                <Route exact path="/home/" component={Home} />
              </Switch>
            )}
          />
        </Router>
      </GlobalContextProvider>
    </ConnectionStateProvider>
  );
}
/**
<AnimatePresence exitBeforeEnter initial={false}>
</AnimatePresence>
 */
export default App;
