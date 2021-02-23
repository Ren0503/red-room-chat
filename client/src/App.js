import React from 'react';
import { Router, Route } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';

import history from './utils/history';
import PrivateRoute from './guards/private-route';
import Home from './screens/Home';
import Chat from './screens/Chat';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#58a5f0',
            main: '#ec0000',
            dark: '#8c0000',
        },
        secondary: {
            light: '#ffd95a',
            main: '#f9a825',
            dark: '#c17900',
            contrastText: '#212121',
        },
        background: {
            default: '#f0f0f0',
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

function App() {
    return (
        <ThemeProvider theme={theme}>
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
