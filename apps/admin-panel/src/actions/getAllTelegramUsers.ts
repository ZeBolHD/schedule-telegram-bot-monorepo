"use client";

import axios from "axios";

import { API_URL } from "@/lib/consts";
import { TelegramUser } from "@/types";

const getAllTelegramUsers = async (accessToken: string) => {
  console.log("get all telegram users");
  try {
    const { data } = await axios.get<TelegramUser[]>(API_URL + "users/telegram", {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default getAllTelegramUsers;
