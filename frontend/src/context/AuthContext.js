// src/context/AuthContext.js

import { createContext } from "react";

// The default value can be an array where the first element is the state (e.g., user object or null)
// and the second is the setter function.
const AuthContext = createContext([null, () => {}]); 

export default AuthContext;