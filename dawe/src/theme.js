import React, { createContext, useMemo, useState, useEffect, useContext } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: "light" });

export const useColorMode = () => useContext(ColorModeContext);

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem("colorMode") || "light");

  useEffect(() => {
    localStorage.setItem("colorMode", mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#181824",
                  paper: "#232336",
                },
                primary: { main: "#a21caf" },
                secondary: { main: "#f59e42" },
              }
            : {
                background: {
                  default: "#f5f5fa",
                  paper: "#fff",
                },
                primary: { main: "#a21caf" },
                secondary: { main: "#f59e42" },
              }),
        },
        shape: { borderRadius: 12 },
        typography: { fontFamily: 'Inter, Roboto, Arial, sans-serif' },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
