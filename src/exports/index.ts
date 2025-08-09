// Minimal Media Cleaner Plugin export for Payload
// Replace this with your actual plugin implementation

import type { Config } from 'payload'

export const mediaCleanerPlugin =
  (pluginOptions?: any) =>
  (config: Config): Config => {
    // Plugin logic will go here
    return config
  }

export default mediaCleanerPlugin
