import { eq } from 'drizzle-orm'
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
  const subscribers = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.email, email))

  if (subscribers.length) {
    return { subscriberId: subscribers[0].id }
  }
  const result = await db
    .insert(subscriptions)
    .values({ email, name })
    .returning()

  return {
    subscriberId: result[0].id,
  }
}
