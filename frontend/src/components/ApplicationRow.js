import React from 'react'
import Tr from "./Tr"
import moment from 'moment'

const ApplicationRow = ({app}) => {
    
    const colors = {
        submitted : "bg-green-500",
        interviewing: "bg-yellow-500",
        rejected: "bg-red-500",
        deferred: "bg-blue-500"
    }

    function getColor(appStatus) {
        switch(appStatus.toLowerCase()) {
            case "submitted":
                return colors.submitted
            case "interviewing": 
                return colors.interviewing
            case "rejected": 
                return colors.rejected
            case "deferred":
                return colors.deferred
            default:
                return ""

        }
    }

  return (
    <Tr className='text-center border-x-[1px] border-white' app={app}>
        <td className='border-[1px] border-white'>{app.company}</td>
        <td className={'border-[1px] border-white text-black ' + getColor(app.status)}>{app.status}</td>
        <td className={'border-[1px] border-white'}>{app.title}</td>
        <td className='border-[1px] border-white'>{app.location}</td>
        <td className='border-[1px] border-white'>{moment(app.application_date).format('MMM Do YYYY, h:mm a')}</td>
    </Tr>
  )
}

export default ApplicationRow