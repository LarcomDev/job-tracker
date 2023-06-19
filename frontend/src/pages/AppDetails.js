import {useEffect, useState} from 'react'
import conf from "../conf.json"
import {SyncLoader} from "react-spinners"
import { useParams, Link } from 'react-router-dom'
import { AiOutlinePlus } from 'react-icons/ai'
import {TiDelete} from "react-icons/ti"
import { useNavigate } from 'react-router-dom'
import Accordion from '../components/Accordion'
import NewNoteCard from '../components/NewNoteCard'

const AppDetails = () => {
    const [application, setApplication] = useState({})

    const [company, setCompany] = useState("")
    const [roleTitle, setRoleTitle] = useState("")
    const [status, setStatus] = useState("")
    const [location, setLocation] = useState("")
    const [link, setLink] = useState("")
    const [skills, setSkills] = useState([])
    const [skill, setSkill] = useState('')
    const [notes, setNotes] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [isEditable, setEditable] = useState(false)
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        fetch(conf.url + `/apps/id/${id}`, {
            mode: "cors",
            headers : {
                "Authorization": JSON.parse(localStorage.getItem("creds"))
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.data) {
                setApplication(data.data)
            }
        })
    },[])

    useEffect(() => {
        console.log(application)
        setCompany(application.company)
        setRoleTitle(application.title)
        setStatus(application.status)
        setLocation(application.location)
        setLink(application.link)
        setSkills(application.skills)
        setNotes(application.notes)
        setLoading(false)
    }, [application])

    const handleUpdate = (e) => {
        e.preventDefault()
        setError(false)

        if(company.length === 0 || status.length === 0 || roleTitle.length === 0) {
            setError(true)
        } else{
            fetch(conf.url + `/apps/${id}`, {
                method: "PUT",
                mode: "cors",
                headers :{
                    "Authorization" : JSON.parse(localStorage.getItem("creds"))
                },
                body: JSON.stringify({company: company, title: roleTitle, location: location, status: status, link: link, skills: skills})
            }).then(navigate(`/`))
        }
    }

    const handleNewNote = () => {
        
    }

    const addSkill = (e,skill) => {
        e.preventDefault()

        if(skill.includes(",")) {
            let skillsList
            if(skills) {
                skillsList = skill.split(",").concat(skills).filter(item => item.length > 0)
            } else {
                skillsList = skill.split(",").filter(item => item.length > 0)
            }
            setSkills(skillsList)
        } else {
            if(skills) {
                setSkills([...skills, skill])
            } else {
                setSkills([skill])
            }
        }
        setSkill("")
    }

    const removeSkill = (index) => {
        let left = skills.slice(0, index)
        let right = skills.slice(index + 1)
        setSkills([...left,...right])
    }

  return (
    <div className='max-h-screen flex justify-center items-center'>
        {loading?
            <SyncLoader color="#FFF"/>
            :
            <div className='flex gap-5 w-full max-h-screen p-10'>
                <div className='bg-slate-600 rounded-xl shadow-xl w-full text-center p-5 flex flex-col'>
                    <div className='flex justify-center m-5 gap-3'>
                        <button className='flex rounded-full w-fit p-5 h-[25px] justify-center items-center bg-yellow-500 text-black' onClick={() => {setEditable(!isEditable)}}>
                            <AiOutlinePlus/> Toggle Edit Mode
                        </button>
                        <Link to="/">
                            <button className='flex justify-center rounded-full w-fit p-5 h-[25px] items-center text-black bg-blue-500'>Back to home</button>
                        </Link>
                        
                    </div>
                    <div className='grid grid-cols-2 text-white'>
                        <div className='w-full text-black flex flex-col gap-2'>
                            <div className='flex gap-5 mx-auto'>
                                <h2 className='text-2xl text-white'>Details</h2>
                                {isEditable?
                                    <p className='text-2xl text-green-600 font-bold'>Edits Enabled</p>
                                    :
                                    <p className='text-2xl text-red-600 font-bold'>Edits Disabled</p>
                                }
                            </div>
                            <label className='text-left text-md text-white'>Company<span className='text-red-400'>*</span></label>
                            <input disabled type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} className='h-10 rounded-lg p-2'/>
                            <label className='text-left text-md text-white'>Role Title<span className='text-red-400'>*</span></label>
                            <input disabled={!isEditable} type="text" placeholder="Role Title" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} className='h-10 rounded-lg p-2'/>
                            <label className='text-left text-md text-white'>Location<span className='text-red-400'>*</span></label>
                            <input disabled={!isEditable} type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className='h-10 rounded-lg p-2'/>
                            <label className='text-left text-md text-white'>Link</label>
                            {link && !isEditable?
                                link.startsWith("https://") || link.startsWith("http://")?
                                    <a href={link} target="_blank" rel="noreferrer" className='flex justify-center rounded-full w-fit p-5 h-[25px] items-center text-black bg-blue-500'>Go to Job Posting</a>
                                    :
                                    <>
                                        <p className='text-red-500 text-xl text-start'>Missing or invalid link.</p>
                                        <p className='text-red-500 text-md text-start'>Links must begin with https:// or http://</p>
                                    </>
                                    
                                :
                                <input disabled={!isEditable} type="text" placeholder="Link to job post" value={link} onChange={(e) => setLink(e.target.value)} className='h-10 rounded-lg p-2'/>
                            }
                            <label className='text-left text-md text-white'>Status<span className='text-red-400'>*</span></label>
                            <select disabled={!isEditable} value={status} onChange={(e) => setStatus(e.target.value)} className='h-10 rounded-lg p-2'>
                                <option value="">--Select Application Status--</option>
                                <option value="Submitted">Submitted</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Deferred">Deferred for another role</option>
                            </select>
                            {isEditable?
                                <button disabled={!isEditable} className={'flex justify-center rounded-full w-fit p-5 h-[25px] items-center text-black bg-blue-500'}
                                    onClick={handleUpdate}>Apply Changes</button>
                                :
                                null
                            }
                        </div>

                        {/* Skills side */}
                        <div className='w-full p-10 flex flex-col gap-2'>
                            <h2 className='text-2xl border-b-4 border-black'>Skills</h2>
                            {isEditable?
                                <div className='flex justify-center mb-5 text-black'>
                                    <input type="text" placeholder="Skill" value={skill} onChange={(e) => setSkill(e.target.value)} className='h-10 rounded-lg p-2 w-full'/>
                                    <button className='flex rounded-full w-auto h-10 p-3 mx-2 bg-green-500 text-black' onClick={(e) => addSkill(e,skill)}>
                                        <AiOutlinePlus/>
                                    </button>
                                </div>
                                :
                                null
                            }
                            {skills?
                                <div className='flex justify-center flex-wrap gap-2'>
                                    {skills.map((skill, index) => (
                                        <div className='flex w-fit h-fit px-2 bg-slate-400 rounded-lg shadow-lg text-xl items-center gap-1'>
                                            <p>{skill}</p>
                                            {isEditable? <TiDelete className='text-xl items' onClick={() => removeSkill(index)}/>: null}
                                        </div>
                                    ))}
                                </div>
                                :
                                <h1>No Skills to display</h1>
                            }
                        </div>
                    </div>
                    {error? <p className='text-red-600 text-md'>Fields with (*) are required</p> : null}
                </div>

                {/* Notes */}
                <div className='bg-slate-600 rounded-xl shadow-xl w-1/2 max-h-full text-center p-5 flex flex-col items-center'>
                    <div className='flex justify-items-center gap-2'>
                        <h2 className="text-2xl text-white">Notes</h2>
                    </div>
                    <NewNoteCard appId={id}/>
                    <div className='flex flex-col rounded-xl w-full m-2 h-full max-h-full overflow-y-scroll gap-1'>
                        {
                            notes? 
                                notes.map((note) => (
                                    <Accordion item={note} isEdit={isEditable}/>
                                ))
                            :
                            <p className='text-xl text-white'>No notes to display.</p>
                        }
                    </div>
                </div>
            </div>
        }
    </div>
  )
}

export default AppDetails