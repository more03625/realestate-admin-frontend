import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";
import LoginLayout from "./layouts/LoginLayout";

// Route Views
import BlogOverview from "./views/BlogOverview";
import Category from "./views/Category";
import SubCategory from "./views/SubCategory";
import City from "./views/masters/City";
import Features from "./views/masters/Features";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";
import Sellers from "./views/Sellers";
import Login from "./views/Login";
import Logout from "./views/Logout";
import Dashboard from "./views/Dashboard";


export default [
  {
    path: "/dashboard",
    layout: DefaultLayout,
    component: Dashboard
  },
  {
    path: "/logout",
    layout: DefaultLayout,
    component: Logout
  },
  {
    path: "/login",
    layout: LoginLayout,
    component: Login
  },
  {
    path: "/category",
    layout: DefaultLayout,
    component: Category
  },
  {
    path: "/sellers",
    layout: DefaultLayout,
    component: Sellers
  },
  {
    path: "/sub-category",
    layout: DefaultLayout,
    component: SubCategory
  },
  {
    path: "/location/city",
    layout: DefaultLayout,
    component: City
  },
  {
    path: "/location/features",
    layout: DefaultLayout,
    component: Features
  },
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/dashboard" />
  },
  {
    path: "/blog-overview",
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/add-new-post",
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/tables",
    layout: DefaultLayout,
    component: Tables
  },
  {
    path: "/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts
  }
];
