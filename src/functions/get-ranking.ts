import { inArray } from 'drizzle-orm'
import { db } from '../drizzle/client'
import { subscriptions } from '../drizzle/schema/subscriptions'
import { redis } from '../redis/client'

export async function getRanking() {
  const ranking = await redis.zrevrange('referral:ranking', 0, 2, 'WITHSCORES')
  const topsubscribers: Record<string, number> = {}

  for (let i = 0; i < ranking.length; i += 2) {
    topsubscribers[ranking[i]] = Number.parseInt(ranking[i + 1])
  }

  const subscribers = await db
    .select()
    .from(subscriptions)
    .where(inArray(subscriptions.id, Object.keys(topsubscribers)))

  return subscribers
    .map(s => {
      return {
        id: s.id,
        name: s.name,
        score: topsubscribers[s.id],
      }
    })
    .sort((a, b) => {
      return b.score - a.score
    })
}
