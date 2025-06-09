import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";
import {query} from "@/convex/_generated/server";


export default defineSchema({
    documents: defineTable({
        userId: v.string(),
        parentDoc: v.optional(v.id('documents')),
    }).index('by_user', ['userId'])
        .index('by_user_parent', ['userId', 'parentDoc'])
})

export const getSidebar = query({
    args : {
        parentDoc: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("User is not Authenticated")
        }

        const userId:string = identity.subject;

        return await ctx.db.query("documents")
            .withIndex("by_user_parent", (q) =>
                q
                    .eq("userId", userId)
                    .eq("parentDoc",args.parentDoc)
            ).collect()
    }
})