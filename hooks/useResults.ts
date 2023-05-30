import { SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import SupabaseContext from "@/context/SupabaseContext/SupabaseContext";
import debounce from "just-debounce-it";

interface SearchResult {
    id: string;
    created_at: string;
    email: string;
    status: string;
    profile_picture: string;
}

const EXPIRATION_TIME = 5000;

export default function useResults(query: string) {
    const [searchedResults, setSearchedResults] = useState(null);
    const [searchedQuery, setSearchedQuery] = useState<any>(null);
    const { searchQuery } = useContext(SupabaseContext);
    const [storedResults, setStoredResults] = useState<any>({});
    const [results, setResults] = useState<SearchResult[] | null>(null);

    const getResults = useCallback(
        debounce((query: string) => {
            setSearchedQuery(query);
            searchQuery(query).then((data: SetStateAction<null>) => {
                if (data) setSearchedResults(data);
                else console.log("No se encontraron usuarios");
            });
        }, 500),
        []
    );

    useEffect(() => {
        if (!query) {
            if (results) setResults(null);
            return;
        }

        const storedResult = storedResults[query];

        if (storedResult) {
            if (Date.now() - storedResult.timestamp < EXPIRATION_TIME) {
                return setResults(storedResult.result);
            }

            setStoredResults((prevState: any) => ({ ...prevState, [query]: undefined }));
        }

        getResults(query);
    }, [query]);

    useEffect(() => {
        if (!searchedResults) return;
        if (query) setResults(searchedResults);

        setStoredResults((prevState: any) => ({
            ...prevState,
            [searchedQuery]: { result: searchedResults, timestamp: Date.now() },
        }));

        setSearchedResults(null);
    }, [searchedResults]);

    return { results, getResults };
}
