import React from 'react'
import { useNavigate } from 'react-router-dom'

const Tr = ({children, app}) => {
  const navigate = useNavigate()

  return (
    <tr className='hover:bg-slate-500 font-bold text-center border-x-[1px] border-white h-8 text-sm' onClick={() => navigate(`/app/${app.id}`)}>
        {children}
    </tr>
  )
}

export default Tr