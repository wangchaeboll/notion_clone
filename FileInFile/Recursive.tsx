import {mutation} from "@/convex/_generated/server";
import {v} from "convex/values";
import {Doc, Id} from "@/convex/_generated/dataModel";

export const rstore = mutation({
    args: {id : v.id("documents")},
    handler:  async (ctx,args) => {

        const existingDoc = await ctx.db.get(args.id)

        const identity = await ctx.auth.getUserIdentity()

        const userId = identity?.subject


        const options : Partial<Doc<"documents">> = {
            isArchived: false
        }

        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db.query("documents")
                .withIndex("by_user_parent", (q) => (
                    q
                        .eq("userId", userId!)
                        .eq("parentDoc", documentId)
                )).collect()

            for (const child of children){
                await ctx.db.patch(child._id, {isArchived: false})

                // use for grandchildren
                await recursiveRestore(child._id)

                // {id="1",parentDoc=null}
                //     {id="2",parentDoc="1"} children
                //         {id="3",parentDoc="2"} grandchildren
                //     {id="4",parentDoc="1"} children
                //     {id="5",parentDoc="1"} children
            }

        }

        if(existingDoc?.parentDoc){
            const parent = await ctx.db.get(existingDoc.parentDoc);
            if(parent?.isArchived){
                options.parentDoc = undefined
            }
        }

        await ctx.db.patch(args.id, options)

        // this is the initialization
        await recursiveRestore(args.id)

        return existingDoc
    }
})

