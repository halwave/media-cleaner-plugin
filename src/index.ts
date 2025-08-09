import type { CollectionSlug, Config, CollectionConfig } from 'payload'

export type MediaCleanerPluginConfig = {
  collections?: Partial<Record<CollectionSlug, true>>
  disabled?: boolean
}

export const mediaCleanerPlugin =
  (pluginOptions: MediaCleanerPluginConfig = {}) =>
  (incomingConfig: Config): Config => {
    let config = { ...incomingConfig }

    // Add a virtual field to the media collection for referenced posts
    config.collections = (config.collections || []).map((collection) => {
      if (collection.slug === 'media') {
        return {
          ...collection,
          fields: [
            ...(collection.fields || []),
            {
              name: 'referencedPosts',
              type: 'ui',
              admin: {
                position: 'sidebar',
                components: {
                  Field: 'media-cleaner-plugin/components/ReferencedPostsCell',
                },
              },
            },
          ],
        } as CollectionConfig
      }
      return collection
    })

    // Add to onInit
    config.onInit = async (payload) => {
      if (incomingConfig.onInit) await incomingConfig.onInit(payload)
      // Add additional onInit code here
    }

    return config
  }

export default mediaCleanerPlugin
