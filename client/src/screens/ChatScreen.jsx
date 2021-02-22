import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import Header from '../components/core/Header'
import Users from '../components/chats/Users'
import ChatBox from '../components/chats/ChatBox'
import Conversations from '../components/chats/Conversations'

const useStyles = makeStyles(theme => ({
    paper: {
        minHeight: 'calc(100vh - 64px)',
        borderRadius: 0,
    },
    sidebar: {
        zIndex: 8,
    },
    subheader: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    globe: {
        backgroundColor: theme.palette.primary.dark,
    },
    subheaderText: {
        color: theme.palette.primary.dark,
    },
}))

const ChatScreen = () => {
    const [scope, setScope] = useState('Group Chat')
    const [tab, setTab] = useState(0)
    const [user, setUser] = useState(null)
    const classes = useStyles()

    const handleChange  = (e, newVal) => {
        setTab(newVal)
    }

    return (
        <React.Fragment>
            <Header />
            <Grid container>
                <Grid item md={4} className={classes.sidebar}>
                    <Paper className={classes.paper} square evelation={5}>
                        <Paper square>
                            <Tabs 
                                onChange={handleChange}
                                variant="fullWidth"
                                value={tab}
                                indicatorColor="primary"
                                textColor="primary"
                            >
                                <Tab label="Chats" />
                                <Tab label="Users" />
                            </Tabs>
                        </Paper>
                        {tab === 0 && (
                            <Conversations 
                                setUser={setUser}
                                setScope={setScope}
                            />
                        )}
                        {tab === 1 && (
                            <Users setUser={setUser} setScope={setScope} />
                        )}
                    </Paper>
                </Grid>
                <Grid item md={8}>
                    <ChatBox scope={scope} user={user} />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default ChatScreen