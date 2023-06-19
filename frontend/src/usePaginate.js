import {useState, useEffect} from 'react'


const pageRange = (data, perPage) => {
    const range = []
    for(let i = 1; i <=Math.ceil(data.length / perPage); i++){
        range.push(i)
    }
    return range
}

const sliceData = (data, page, perPage) => {
    return data.slice((page - 1) * perPage, page * perPage).sort((a,b) => a.application_date < b.application_date)
}

const usePaginate = (data, page, perPage) => {
    const [range, setRange] = useState([])
    const [slice, setSlice] = useState([])

    useEffect(() => {
        const range = pageRange(data,perPage)
        setRange([...range])

        const slice = sliceData(data, page, perPage)
        setSlice([...slice])
    }, [data, setRange, setSlice, page])

    return {slice, range}
}

export default usePaginate
