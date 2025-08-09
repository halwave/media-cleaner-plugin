import { Endpoint } from 'payload'
import { findMediaReferences } from '../services/findMediaReferences.js'

export const mediaReferencesEndpoint: Endpoint = {
  path: '/api/media-references/:mediaId',
  method: 'get',
  handler: async (req) => {
    const mediaId = req.routeParams?.mediaId
    if (!mediaId) {
      return Response.json({ error: 'Missing mediaId' }, { status: 400 })
    }
    const results = await findMediaReferences(req.payload, String(mediaId))
    return Response.json(results)
  },
}
