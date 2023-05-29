import { createContext } from "react";
import { AppContextType as IAppContextType } from "./types";

const AppContext = createContext({} as IAppContextType);

export default AppContext;
