import React from 'react'

// This sidebar component will show which documents reference the current media item.
// You can enhance this to fetch and display actual usage data based on the media ID.
const MediaUsageSidebar: React.FC<{ value?: any; data?: { id: string } }> = ({ data }) => {
  // TODO: Replace this stub with logic to fetch and display references to this media item (data.id)
  return (
    <div style={{ padding: '1rem' }}>
      <h4>Media Usage</h4>
      <div>Referenced by: (stub)</div>
    </div>
  )
}

export default MediaUsageSidebar
