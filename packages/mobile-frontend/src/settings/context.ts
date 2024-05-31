import { createContext } from "react";
import { SettingsContext } from "./types";

export const settingsContext = createContext<SettingsContext>(null as never);
