import { Pin } from "@prisma/client";
import { type AppContext } from "../lib/ctx";

export const notifyAboutMostLikedPins = async (ctx: AppContext) => {
    const mostLikedPins = await ctx.prisma.$queryRaw<
        Array<Pick<Pin, 'id' | 'title' > & { thisMonthLikesCount: number}>>
        `with "topPins" as (
	        select id, title,(
	        select count(*)::int from "PinLike" pL
	        where pL."pinId" = p."id"
		        and pL."createdAt" > now() - interval '1 month') as "thisMonthLikesCount"
		from "Pin" p
		where p."blockedAt" is null
		order by "thisMonthLikesCount" desc
		limit 3
        )
        select * from "topPins"
        where "thisMonthLikesCount" > 0`
        console.log(mostLikedPins);
}