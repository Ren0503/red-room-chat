import React, { useState, useEffect, useRef } from 'react'
import socketIOClient from 'socket.io-client'

import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'

import commonUtils from '../../utils/common'
import { useGetUsers } from '../../services/userServices'

const useStyles = makeStyles((theme) => ({
    subheader: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
    },
    globe: {
        backgroundColor: theme.palette.primary.dark,
    },
    subheaderText: {
        color: theme.palette.primary.dark,
    },
    list: {
        maxHeight: "calc(100vh - 112px)",
        overflowY: "auto",
    },
    avatar: {
        margin: theme.spacing(0, 3, 0, 1),
    },
}))

const Users = (props) => {
    const classes = useStyles()
    const [users, setUsers] = useState([])
    const [newUser, setNewUser] = useState(null)
    const getUsers = useGetUsers()

    useEffect(() => {
        getUsers().then((res) => setUsers(res))
    }, [newUser])

    useEffect(() => {
        const socket = socketIOClient(process.env.SERVER_API_URL)
        socket.on('users', (data) => {
            setNewUser(data)
        })
    }, [])

    return (
        <List className={classes.list}>
            {users && (
                <React.Fragment>
                    {users.map((user) => (
                        <ListItem
                            className={classes.listItem}
                            key={user.id}
                            onClick={() => {
                                props.setUsers(user)
                                props.setScope(user.name)
                            }}
                            button
                        >
                            <ListItemAvatar className={classes.avatar}>
                                <Avatar>{commonUtils.getInitialsFromName(user.name)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={user.name} />
                        </ListItem>
                    ))}
                </React.Fragment>
            )}
        </List>
    )
}

export default Users