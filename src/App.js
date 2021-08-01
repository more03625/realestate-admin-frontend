import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";


import Dashboard from "./views/Dashboard/Dashboard";
import City from "./views/location/City";
import Sellers from "./views/sellers/Sellers";
import Agents from "./views/Agent/Agents";
import Subscribers from "./views/Subcribers/Subcribers";
import Category from "./views/Category/Category";
import Subcategory from "./views/Subcategory/Subcategory";
import Features from "./views/features/Feature";
import Properties from "./views/properties/Properties";
import MyProperties from "./views/MyProperty/Properties";
import Login from "./views/login/Login";
import ForgotPassword from "./views/ForgotPass/ForgotPass";
import Logout from "./views/Logout";
import LoggedInProtected from "./views/protected/LoggedInProtected";

export default () => (
  <Router basename="/admin">
    <Switch>

      <Route exact path="/">
        <LoggedInProtected component={Dashboard} />
      </Route>

      <Route path="/dashboard">
        <LoggedInProtected component={Dashboard} />
      </Route>

      <Route path="/sellers">
        <LoggedInProtected component={Sellers} />
      </Route>

      <Route path="/agents">
        <LoggedInProtected component={Agents} />
      </Route>

      <Route path="/subscribers">
        <LoggedInProtected component={Subscribers} />
      </Route>

      <Route path="/category" >
        <LoggedInProtected component={Category} />
      </Route>

      <Route path="/sub-category">
        <LoggedInProtected component={Subcategory} />
      </Route>

      <Route path="/location/city">
        <LoggedInProtected component={City} />
      </Route>

      <Route path="/location/features">
        <LoggedInProtected component={Features} />
      </Route>

      <Route path="/properties">
        <LoggedInProtected component={Properties} />
      </Route>

      <Route path="/my-properties">
        <LoggedInProtected component={MyProperties} />
      </Route>

      <Route path="/logout">
        <LoggedInProtected component={Logout} />
      </Route>

      <Route exact path="/login">
        <LoggedInProtected component={Login} />
      </Route>

      <Route exact path="/forgot-password" component={ForgotPassword}>
      </Route>

    </Switch>
  </Router>
);
