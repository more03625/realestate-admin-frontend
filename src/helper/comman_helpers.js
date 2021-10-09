import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Host = window.location.host === "realestate-frontend.netlify.app" ? "http://neprealestate.com:5254" : "http://localhost:5254"; //Node URL

export const FrontEndURL = window.location.host === "neprealestate.com" ? "http://neprealestate.com/" : "http://localhost:3000/"; // Home Website

export const rowsLimit = 20;

export const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
export const convertToSlug = (blogTitle) => {
  return blogTitle
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};
export const Endpoints = {
  changeUserStatus: "/admin/changeUserStatus",
  getSellers: "/admin/getSellers",
  getAgents: "/admin/getAgents",
  getCategories: "/admin/getCategories",
  editCategory: "/admin/editCategory",
  addCategory: "/admin/addCategory",
  getSubCategories: "/admin/getSubCategories?id=1",
  addSubCategory: "/admin/addSubCategory",
  editSubCategory: "/admin/editSubCategory",
  getCities: "/admin/getCities",
  addCity: "/admin/addCity",
  editCity: "/admin/editCity",
  getStates: "/users/getStates",
  Login: "/users/login",
  ForgotPassword: "/users/forgotPassword",
  getFeatures: "/admin/getfeatures?id=1",
  addfeatures: "/admin/addfeatures",
  editFeatures: "/admin/editfeatures",
  getProperties: "/property/getPropertiesWithFilters",
  updatePropertyStatus: "/admin/updatePropertyStatus",
  agentList: "/admin/agentList",
  getSubscribers: "/admin/getSubscribers",
  getPropertyTypes: "/users/getPropertyTypes?id=",
  addAdminCost: "/admin/addAdminCost",
  getAllSettings: "/admin/getAllSettings",
  getSettingBySlug: "/admin/get-settings-by-slug",
  getPropertiesBySellerID: "/property/getPropertiesBySellerID",
  addSettings: "/admin/add-settings",
  editSettings: "/admin/edit-settings",
  getNews: "/news/getNews",
  getNewsDetails: "/news/getNewsDetails?id=",
  addNews: "/news/addNews",
  editNews: "/news/editNews",
  deleteNews: "/news/deleteNews?id=",
  addState: "/admin/addState",
  editState: "/admin/editState",
  getDistricts: "/admin/getDistricts",
  addDistrict: "/admin/addDistrict",
  editDistrict: "/admin/editDistrict",
  getAreaAddresses: "/admin/getAreaAddresses",
  addAreaAddress: "/admin/addAreaAddress",
  editAreaAddress: "/admin/editAreaAddress",
  getBanners: "/admin/getBanners",
  addBanner: "/admin/add-banner",
  editBanner: "/admin/edit-banner",
  deleteBanner: "/admin/delete-banner",

};
export const successToast = (message = "✅" + " Success!") => {
  toast.success(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });
};
export const errorToast = (message = "❌" + " Error") => {
  toast.error(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });
};
export const errorStyle = {
  color: 'red',
  fontSize: '14px'
}
export const successStyle = {
  color: 'green',
  fontSize: '14px'
}
export const getUserToken = () => {
  return JSON.parse(localStorage.getItem('token'));
}
export const cleanObject = (obj) => {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "") {
      delete obj[propName];
    }
  }
  return obj
}
export const convertToCSV = (ArrayOfObjects) => {
  const array = [Object.keys(ArrayOfObjects[0])].concat(ArrayOfObjects);
  return array.map((it) => {
    return Object.values(it).toString()
  }).join('\n')
}
export const exportToCSV = (ArrayOfObjects) => {
  var encodedUri = encodeURI(convertToCSV(ArrayOfObjects));
  var csv = 'data:text/csv;charset=utf-8,' + encodedUri
  var link = document.createElement("a");
  link.setAttribute("href", csv);
  link.setAttribute("download", "Properties.csv");
  document.body.appendChild(link);
  link.click();
}
export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
export function createReader(file, whenReady) {
  var reader = new FileReader;
  reader.onload = function (evt) {
    var image = new Image();
    image.onload = function (evt) {
      var width = this.width;
      var height = this.height;
      if (whenReady) whenReady(width, height, file);
    };
    image.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}