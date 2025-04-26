import {useEffect, useState} from 'react'
import conf from "../conf.json"
import {SyncLoader} from "react-spinners"
import { useParams, Link, Navigate } from 'react-router-dom'
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
    const [isLinkValid, setIsLinkValid] = useState(false)
    const [linkError, setLinkError] = useState("")
    const [skills, setSkills] = useState([])
    const [skill, setSkill] = useState('')
    const [notes, setNotes] = useState([])
    const [newNoteContent, setNewNoteContent] = useState('')
    const [showNoteModal, setShowNoteModal] = useState(false)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [isEditable, setEditable] = useState(false)
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        if (!id) {
            setNotFound(true)
            setLoading(false)
            return
        }

        fetch(conf.url + `/apps/id/${id}`, {
            mode: "cors",
            headers : {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => {
            if (!res.ok) {
                if (res.status === 404) {
                    setNotFound(true)
                } else {
                    setError(true)
                }
                throw new Error('Network response was not ok')
            }
            return res.json()
        })
        .then(data => {
            if(data.data) {
                setApplication(data.data)
            } else {
                setNotFound(true)
            }
        })
        .catch(err => {
            console.error('Error fetching application:', err)
            setError(true)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [id])

    useEffect(() => {
        if (application) {
            setCompany(application.company || "")
            setRoleTitle(application.title || "")
            setStatus(application.status || "")
            setLocation(application.location || "")
            setLink(application.link || "")
            setSkills(application.skills || [])
            setNotes(application.notes || [])
            if (application.link) {
                validateLink(application.link)
            }
        }
    }, [application])

    const validateLink = (url) => {
        if (!url) {
            setIsLinkValid(false)
            return
        }

        try {
            new URL(url)
            setIsLinkValid(true)
            setLinkError("")
        } catch (e) {
            setIsLinkValid(false)
            setLinkError("Invalid URL format")
        }
    }

    const handleLinkChange = (e) => {
        const newLink = e.target.value
        setLink(newLink)
        if (!isEditable) {
            validateLink(newLink)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-b from-slate-800 to-slate-900">
                <SyncLoader color="#60A5FA" />
            </div>
        )
    }

    if (notFound) {
        return <Navigate to="/" replace />
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-slate-800 to-slate-900">
                <h1 className="text-2xl text-white mb-4">Error loading application details</h1>
                <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                    onClick={() => navigate('/')}
                >
                    Return to Home
                </button>
            </div>
        )
    }

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
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({company: company, title: roleTitle, location: location, status: status, link: link, skills: skills})
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok')
                }
                navigate('/')
            })
            .catch(err => {
                console.error('Error updating application:', err)
                setError(true)
            })
        }
    }

    const handleNewNote = () => {
        setShowNoteModal(true)
    }

    const handleAddNote = (e) => {
        e.preventDefault()
        if (!newNoteContent.trim()) return

        const newNote = {
            content: newNoteContent,
            date: new Date().toISOString()
        }

        const updatedNotes = [...notes, newNote]
        setNotes(updatedNotes)
        setNewNoteContent('')
        setShowNoteModal(false)

        // Update the application with the new notes array
        fetch(conf.url + `/apps/${id}`, {
            method: "PUT",
            mode: "cors",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...application,
                notes: updatedNotes
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to update notes')
            }
        })
        .catch(err => {
            console.error('Error updating notes:', err)
            // Revert the notes state if the update fails
            setNotes(notes)
        })
    }

    const handleDeleteNote = (index) => {
        const updatedNotes = [...notes]
        updatedNotes.splice(index, 1)
        setNotes(updatedNotes)
        
        // Update the application with the new notes array
        fetch(conf.url + `/apps/${id}`, {
            method: "PUT",
            mode: "cors",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...application,
                notes: updatedNotes
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to update notes')
            }
        })
        .catch(err => {
            console.error('Error updating notes:', err)
            // Revert the notes state if the update fails
            setNotes(notes)
        })
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
                            <h1 className="text-3xl sm:text-4xl font-bold text-white">Application Details</h1>
                        </div>
                        <button 
                            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                                isEditable 
                                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                            onClick={() => setEditable(!isEditable)}
                        >
                            {isEditable ? "Cancel" : "Edit"}
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                            <p className="text-red-300">Please fill in all required fields</p>
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Company</label>
                                <input 
                                    type="text" 
                                    value={company} 
                                    onChange={(e) => setCompany(e.target.value)} 
                                    className={`w-full px-4 py-2 rounded-lg bg-slate-600/50 border border-slate-500 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        !isEditable && 'opacity-75'
                                    }`}
                                    disabled={!isEditable}
                                    placeholder="Company name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Role Title</label>
                                <input 
                                    type="text" 
                                    value={roleTitle} 
                                    onChange={(e) => setRoleTitle(e.target.value)} 
                                    className={`w-full px-4 py-2 rounded-lg bg-slate-600/50 border border-slate-500 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        !isEditable && 'opacity-75'
                                    }`}
                                    disabled={!isEditable}
                                    placeholder="Job title"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Status</label>
                                <select 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value)} 
                                    className={`w-full px-4 py-2 rounded-lg bg-slate-600/50 border border-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        !isEditable && 'opacity-75'
                                    }`}
                                    disabled={!isEditable}
                                >
                                    <option value="Applied" className="bg-slate-700">Applied</option>
                                    <option value="Interviewing" className="bg-slate-700">Interviewing</option>
                                    <option value="Offered" className="bg-slate-700">Offered</option>
                                    <option value="Rejected" className="bg-slate-700">Rejected</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Location</label>
                                <input 
                                    type="text" 
                                    value={location} 
                                    onChange={(e) => setLocation(e.target.value)} 
                                    className={`w-full px-4 py-2 rounded-lg bg-slate-600/50 border border-slate-500 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        !isEditable && 'opacity-75'
                                    }`}
                                    disabled={!isEditable}
                                    placeholder="Location"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Link</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={link} 
                                    onChange={handleLinkChange} 
                                    className={`flex-grow px-4 py-2 rounded-lg bg-slate-600/50 border border-slate-500 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        !isEditable && 'opacity-75'
                                    }`}
                                    disabled={!isEditable}
                                    placeholder="Job posting URL"
                                />
                                {!isEditable && link && (
                                    <>
                                        {isLinkValid ? (
                                            <a 
                                                href={link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                                </svg>
                                                View Listing
                                            </a>
                                        ) : (
                                            <div className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                                {linkError || "Invalid Link"}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-300">Skills</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={skill} 
                                    onChange={(e) => setSkill(e.target.value)} 
                                    className={`flex-grow px-4 py-2 rounded-lg bg-slate-600/50 border border-slate-500 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                        !isEditable && 'opacity-75'
                                    }`}
                                    disabled={!isEditable}
                                    placeholder="Add skills (comma-separated)"
                                />
                                <button 
                                    onClick={(e) => addSkill(e, skill)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                                        isEditable 
                                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                                            : 'bg-slate-500 text-slate-300'
                                    }`}
                                    disabled={!isEditable}
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {skills && skills.map((skill, index) => (
                                    <div key={index} className="bg-slate-600/50 rounded-full px-4 py-1.5 flex items-center gap-2 group">
                                        <span className="text-slate-200">{skill}</span>
                                        {isEditable && (
                                            <button 
                                                onClick={() => removeSkill(index)}
                                                className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                            >
                                                <TiDelete className="text-xl" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {isEditable && (
                            <button 
                                type="submit"
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Save Changes
                            </button>
                        )}
                    </form>

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Notes</h2>
                        <div className="space-y-4">
                            {notes.map((note, index) => (
                                <div 
                                    key={index}
                                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-slate-300 text-sm">
                                            {new Date(note.date).toLocaleDateString()}
                                        </p>
                                        <button
                                            onClick={() => handleDeleteNote(index)}
                                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                        >
                                            <TiDelete className="text-xl" />
                                        </button>
                                    </div>
                                    <p className="text-slate-200">{note.content}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={handleNewNote}
                                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                <AiOutlinePlus className="text-xl" />
                                Add Note
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Note Modal */}
            {showNoteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Add New Note</h3>
                        <form onSubmit={handleAddNote} className="space-y-4">
                            <textarea
                                value={newNoteContent}
                                onChange={(e) => setNewNoteContent(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your note here..."
                                rows="4"
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowNoteModal(false)
                                        setNewNoteContent('')
                                    }}
                                    className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
                                >
                                    Add Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AppDetails