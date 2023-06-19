import {useState} from 'react'
import ApplicationRow from './ApplicationRow'
import TableFooter from './TableFooter'
import usePaginate from "../usePaginate"

const Table = ({apps, perPage}) => {
    const [page, setPage] = useState(1)
    const {slice, range} = usePaginate(apps, page, perPage)

    const noApplications = slice.length === 0

  return (
    <div className='max-h-full'>
        <table className='w-full max-h-full border-2 border-white table-fixed'>
            <thead>
                <tr className='bg-slate-600 h-10 max-h-10'>
                    <th className='w-1/5'>Company</th>
                    <th className='w-[10%]'>Status</th>
                    <th className='w-1/5'>Title</th>
                    <th className='w-1/5'>Location</th>
                    <th className='w-1/5'>Date Applied</th>
                </tr>
            </thead>
            <tbody className='overflow-y-scroll max-h-full'>
                {
                    !noApplications?
                    slice.map((app, index) => (
                        <ApplicationRow app={app} key={index}/>
                    ))
                    :
                    null
                }
            </tbody>
        </table>
        {noApplications? 
            <h1 className='text-xl mt-2 text-center'>No Applications to show.</h1>
            :
            <TableFooter len={apps.length} range={range} page={page} setPage={setPage} slice={slice}/>
        }
    </div>
  )
}

export default Table