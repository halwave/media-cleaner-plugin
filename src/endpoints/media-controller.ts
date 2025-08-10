import { Endpoint, Payload, Where } from 'payload'

const getUnusedMedia = async (payload: Payload) => {
  const unusedMedia = await payload.find({
    collection: 'media',
    where: {
      mediaUsageCount: {
        equals: 0,
      },
    },
  })

  console.log('Unused media found:', unusedMedia)

  return unusedMedia
}

const tryDeleteUnusedMedia = async (payload: Payload, unusedMedia: any) => {
  try {
    await Promise.all(
      unusedMedia.docs.map((media: any) => {
        return payload.delete({
          collection: 'media',
          id: media.id,
        })
      }),
    )
    return { success: true }
  } catch (error) {
    console.error('Failed to delete unused media:', error)
    return { success: false }
  }
}

export const deleteUnusedMedia: Endpoint = {
  path: '/api/media/delete-unused',
  method: 'delete',
  handler: async (req) => {
    const unusedMedia = await getUnusedMedia(req.payload)

    if (!unusedMedia) {
      return Response.json({ error: 'not found' }, { status: 404 })
    }

    const result = await tryDeleteUnusedMedia(req.payload, unusedMedia)

    if (!result.success) {
      return Response.json({ error: 'failed to delete unused media' }, { status: 500 })
    }

    return Response.json({ info: 'success' }, { status: 200 })
  },
}
