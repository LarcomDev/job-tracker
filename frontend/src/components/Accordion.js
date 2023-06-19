import {useState} from 'react'
import {AiOutlinePlus, AiOutlineMinus} from 'react-icons/ai'
import {CiCircleRemove} from 'react-icons/ci'

const Accordion = ({item, isEdit}) => {
    const [open, setOpen] = useState(false)

    return (
    <div className='flex flex-col w-full max-w-full bg-slate-500 rounded-xl p-3 justify-center cursor-pointer text-white select-none' 
        onClick={() => setOpen(!open)}>
        <div className='flex justify-between text-2xl'>
            <p className={open? "border-b-2 border-white": ""}><strong>{item.title}</strong></p>
            {open? <AiOutlineMinus/> : <AiOutlinePlus/>}
        </div>
        <div className={open? "": "collapse"}>
            <p className='text-md text-start whitespace-pre-wrap break-words'>{item.content}</p>
        </div>
    </div>
    )
}

export default Accordion