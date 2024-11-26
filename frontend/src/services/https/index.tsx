import { UsersInterface } from "../../interfaces/IUser";

import { SignInInterface } from "../../interfaces/SignIn";

import axios from "axios";

const apiUrl = "http://localhost:8000";

const Authorization = localStorage.getItem("token");

const Bearer = localStorage.getItem("token_type");


const requestOptions = {

  headers: {

    "Content-Type": "application/json",

    Authorization: `${Bearer} ${Authorization}`,

  },

};


async function SignIn(data: SignInInterface) {

  return await axios

    .post(`${apiUrl}/signin`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function GetGender() {

  return await axios

    .get(`${apiUrl}/genders`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function GetUsers() {

  return await axios

    .get(`${apiUrl}/users`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function GetUsersById(id: string) {

  return await axios

    .get(`${apiUrl}/user/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function UpdateUsersById(id: string, data: UsersInterface) {

  return await axios

    .put(`${apiUrl}/user/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function DeleteUsersById(id: string) {

  return await axios

    .delete(`${apiUrl}/user/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function CreateUser(data: UsersInterface) {

  return await axios

    .post(`${apiUrl}/signup`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetPromotions() {

  return await axios

    .get(`${apiUrl}/promotions`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function GetPromotionById(id: string) {

  return await axios

    .get(`${apiUrl}/promotion/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function UpdatePromotionById(id: string, data: UsersInterface) {

  return await axios

    .put(`${apiUrl}/promotion/${id}`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function DeletePromotionById(id: string) {

  return await axios

    .delete(`${apiUrl}/promotion/${id}`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function CreatePromotion(data: UsersInterface) {

  return await axios

    .post(`${apiUrl}/promotion`, data, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetPromotionType() {

  return await axios

    .get(`${apiUrl}/types`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

async function GetPromotionStatus() {

  return await axios

    .get(`${apiUrl}/status`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}


async function GetTrip() {

  return await axios

    .get(`${apiUrl}/trip`, requestOptions)

    .then((res) => res)

    .catch((e) => e.response);

}

export {

  SignIn,

  GetGender,

  GetUsers,

  GetUsersById,

  UpdateUsersById,

  DeleteUsersById,

  CreateUser,



  GetPromotions,

  GetPromotionById,

  UpdatePromotionById,

  DeletePromotionById,

  CreatePromotion,


  GetPromotionType,
  GetPromotionStatus,
  

  GetTrip,

};