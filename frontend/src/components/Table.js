import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import conf from "../conf.json"
import { SyncLoader } from 'react-spinners'

const Table = ({apps, perPage}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [expandedRows, setExpandedRows] = useState(new Set())

    const totalPages = Math.ceil(apps.length / perPage)
    const startIndex = (currentPage - 1) * perPage
    const endIndex = startIndex + perPage
    const currentApps = apps.slice(startIndex, endIndex)

    const handleRowClick = (appId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev)
            if (newSet.has(appId)) {
                newSet.delete(appId)
            } else {
                newSet.add(appId)
            }
            return newSet
        })
    }

    return (
        <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-600/50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <span>Company</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <span>Role</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <span>Status</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <span>Location</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <span>Date</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <span>Actions</span>
                                    <ChevronDownIcon className="h-4 w-4" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-600/50">
                        {currentApps.map((app) => (
                            <React.Fragment key={app._id}>
                                <tr 
                                    onClick={() => handleRowClick(app._id)}
                                    className={`cursor-pointer transition-colors duration-200 ${
                                        expandedRows.has(app._id) ? 'bg-slate-600/30' : 'hover:bg-slate-600/30'
                                    }`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {expandedRows.has(app._id) ? (
                                                <ChevronUpIcon className="h-5 w-5 text-slate-400" />
                                            ) : (
                                                <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                                            )}
                                            <span className="text-slate-300">{app.company}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">{app.position}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold select-none ${
                                            app.status === 'Applied' ? 'bg-blue-500/20 text-blue-300' :
                                            app.status === 'Interviewing' ? 'bg-yellow-500/20 text-yellow-300' :
                                            app.status === 'Offered' ? 'bg-green-500/20 text-green-300' :
                                            'bg-red-500/20 text-red-300'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">{app.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                                        {new Date(app.application_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/app/${app._id}`}
                                                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                </svg>
                                            </Link>
                                            {app.link && (
                                                <div className="relative group">
                                                    <a
                                                        href={app.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-green-400 hover:text-green-300 transition-colors duration-200"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                                        </svg>
                                                    </a>
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                        Visit job listing
                                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-700 rotate-45 -bottom-1"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                {expandedRows.has(app._id) && (
                                    <tr className="bg-slate-600/30">
                                        <td colSpan="6" className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium text-slate-400">Skills:</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {app.skills && app.skills.length > 0 ? (
                                                        app.skills.map((skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-3 py-1 rounded-full bg-slate-500/30 text-slate-300 text-sm"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-slate-400 italic">No skills listed</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {apps.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-slate-400">No applications found. Create your first application!</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <div className="text-slate-300">
                        Showing {startIndex + 1} to {Math.min(endIndex, apps.length)} of {apps.length} applications
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-slate-600/50 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors duration-200"
                        >
                            <ChevronDoubleLeftIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-slate-600/50 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors duration-200"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
                                        currentPage === pageNum
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-slate-600/50 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors duration-200"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-slate-600/50 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors duration-200"
                        >
                            <ChevronDoubleRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Table