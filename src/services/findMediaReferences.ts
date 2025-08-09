import { Payload } from 'payload'

// Recursively flatten all fields in a collection config
function flattenFields(fields: any[]): any[] {
  const result: any[] = []
  for (const field of fields) {
    if (field.name && (field.type === 'relationship' || field.type === 'upload')) {
      result.push(field)
    }
    // Handle nested fields (array, group, blocks, tabs, collapsible)
    if (field.fields) {
      result.push(...flattenFields(field.fields))
    }
    if (field.blocks) {
      for (const block of field.blocks) {
        if (block.fields) {
          result.push(...flattenFields(block.fields))
        }
      }
    }
    if (field.tabs) {
      for (const tab of field.tabs) {
        if (tab.fields) {
          result.push(...flattenFields(tab.fields))
        }
      }
    }
  }
  return result
}

/**
 * Finds all references to a given media ID across all collections and fields that reference media.
 *
 * @param payload - The Payload instance
 * @param mediaId - The ID of the media to search for
 * @returns Array of references: { collection: string, doc: any, field: string }
 */
export async function findMediaReferences(payload: Payload, mediaId: string) {
  const results: Array<{ collection: string; doc: any; field: string }> = []
  const collections = payload.config.collections || []

  for (const collection of collections) {
    const allFields = flattenFields(collection.fields || [])
    // Only fields that reference media
    const refFields = allFields.filter(
      (field: any) =>
        (field.type === 'upload' && field.relationTo === 'media') ||
        (field.type === 'relationship' &&
          (field.relationTo === 'media' ||
            (Array.isArray(field.relationTo) && field.relationTo.includes('media')))),
    )
    if (refFields.length === 0) continue

    for (const field of refFields) {
      const where = { [field.name]: { equals: mediaId } }
      try {
        const docs = await payload.find({ collection: collection.slug, where, limit: 10 })
        for (const doc of docs.docs) {
          results.push({ collection: collection.slug, doc, field: field.name })
        }
      } catch (err) {
        continue
      }
    }
  }
  return results
}
