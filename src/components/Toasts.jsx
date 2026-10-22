import { ToastContainer } from "react-toastify";

import { useTheme } from "../theme/themeContext";

/*
| Toast styling react-toastify ki apni theme se aati hai — isliye active
| theme follow karwa dete hain, warna night mode me light toast dikhega.
*/
const Toasts = () => {
    const { mode } = useTheme();

    return (
        <ToastContainer
            position="top-right"
            autoClose={2600}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme={mode}
            toastClassName="!rounded-xl !font-sans !shadow-float"
        />
    );
};

export default Toasts;
