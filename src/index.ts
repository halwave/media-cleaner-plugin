import type { CollectionSlug, Config } from 'payload'

export type MediaCleanerPluginConfig = {
  collections?: Partial<Record<CollectionSlug, true>>
  disabled?: boolean
}

export const mediaCleanerPlugin =
  (pluginOptions: MediaCleanerPluginConfig = {}) =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    config.collections = (config.collections || []).map((collection) => {
      if (collection.slug === 'media') {
        return {
          ...collection,
          fields: [
            ...(collection.fields || []),
            {
              name: 'mediaUsage',
              type: 'join',
              collection: 'posts',
              on: 'media',
              readOnly: true,
            },
            {
              name: 'mediaUsageCount',
              label: 'Number of References',
              type: 'number',
              hooks: {
                afterRead: [
                  ({ data }) => {
                    return `${data?.mediaUsage.docs.length}`
                  },
                ],
              },
            },
          ],
          admin: {
            ...(collection.admin || {}),
            components: {
              ...(collection.admin?.components || {}),
              beforeListTable: ['media-cleaner-plugin/rsc#DeleteUnusedMediaButton'],
            },
          },
        }
      }
      return collection
    })

    // Register the endpoint automatically
    config.endpoints = [...(config.endpoints || [])]

    if (pluginOptions.disabled) {
      return config
    }

    if (!config.endpoints) {
      config.endpoints = []
    }

    if (!config.admin) {
      config.admin = {}
    }

    if (!config.admin.components) {
      config.admin.components = {}
    }

    const incomingOnInit = config.onInit

    config.onInit = async (payload) => {
      // Ensure we are executing any existing onInit functions before running our own.

      if (incomingOnInit) {
        await incomingOnInit(payload)
      }
    }

    return config
  }

export default mediaCleanerPlugin
