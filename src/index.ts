import type { CollectionSlug, Config } from 'payload'
import { mediaReferencesEndpoint } from './endpoints/mediaReferences.js'
import { customEndpointHandler } from './endpoints/customEndpointHandler.js'

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
              label: 'Media Usage',
              type: 'text',
              readOnly: true,
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
