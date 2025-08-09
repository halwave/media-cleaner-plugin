import type { CollectionSlug, Config } from 'payload'
import { mediaReferencesEndpoint } from './endpoints/mediaReferences.js'

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
              type: 'ui',
              admin: {
                position: 'sidebar',
                components: {
                  Field: require('./components/MediaUsageSidebar').default,
                },
              },
            },
          ],
          admin: {
            ...(collection.admin || {}),
            components: {
              ...(collection.admin?.components || {}),
              beforeListTable: [
                require('./components/DeleteUnusedMediaButton').default,
                ...((collection.admin?.components?.beforeListTable as any[]) || []),
              ],
            },
          },
        }
      }
      return collection
    })

    // Register the endpoint automatically
    config.endpoints = [...(config.endpoints || []), mediaReferencesEndpoint]
    return config
  }

export default mediaCleanerPlugin
