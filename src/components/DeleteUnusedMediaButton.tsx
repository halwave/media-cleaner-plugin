'use client'
import React from 'react'
import { BeforeListTableServerProps } from 'payload'

async function deleteUnusedMedia(): Promise<void> {
  if (!confirm('Press OK to delete all unused media files.')) {
    return
  }

  await fetch('/api/media/delete-unused', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })
}

export function DeleteUnusedMediaButton(props: BeforeListTableServerProps) {
  return (
    <>
      <button style={{ float: 'right', margin: '0 0 16px 16px' }} onClick={deleteUnusedMedia}>
        Delete All Unused Media
      </button>
    </>
  )
}
