import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Host =
  window.location.host === "localhost:3000"
    ? "http://localhost:5254/"
    : "http://neprealestate.com:5254/";

export const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const Endpoints = {
  changeUserStatus: "admin/changeUserStatus",
  getSellers: "admin/getSellers",
  getCategories: "admin/getCategories"
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