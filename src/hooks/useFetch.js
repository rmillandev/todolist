import { useEffect, useState } from "react"

export const useFetch = (url, options) => {
    const [state, setState] = useState({
        data: null,
        isLoading: true,
        errors: false
    })

    const { data, isLoading, errors } = state

    const fetchData = async () => {
        try {
            const response = await fetch(url, options)
            const responseData = await response.json()

            if(response.ok){
                setState({
                    data: responseData,
                    isLoading: false,
                    errors: false
                })
            }else{
                setState({
                    data: responseData,
                    isLoading: false,
                    errors: true
                })
            }
        } catch (error) {
            setState({
                data: null,
                isLoading: false,
                errors: error
            })
        }
    }

    useEffect(() => {
        if (!url) return
        fetchData()
    }, [url])

    return {
        data,
        isLoading,
        errors, 
        fetchData
    }
}
