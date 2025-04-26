"use server";

import { auth } from "@/auth";
import { db, votes, voteTypeEnum } from "@/db";
import { and, count, eq } from "drizzle-orm";

export async function like(site: string): Promise<{ error?: string, success?: "added" | "removed" }> {
   let session;
   try {
      session = await auth();
   } catch {
      return { error: "You are not authenticated" };
   }
   if (!session) return { error: "You are not authenticated" };

   const userId = session.user.id;
   if (!userId) return { error: "You are not authenticated" };

   const isLiking = await db
      .select()
      .from(votes)
      .where(and(eq(votes.userId, userId), eq(votes.site, site)))
      .then((res) => res[0]?.vote) === "like";

   await db
      .delete(votes)
      .where(and(eq(votes.userId, userId), eq(votes.site, site)))

   if (!isLiking) {
      await db.insert(votes).values({
         userId,
         site,
         vote: "like",
         createdAt: new Date(),
      });
   }

   return { success: isLiking ? "removed" : "added" };
}

export async function dislike(site: string): Promise<{ error?: string, success?: "added" | "removed" }> {
   let session;
   try {
      session = await auth();
   } catch {
      return { error: "You are not authenticated" };
   }
   if (!session) return { error: "You are not authenticated" };

   const userId = session.user.id;
   if (!userId) return { error: "You are not authenticated" };

   const isDisliking = await db
      .select()
      .from(votes)
      .where(and(eq(votes.userId, userId), eq(votes.site, site)))
      .then((res) => res[0]?.vote) === "dislike";

   await db
      .delete(votes)
      .where(and(eq(votes.userId, userId), eq(votes.site, site)))

   if (!isDisliking) {
      await db.insert(votes).values({
         userId,
         site,
         vote: "dislike",
         createdAt: new Date(),
      });
   }

   return { success: isDisliking ? "removed" : "added" };
}

export async function getVote(site: string): Promise<{ error?: string, success?: typeof voteTypeEnum.enumValues[number] }> {
   let session;
   try {
      session = await auth();
   } catch {
      return { error: "You are not authenticated" };
   }
   if (!session) return { error: "You are not authenticated" };

   const userId = session.user.id;
   if (!userId) return { error: "You are not authenticated" };

   return {
      success: await db
         .select()
         .from(votes)
         .where(and(eq(votes.userId, userId), eq(votes.site, site)))
         .then((res) => res[0]?.vote),
   }
}

export async function getRating(site: string): Promise<number | null> {
   const likeResult = await db
      .select({ count: count() })
      .from(votes)
      .where(and(eq(votes.vote, "like"), eq(votes.site, site)));

   const dislikeResult = await db
      .select({ count: count() })
      .from(votes)
      .where(and(eq(votes.vote, "dislike"), eq(votes.site, site)));

   const likes = likeResult[0]?.count ?? 0;
   const dislikes = dislikeResult[0]?.count ?? 0;

   if (likes === 0 && dislikes === 0) return null;

   return ((likes - dislikes) / (likes + dislikes)) * 100;
}