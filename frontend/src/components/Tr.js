import React from 'react'
import { useNavigate } from 'react-router-dom'

const Tr = ({children, app}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (app && app._id) {
      navigate(`/app/${app._id}`)
    } else {
      console.error('Invalid application data:', app)
    }
  }

  return (
    <tr 
      className='hover:bg-slate-500 font-bold text-center border-x-[1px] border-white h-8 text-sm cursor-pointer' 
      onClick={handleClick}
    >
      {children}
    </tr>
  )
}

export default Tr