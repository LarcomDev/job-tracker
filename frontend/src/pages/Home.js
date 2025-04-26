import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Table from '../components/Table'
import conf from '../conf.json'
import { useAuth } from '../components/Auth'
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

const Home = () => {
    const [apps, setApps] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [username, setUsername] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const navigate = useNavigate()
    const auth = useAuth()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
            return
        }

        // Get username from token
        const tokenPayload = JSON.parse(atob(token.split('.')[1]))
        setUsername(tokenPayload.user_email || tokenPayload.sub)

        fetch(`${conf.url}/apps/${tokenPayload.sub}`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok')
            }
            return res.json()
        })
        .then(data => {
            if (data.data) {
                // Ensure each application has an _id
                const appsWithIds = data.data.map(app => ({
                    ...app,
                    _id: app._id || app.id // Use _id if it exists, otherwise use id
                }))
                setApps(appsWithIds)
            } else {
                setApps([])
            }
            setLoading(false)
        })
        .catch(err => {
            console.error('Error fetching applications:', err)
            setError(err)
            setLoading(false)
        })
    }, [])

    const handleLogout = () => {
        auth.logout()
    }

    const filteredApps = statusFilter === 'All' 
        ? apps 
        : apps.filter(app => app.status === statusFilter)

    // Prepare data for charts
    const statusData = [
        { name: 'Applied', value: apps.filter(app => app.status === 'Applied').length, color: '#3B82F6' },
        { name: 'Interviewing', value: apps.filter(app => app.status === 'Interviewing').length, color: '#EAB308' },
        { name: 'Offered', value: apps.filter(app => app.status === 'Offered').length, color: '#22C55E' },
        { name: 'Rejected', value: apps.filter(app => app.status === 'Rejected').length, color: '#EF4444' }
    ].filter(item => item.value > 0)

    // Count applications by month
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        return {
            name: date.toLocaleString('default', { month: 'short' }),
            applications: apps.filter(app => {
                const appDate = new Date(app.application_date)
                return appDate.getMonth() === date.getMonth() && 
                       appDate.getFullYear() === date.getFullYear()
            }).length
        }
    }).reverse()

    const chartData = {
        labels: statusData.map(item => item.name),
        datasets: [{
            data: statusData.map(item => item.value),
            backgroundColor: statusData.map(item => item.color.replace(')', ', 0.8)').replace('rgb', 'rgba')),
            borderColor: statusData.map(item => item.color),
            borderWidth: 1
        }]
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'white',
                    font: {
                        size: 14
                    },
                    padding: 20
                }
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.raw}`
                    }
                }
            }
        },
        cutout: '70%',
        layout: {
            padding: 20
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white">Job Applications</h1>
                        <Link 
                            to="/app/create"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                        >
                            Create Application
                        </Link>
                    </div>
                    <div className="animate-pulse">
                        <div className="h-8 bg-slate-700 rounded w-1/4 mb-4"></div>
                        <div className="h-96 bg-slate-700 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white">Job Applications</h1>
                        <Link 
                            to="/app/create"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                        >
                            Create Application
                        </Link>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-300">
                        Error: {error.message}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Job Applications</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-slate-300">Hello, {username}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
                <div className="mb-6 flex items-center gap-4">
                    <Link 
                        to="/app/create"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 inline-block"
                    >
                        Create Application
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-300">Filter by:</span>
                        <div className="relative flex gap-1.5 bg-slate-800/50 p-1.5 rounded-lg">
                            <div 
                                className={`absolute h-[calc(100%-12px)] rounded-md transition-all duration-300 ease-in-out -z-10 ${
                                    statusFilter === 'All' ? 'bg-slate-700 w-[36px] left-[6px]' :
                                    statusFilter === 'Applied' ? 'bg-blue-500/20 w-[56px] left-[46px]' :
                                    statusFilter === 'Interviewing' ? 'bg-yellow-500/20 w-[86px] left-[106px]' :
                                    statusFilter === 'Offered' ? 'bg-green-500/20 w-[56px] left-[196px]' :
                                    'bg-red-500/20 w-[66px] left-[256px]'
                                }`}
                            />
                            <button
                                onClick={() => setStatusFilter('All')}
                                className={`relative px-3 py-1.5 rounded-md transition-all duration-300 z-0 ${
                                    statusFilter === 'All' 
                                        ? 'bg-slate-700 text-white' 
                                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                }`}
                            >
                                <span className={`inline-block ${statusFilter === 'All' ? 'animate-[textBounce_0.5s_ease-in-out]' : ''}`}>
                                    All
                                </span>
                            </button>
                            <button
                                onClick={() => setStatusFilter('Applied')}
                                className={`relative px-3 py-1.5 rounded-md transition-all duration-300 z-0 ${
                                    statusFilter === 'Applied' 
                                        ? 'bg-blue-500/20 text-blue-100' 
                                        : 'text-slate-300 hover:bg-blue-500/10 hover:text-blue-100'
                                }`}
                            >
                                <span className={`inline-block ${statusFilter === 'Applied' ? 'animate-[textBounce_0.5s_ease-in-out]' : ''}`}>
                                    Applied
                                </span>
                            </button>
                            <button
                                onClick={() => setStatusFilter('Interviewing')}
                                className={`relative px-3 py-1.5 rounded-md transition-all duration-300 z-0 ${
                                    statusFilter === 'Interviewing' 
                                        ? 'bg-yellow-500/20 text-yellow-100' 
                                        : 'text-slate-300 hover:bg-yellow-500/10 hover:text-yellow-100'
                                }`}
                            >
                                <span className={`inline-block ${statusFilter === 'Interviewing' ? 'animate-[textBounce_0.5s_ease-in-out]' : ''}`}>
                                    Interviewing
                                </span>
                            </button>
                            <button
                                onClick={() => setStatusFilter('Offered')}
                                className={`relative px-3 py-1.5 rounded-md transition-all duration-300 z-0 ${
                                    statusFilter === 'Offered' 
                                        ? 'bg-green-500/20 text-green-100' 
                                        : 'text-slate-300 hover:bg-green-500/10 hover:text-green-100'
                                }`}
                            >
                                <span className={`inline-block ${statusFilter === 'Offered' ? 'animate-[textBounce_0.5s_ease-in-out]' : ''}`}>
                                    Offered
                                </span>
                            </button>
                            <button
                                onClick={() => setStatusFilter('Rejected')}
                                className={`relative px-3 py-1.5 rounded-md transition-all duration-300 z-0 ${
                                    statusFilter === 'Rejected' 
                                        ? 'bg-red-500/20 text-red-100' 
                                        : 'text-slate-300 hover:bg-red-500/10 hover:text-red-100'
                                }`}
                            >
                                <span className={`inline-block ${statusFilter === 'Rejected' ? 'animate-[textBounce_0.5s_ease-in-out]' : ''}`}>
                                    Rejected
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Table apps={filteredApps} perPage={10} />
                    </div>
                    <div className="space-y-6">
                        <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Application Status</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={false}
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend 
                                            layout="horizontal" 
                                            verticalAlign="bottom" 
                                            align="center"
                                            wrapperStyle={{
                                                color: 'white',
                                                fontSize: '14px',
                                                paddingTop: '20px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl shadow-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Applications by Month</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                                        <XAxis dataKey="name" stroke="#E2E8F0" />
                                        <YAxis stroke="#E2E8F0" />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                                border: '1px solid #4B5563',
                                                borderRadius: '0.5rem',
                                                color: '#E2E8F0'
                                            }}
                                        />
                                        <Bar dataKey="applications" fill="#3B82F6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home