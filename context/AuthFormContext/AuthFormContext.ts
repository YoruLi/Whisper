"use client";

import { createContext } from "react";
import { AuthFormContext as IAuthFormContext} from "./types";


const AuthFormContext = createContext({} as IAuthFormContext);

export default AuthFormContext;
