import React from 'react'
import { BeforeListTableServerProps } from 'payload'

export function DeleteUnusedMediaButton(props: BeforeListTableServerProps) {
  return (
    <>
      <button style={{ float: 'right', margin: '0 0 16px 16px' }}>Delete All Unused Media</button>
    </>
  )
}
