import {useEffect, useState} from 'react'
import {Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/Auth'
import {AiOutlinePlus} from 'react-icons/ai'
import conf from "../conf.json"
import {TiDelete} from "react-icons/ti"

const CreateApplication = () => {
    const [company, setCompany] = useState("")
    const [roleTitle, setRoleTitle] = useState("")
    const [status, setStatus] = useState("Applied")
    const [location, setLocation] = useState("")
    const [link, setLink] = useState("")
    // skill list
    const [skills, setSkills] = useState([])
    // skill text
    const [skill, setSkill] = useState("")

    const [error, setError] = useState(false)
    const auth = useAuth()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError(false)

        if(company.length === 0 || roleTitle.length === 0) {
            setError(true)
            return
        }

        // Get username from token
        const token = localStorage.getItem("token")
        if (!token) {
            setError(true)
            return
        }

        // Decode the token to get the username
        const tokenPayload = JSON.parse(atob(token.split('.')[1]))
        const username = tokenPayload.sub

        fetch(`${conf.url}/apps/${username}`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                company: company,
                title: roleTitle,
                location: location,
                status: status,
                link: link,
                skills: skills
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok')
            }
            navigate('/')
        })
        .catch(err => {
            console.error('Error creating application:', err)
            setError(true)
        })
    }

    const addSkill = (e, skill) => {
        e.preventDefault()
        if (!skill.trim()) return

        if(skill.includes(",")) {
            let skillsList
            if(skills) {
                skillsList = skill.split(",").concat(skills).filter(item => item.trim().length > 0)
            } else {
                skillsList = skill.split(",").filter(item => item.trim().length > 0)
            }
            setSkills(skillsList)
        } else {
            if(skills) {
                setSkills([...skills, skill.trim()])
            } else {
                setSkills([skill.trim()])
            }
        }
        setSkill("")
    }

    const removeSkill = (index) => {
        let left = skills.slice(0, index)
        let right = skills.slice(index + 1)
        setSkills(left.concat(right))
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate('/')}
                                className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back
                            </button>
                            <h1 className="text-2xl font-bold text-white">Create New Application</h1>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-2">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full bg-slate-600/50 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter company name"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="roleTitle" className="block text-sm font-medium text-slate-300 mb-2">
                                    Role Title *
                                </label>
                                <input
                                    type="text"
                                    id="roleTitle"
                                    value={roleTitle}
                                    onChange={(e) => setRoleTitle(e.target.value)}
                                    className="w-full bg-slate-600/50 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter role title"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-2">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-slate-600/50 border border-slate-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Interviewing">Interviewing</option>
                                    <option value="Offered">Offered</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-slate-600/50 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter location"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="link" className="block text-sm font-medium text-slate-300 mb-2">
                                    Job Posting Link
                                </label>
                                <input
                                    type="url"
                                    id="link"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="w-full bg-slate-600/50 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter job posting URL"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="skills" className="block text-sm font-medium text-slate-300 mb-2">
                                    Skills
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="skills"
                                        value={skill}
                                        onChange={(e) => setSkill(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addSkill(e, skill)}
                                        className="flex-1 bg-slate-600/50 border border-slate-500 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter skills (comma-separated or press Enter)"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => addSkill(e, skill)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                                    >
                                        Add
                                    </button>
                                </div>
                                {skills.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="bg-slate-600/50 text-white px-3 py-1 rounded-full flex items-center gap-2"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => removeSkill(index)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <TiDelete className="text-lg" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300">
                                Please fill in all required fields
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                            >
                                Create Application
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateApplication