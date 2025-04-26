import {useState} from 'react'
import {AiOutlinePlus} from "react-icons/ai"
import conf from "../conf.json"
import { useNavigate } from 'react-router-dom'

const NewNoteCard = ({appId}) => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [error, setError] = useState(false)

    const navigate = useNavigate()

    const handleAdd = (e) => {
        e.preventDefault()
        setError(false)

        if(title.length === 0 || content.length === 0) {
            setError(true)
        } else {
            fetch(conf.url + `/apps/${appId}/notes`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify([{title: title, content: content}])
            })
            .then(() => window.location.reload(false))
        }
    }

  return (
    <div className='flex flex-col w-full max-w-full bg-slate-500 rounded-xl p-3 justify-center text-black gap-1'>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className='rounded-md p-1 text-md'/>
        <input type="text" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} className='rounded-md p-1 text-md'/>
        <button className='flex rounded-full w-fit p-5 h-1 justify-center items-center bg-green-500 text-black text-sm'
            onClick={handleAdd}>
            <AiOutlinePlus/> Add Note
        </button>
        {error? <p className='text-red-500 text-md'>Missing required fields</p> : null}
    </div>
  )
}

export default NewNoteCard