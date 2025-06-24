import { v } from "convex/values";

import { mutation, query } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"

export const archive = mutation(
    {
        args: {id: v.id('documents')},
        handler: async (ctx, args) => {
            const identity = await ctx.auth.getUserIdentity()

            if(!identity){
                throw new Error("User is not Authenticated")
            }

            const userId = identity.subject;

            const existingDocument = await ctx.db.get(args.id);

            if(!existingDocument){
                throw new Error("Not found")
            }

            if(existingDocument.userId !== userId){
                throw new Error('Unauthorized')
            }

            const recursiveArchive = async (documentId : Id<"documents">)=> {
                const children = await ctx.db.query('documents')
                    .withIndex("by_user_parent", (q) => (
                        q.eq("userId", userId)
                            .eq("parentDoc", documentId)
                    )).collect()

                for (const child of children){
                    await ctx.db.patch(child._id, {
                        isArchived: true,
                    })

                    await recursiveArchive(child._id)
                }
            }

            const doc =  await ctx.db.patch(args.id, {
                isArchived: true,
            })

            await recursiveArchive(args.id)

            return doc
        }
    }
)

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
            )
            .filter((q)=>
                q.eq(q.field('isArchived'),false)
            )
            .order("desc")
            .collect()
    }
})

export const create = mutation(
    {
        args: {
            title: v.string(),
            parentDoc: v.optional(v.id('documents'))
        },
        handler: async (ctx, args) => {
            const identity = await ctx.auth.getUserIdentity()

            if(!identity){
                throw new Error("User is not Authenticated")
            }

            const userId = identity.subject;

            return await ctx.db.insert("documents", {
                title: args.title,
                userId,
                isArchived: false,
                parentDoc: args.parentDoc,
                isPublished: false
            })
        }
    }
)

export const getTrash = query({
    handler:  async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("User is not Authenticated")
        }

        const userId = identity.subject;

        return await ctx.db.query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId)
            )
            .filter((q)=>q.eq(q.field("isArchived"), true)
            )
            .order("desc")
            .collect()
    }
})

export const restore = mutation({
    args: {id : v.id("documents")},
    handler:  async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity){
            throw new Error("User is not Authenticated")
        }

        const userId = identity.subject;

        const existingDoc = await ctx.db.get(args.id)

        if(!existingDoc){ throw new Error("Not found")}

        console.log(existingDoc.userId , userId)
        if(existingDoc.userId !== userId) { throw new Error("Unauthorized")}

        const options : Partial<Doc<"documents">> = {
            isArchived: false
        }

        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db.query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId)
                        .eq("parentDoc", documentId)
                )).collect()

            for (const child of children){
                await ctx.db.patch(child._id, {isArchived: false})
                await recursiveRestore(child._id)
            }

        }

        if(existingDoc.parentDoc){
            const parent = await ctx.db.get(existingDoc.parentDoc);
            if(parent?.isArchived){
                options.parentDoc = undefined
            }
        }

        const docs = await ctx.db.patch(args.id, options)

        await recursiveRestore(args.id)

        return docs
    }
})

export const remove = mutation({
    args: { id : v.id("documents")},
    handler : async (ctx, args) => {
        const identity =await  ctx.auth.getUserIdentity()

        if(!identity) throw new Error("Not Authenticated")

        const userId = identity.subject

        const existingDoc = await ctx.db.get(args.id)

        if(!existingDoc){ throw new Error("Not found")}

        if(existingDoc.userId ! === userId) { throw new Error("Unauthorized")}

        return await ctx.db.delete(args.id)
    }
})

export const getSearch = query({
    handler:  async (ctx) => {
        const identity =await  ctx.auth.getUserIdentity()

        if(!identity) throw new Error("Not Authenticated")

        const userId = identity.subject;

        return await ctx.db.query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q)=>q.eq(q.field("isArchived"), false)).order("desc").collect()
    }
})

export const getById = query({
    args : { documentId: v.id("documents")},
    handler : async (ctx, args) => {
        const identity = await  ctx.auth.getUserIdentity()

        const doc = await ctx.db.get(args.documentId)

        if(!doc) throw new Error("Not Found.");

        // this is the line that make things work for non-user to look at it
        if(doc.isPublished && !doc.isArchived) return doc

        if(!identity) throw new Error("Not Authenticated")

        const userId = identity.subject

        if(doc.userId !== userId) throw new Error("Unauthorized")

        return doc
    }
})

export const update = mutation({
    args: { id : v.id("documents"), title: v.optional(v.string()), content: v.optional(v.string()), coverImage: v.optional(v.string()) , icon: v.optional(v.string()), isPublished : v.optional(v.boolean())},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) throw new Error("Unauthenticated")

        const userId = identity.subject

        const { id , ...rest } = args;

        const doc = await ctx.db.get(args.id)

        if(!doc) throw new Error("Not found");

        if(doc.userId !== userId ) throw new Error("Unauthorized")

        return await ctx.db.patch(args.id , { ...rest})
    }
})

export const removeIcon = mutation({
    args: { id: v.id("documents")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) throw new Error("Unauthenticated")

        const userId = identity.subject;

        const doc = await ctx.db.get(args.id)

        if(!doc) throw new Error("Not Found!")

        if(doc.userId !== userId) {
            throw new Error("Unauthorized")
        }

        return await ctx.db.patch(args.id, {
            icon: undefined
        })
    }
})

export const removeCover = mutation({
    args: { id: v.id("documents")},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) throw new Error("Unauthenticated")

        const userId = identity.subject;

        const doc = await ctx.db.get(args.id)

        if(!doc) throw new Error("Not Found!")

        if(doc.userId !== userId) {
            throw new Error("Unauthorized")
        }

        return await ctx.db.patch(args.id, {
            coverImage: undefined
        })
    }
})