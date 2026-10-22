import { ThemeContext, useThemeState } from "./themeContext";

/*
|--------------------------------------------------------------------------
| ThemeProvider
|--------------------------------------------------------------------------
| Day = architectural daylight studio
| Night = cinematic digital night
| Dono ek hi product ke do lighting environments hain — sirf tokens switch
| hote hain, geometry/typography/spacing bilkul same rehte hain.
*/

export function ThemeProvider({ children }) {
    const value = useThemeState();

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export default ThemeProvider;
