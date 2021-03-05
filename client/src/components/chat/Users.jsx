import React, { useState, useEffect } from "react"
import socketIOClient from "socket.io-client"

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import Avatar from "@material-ui/core/Avatar"
import { makeStyles } from "@material-ui/core/styles"
import { pink } from '@material-ui/core/colors'


import { useGetUsers } from "../../services/userService"
import commonUtils from "../../utils/common"

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
    pink: {
        color: theme.palette.getContrastText(pink[500]),
        backgroundColor: pink[500],
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
        const socket = socketIOClient(process.env.REACT_APP_API_URL)
        socket.on("users", (data) => {
            setNewUser(data)
        })
    }, [])

    return (
        <List className={classes.list}>
            {users && (
                <React.Fragment>
                    {users.map((u) => (
                        <ListItem
                            className={classes.listItem}
                            key={u._id}
                            onClick={() => {
                                props.setUser(u);
                                props.setScope(u.username);
                            }}
                            button
                        >
                            <ListItemAvatar className={classes.avatar}>
                                <Avatar className={classes.pink}>{commonUtils.getInitialsFromName(u.username)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={u.username} />
                        </ListItem>
                    ))}
                </React.Fragment>
            )}
        </List>
    )
}

export default Users;
