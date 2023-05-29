
import { useEffect, useState } from "react"
import removeDiacriticChars from '@/data/removeDiacriticChars'


  export default function useSearch () {
    const [search, setSearch] = useState<string>('')
    const [query, setQuery] = useState<string>('')

    useEffect(()=> {
      const clearSearch = search.toLowerCase().replace(/[^\w. ]/g , char => removeDiacriticChars[char] || '').trim()
      setQuery(clearSearch.length >= 3 ? clearSearch : '')
  }, [search])


  return {query, search, setSearch}
  }


