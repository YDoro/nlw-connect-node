import { db } from '../drizzle/client'
import { subscriptions } from '../drizzle/schema/subscriptions'

interface SubscribeToEventParams {
  name: string
  email: string
}
export async function subscribeToEvent({
  email,
  name,
}: SubscribeToEventParams) {
  const result = await db
    .insert(subscriptions)
    .values({ email, name })
    .returning()

  return {
    subscriberId: result[0].id,
  }
}
