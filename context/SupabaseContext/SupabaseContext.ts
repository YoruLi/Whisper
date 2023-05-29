import { createContext } from "react";
import { SupabaseContext as ISupabaseContext } from "../types";

const SupabaseContext = createContext({} as ISupabaseContext);

export default SupabaseContext;
