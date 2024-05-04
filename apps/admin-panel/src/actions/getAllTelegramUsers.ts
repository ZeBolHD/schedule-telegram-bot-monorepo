"use client";

import axios from "axios";

import { FullTelegramUserType } from "@/types";
import { API_URL } from "@/lib/consts";

const getAllTelegramUsers = async (accessToken: string) => {
  console.log("get all telegram users");
  try {
    const { data } = await axios.get<FullTelegramUserType[]>(API_URL + "users/telegram", {
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
