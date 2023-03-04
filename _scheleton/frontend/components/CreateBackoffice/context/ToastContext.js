import { createContext, useState, useEffect, useReducer } from 'react';
//api

const ToastContext = createContext({
	message: {},
    setMessage: () => {},
});

export function ToastContextProvider({ children }) {

    // bet info
    let [message, setMessage] = useState("");
	const context = {
		message, setMessage,
	};

	return (
		<ToastContext.Provider value={context}>{children}</ToastContext.Provider>
	);
}

export default ToastContext;
