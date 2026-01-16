// routes/chat.routes.ts
import { Elysia, t } from 'elysia';

export const chatRoutes = new Elysia({ prefix: '/chat' })
  // Get all chats
  .get('/', async () => {
    return {
      success: true,
      chats: []
    };
  })

  // Get single chat by ID
  .get('/:id', async ({ params }) => {
    return {
      success: true,
      chat: {
        id: params.id,
        messages: []
      }
    };
  }, {
    params: t.Object({
      id: t.String()
    })
  })

  // Create new chat
  .post('/', async ({ body }) => {
    return {
      success: true,
      message: 'Chat created',
      chat: {
        id: crypto.randomUUID(),
        title: body.title,
        createdAt: new Date()
      }
    };
  }, {
    body: t.Object({
      title: t.String()
    })
  })

  // Send message to chat
  .post('/:id/messages', async ({ params, body }) => {
    return {
      success: true,
      message: 'Message sent',
      data: {
        chatId: params.id,
        content: body.content,
        timestamp: new Date()
      }
    };
  }, {
    params: t.Object({
      id: t.String()
    }),
    body: t.Object({
      content: t.String(),
      role: t.Optional(t.String())
    })
  })

  // Delete chat
  .delete('/:id', async ({ params }) => {
    return {
      success: true,
      message: 'Chat deleted',
      chatId: params.id
    };
  }, {
    params: t.Object({
      id: t.String()
    })
  });