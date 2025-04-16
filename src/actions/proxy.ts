"use server";

import axios from "axios";

export async function getThumbnailData(assetId: number) {
   return (await axios(`https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&format=Png&size=420x420`)).data;
}

export async function getUserHeadshot(userId: number) {
   return (await axios(`https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=${userId}&size=420x420&format=png&isCircular=true`)).data;
}

export async function getUserInfo(userId: number) {
   return (await axios(`https://users.roblox.com/v1/users/${userId}`)).data;
}