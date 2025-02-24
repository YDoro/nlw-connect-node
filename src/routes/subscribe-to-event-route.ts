import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { subscribeToEvent } from '../functions/subscribe-to-event'

export const subscribeToEventRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/subscriptions',
    {
      schema: {
        summary: 'subscribes user to the event',
        tags: ['susbscription'],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        response: {
          201: z.object({
            subscriberId: z.string(),
          }),
        },
      },
    },
    async (req, reply) => {
      const { email, name } = req.body

      const { subscriberId } = await subscribeToEvent({ email, name })
      return reply.status(201).send({
        subscriberId,
      })
    }
  )
}
