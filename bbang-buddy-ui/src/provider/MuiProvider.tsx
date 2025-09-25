"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { bbangBuddyTheme } from "../theme/bbangBuddyTheme";

export default function MuiProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider theme={bbangBuddyTheme}>
            {/* CssBaseline: MUI의 CSS 리셋 (normalize.css와 비슷) */}
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
