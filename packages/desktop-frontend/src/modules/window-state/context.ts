import { createContext } from "react";
import { Window } from "./types";

export const windowStateContext = createContext<Window>(null as never);
