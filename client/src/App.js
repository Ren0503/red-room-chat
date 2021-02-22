import React from 'react'
import { Router, Route } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'

import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';

import history from './utils/history';
import PrivateRoute from './guards/private-route';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#58a5f0',
            main: '#0277bd',
            dark: '#004c8c',
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
    },
})

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                <Router history={history}>
                    <Route path='/' exact component={HomeScreen} />
                    <PrivateRoute path='/chat' component={ChatScreen} />
                </Router>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
