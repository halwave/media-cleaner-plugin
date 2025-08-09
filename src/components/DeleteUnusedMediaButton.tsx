import React from 'react'

export const DeleteUnusedMediaButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <button style={{ float: 'right', margin: '0 0 16px 16px' }} onClick={onClick}>
      Delete All Unused Media
    </button>
  )
}

export default DeleteUnusedMediaButton
