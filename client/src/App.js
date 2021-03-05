import React, { useState } from 'react';
import { Router, Route } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import DarkModeToggle from "react-dark-mode-toggle";

import history from './utils/history';
import PrivateRoute from './guards/private-route';
import Home from './screens/Home';
import Chat from './screens/Chat';

function App() {
    const [darkState, setDarkState] = useState(false);
    const palletType  = darkState ? "dark" : "light";

    const theme = createMuiTheme({
        palette: {
            type: palletType,
            primary: {
                light: '#58a5f0',
                main: '#ec0000',
                dark: '#8c0000',
            },
            secondary: {
                light: '#ffffff',
                main: '#f9a825',
                dark: '#000000',
                contrastText: '#212121',
            },
            background: {
                light: '#f3f0f0',
                dark: '#030300',
            },
        },
        typography: {
            useNextVariants: true,
            fontFamily: [
                'Lobster Two',
                'cursive',
            ].join(','),
        },
    });

    const handleThemeChange = () => {
        setDarkState(!darkState);
    };

    return (
        <ThemeProvider theme={theme}>
            <DarkModeToggle 
                className="dark-mode"
                checked={darkState} 
                onChange={handleThemeChange} 
                size={50}
            />
            <CssBaseline />
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                <Router history={history}>
                    <Route path="/" exact component={Home} />
                    <PrivateRoute path="/chat" component={Chat} />
                </Router>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
