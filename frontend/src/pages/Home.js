import {useEffect, useState} from 'react'
import Nav from '../components/Nav'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/Auth'
import conf from "../conf.json"
import {AiOutlinePlus, AiOutlineSearch} from 'react-icons/ai'
import { SyncLoader } from "react-spinners";
import Table from '../components/Table'

const Home = () => {
  const [apps, setApps] = useState([])
  const [filteredApps, setFilteredApps] = useState([])
  const [filter, setFilter] = useState("")
  const [loading, setLoading] = useState(true)

  const auth = useAuth()
  const navigate = useNavigate()

  const filterApps = () => {
    let shown = apps.filter(app => app.company.toLowerCase().includes(filter) 
      || app.status.toLowerCase().includes(filter)
      || app.location.toLowerCase().includes(filter))
    setFilteredApps(shown)
  }

  useEffect(() => {
    if(auth.user) {
      fetch(conf.url + `/apps/${auth.user.username}`, {
        headers: {
          "Authorization": JSON.parse(localStorage.getItem("creds"))
        }
      })
      .then(res => res.json())
      .then(data => {
        if(data.data) {
          setApps(data.data.sort((a,b) => a.application_date < b.application_date))
          setFilteredApps(data.data)
        }
        setLoading(false)
      })
    }
  },[])

  useEffect(() => {
    filterApps()
  },[filter])

  return (
    <div className='h-full flex flex-col text-white border-4 border-blue-400'>
      <Nav/>
      {
        auth.user?
            <div className='w-3/4 mx-auto'>
              {loading?
                <div className='flex mx-auto justify-center'>
                  <SyncLoader color="#FFF" />
                </div> 
                
              :
                <>
                  <div className='flex justify-end m-2 text-xl gap-3'>
                    <AiOutlineSearch className='text-3xl'/>
                    <input type="text" placeholder="Filter applications" className='rounded-full text-center text-black h-[25px] p-5' onChange={e => setFilter(e.target.value.toLowerCase())}/>
                    <button className='flex rounded-full w-fit p-5 h-[25px] justify-center items-center bg-green-500 text-black' onClick={() => navigate("/app/create")}>
                      <AiOutlinePlus/> Add Application
                    </button>
                  </div>
                  <Table apps={filteredApps} perPage={15}/>
                </>}
            </div>
        :
        <Navigate to="/login"/>
      }
    </div>
  )
}

export default Home