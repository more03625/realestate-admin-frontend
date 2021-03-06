import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";


import Dashboard from "./views/Dashboard/Dashboard";
import City from "./views/location/City";
import State from "./views/location/State/State";
import District from "./views/location/District/District";
import AreaAddress from "./views/location/AreaAddress/AreaAddress";
import Sellers from "./views/sellers/Sellers";
import SellersProperties from "./views/sellersproperties/SellersProperties";
import Agents from "./views/Agent/Agents";
import Subscribers from "./views/Subcribers/Subcribers";
import Banners from "./views/Banners/Banners";
import Category from "./views/Category/Category";
import Subcategory from "./views/Subcategory/Subcategory";
import Features from "./views/features/Feature";
import Settings from "./views/settings/Settings";
import SettingsList from "./views/settingslist/SettingsList";
import News from "./views/news/News";
import Editnews from "./views/news/Editnews";
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
      <Route path="/settings-list">
        <LoggedInProtected component={SettingsList} />
      </Route>
      <Route path="/dashboard">
        <LoggedInProtected component={Dashboard} />
      </Route>

      <Route exact path="/sellers">
        <LoggedInProtected component={Sellers} />
      </Route>
      <Route exact path="/seller/properties/:sellerID">
        <LoggedInProtected component={SellersProperties} />
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
      <Route path="/location/state">
        <LoggedInProtected component={State} />
      </Route>
      <Route path="/location/district">
        <LoggedInProtected component={District} />
      </Route>
      <Route path="/location/area">
        <LoggedInProtected component={AreaAddress} />
      </Route>

      <Route path="/features">
        <LoggedInProtected component={Features} />
      </Route>

      <Route path="/properties">
        <LoggedInProtected component={Properties} />
      </Route>

      <Route path="/my-properties">
        <LoggedInProtected component={MyProperties} />
      </Route>
      <Route path="/settings/:slug">
        <LoggedInProtected component={Settings} />
      </Route>
      <Route path="/news/add-news">
        <LoggedInProtected component={Editnews} />
      </Route>
      <Route exact path="/news">
        <LoggedInProtected component={News} />
      </Route>
      <Route path="/news/edit/:slug/:newsID">
        <LoggedInProtected component={Editnews} />
      </Route>
      <Route path="/logout">
        <LoggedInProtected component={Logout} />
      </Route>
      <Route path="/banners">
        <LoggedInProtected component={Banners} />
      </Route>

      <Route exact path="/login">
        <LoggedInProtected component={Login} />
      </Route>
      settings
      <Route exact path="/forgot-password" component={ForgotPassword}>
      </Route>

    </Switch>
  </Router>
);
