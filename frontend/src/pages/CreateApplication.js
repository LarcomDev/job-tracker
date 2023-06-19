import {useEffect, useState} from 'react'
import {Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/Auth'
import {AiOutlinePlus} from 'react-icons/ai'
import conf from "../conf.json"
import {TiDelete} from "react-icons/ti"

const CreateApplication = () => {
    const [companyName, setCompanyName] = useState("")
    const [roleTitle, setRoleTitle] = useState("")
    const [status, setStatus] = useState("")
    const [location, setLocation] = useState("")
    const [link, setLink] = useState("")
    // skill list
    const [skills, setSkills] = useState([])
    // skill text
    const [skill, setSkill] = useState("")

    const [error, setError] = useState(false)
    const auth = useAuth()
    const navigate = useNavigate()

    const handleCreate = (e) => {
        e.preventDefault()
        setError(false)

        if(companyName.length === 0 || status.length === 0 || roleTitle.length === 0) {
            setError(true)
        } else {
            fetch(conf.url + `/apps/${auth.user.username}`, {
                method: "POST",
                headers: {
                    "Authorization": JSON.parse(localStorage.getItem("creds"))
                },
                body: JSON.stringify({
                    company: companyName,
                    title: roleTitle,
                    status: status,
                    location: location,
                    link: link,
                    skills: skills
                })
            })
            .then(navigate('/'))
        }
    }

    const addSkill = (e,skill) => {
        e.preventDefault()

        if(skill.includes(",")) {
            let skillsList = skill.split(",").concat(skills).filter(item => item.length > 0)
            setSkills(skillsList)
        } else {
            setSkills([...skills, skill])
        }
        setSkill("")
    }

    const removeSkill = (index) => {
        let left = skills.slice(0, index)
        let right = skills.slice(index + 1)
        setSkills([...left,...right])
    }

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
            {!auth.user?
                <Navigate to="/"/>
                :
                <div className='rounded-xl shadow-xl bg-slate-600 w-fit h-fit flex flex-col items-center p-5 gap-5'>
                    <h1 className='text-5xl text-white'>Create Application</h1>
                    <div className='flex gap-5 m-10'>
                        {/* Left Side */}
                        <div>
                            <form className='flex flex-col gap-3 w-full'>
                                <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className='h-10 rounded-lg p-2'/>
                                <input type="text" placeholder="Role Title" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} className='h-10 rounded-lg p-2'/>
                                <input type="text" placeholder="Job location" value={location} onChange={(e) => setLocation(e.target.value)} className='h-10 rounded-lg p-2'/>
                                <input type="text" placeholder="Link to job post" value={link} onChange={(e) => setLink(e.target.value)} className='h-10 rounded-lg p-2'/>
                                <select onChange={(e) => setStatus(e.target.value)} className='h-10 rounded-lg p-2'>
                                    <option value="">--Select Application Status--</option>
                                    <option value="Submitted">Submitted</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Interviewing">Interviewing</option>
                                    <option value="Deferred">Deferred for another role</option>
                                </select>
                            </form>
                        </div>
                        {/* Right side */}
                        <div className='flex gap-5'>
                            <form className='flex flex-col gap-3 w-full'>
                                <div className='flex justify-center'>
                                    <input type="text" placeholder="Skills (ex: Java,Python,React)" value={skill} onChange={(e) => setSkill(e.target.value)} className='h-10 rounded-lg p-2 w-full'/>
                                    <button className='flex rounded-full w-auto h-10 p-3 mx-2 bg-green-500 text-black' onClick={(e) => addSkill(e,skill)}>
                                        <AiOutlinePlus/>
                                    </button>
                                </div>
                                <div className='flex flex-wrap w-96 h-fit rounded-lg gap-1 p-1 max-h-56 overflow-y-scroll'>
                                    {skills.length === 0?
                                        <p>No Skills added yet.</p>
                                        :
                                        skills.map((skill, index) => (
                                            <div className='flex w-fit h-fit p-[5px] bg-slate-400 rounded-lg shadow-lg text-md items-center'>
                                                <p>{skill}</p>
                                                <TiDelete className='text-xl items' onClick={() => removeSkill(index)}/>
                                            </div>
                                        ))
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                    <button className='rounded-lg p-2 bg-slate-300 text-xl' onClick={handleCreate}>Create</button>
                    {error? <p className='text-red-600 text-md'>Company Name, Role & Status are required fields</p> : null}
                    <Link to="/login" className='text-xl underline text-blue-500'>Back to home</Link>
                </div>
            }
        </div>
  )
}

export default CreateApplication