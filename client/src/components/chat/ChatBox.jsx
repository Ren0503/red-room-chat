import React, { useState, useEffect, useRef } from "react"
import socketIOClient from "socket.io-client"

import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import Button from '@material-ui/core/Button'
import SendIcon from "@material-ui/icons/Send"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListSubheader from '@material-ui/core/ListSubheader'
import Avatar from "@material-ui/core/Avatar"
import Paper from "@material-ui/core/Paper"
import Chip from '@material-ui/core/Chip'
import { green, pink } from '@material-ui/core/colors'

import classnames from "classnames"
import "emoji-mart/css/emoji-mart.css"
import { Picker } from "emoji-mart"
import moment from 'moment'
import commonUtils from "../../utils/common"
import {
    useGetGlobalMessages,
    useSendGlobalMessage,
    useGetConversationMessages,
    useSendConversationMessage,
} from "../../services/chatService"
import { authenticationService } from "../../services/authenticationService"

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
    },
    button: {
        margin: theme.spacing(1),
    },
    headerRow: {
        maxHeight: 60,
        zIndex: 5,
    },
    paper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: theme.palette.primary,
    },
    messageContainer: {
        height: "100%",
        display: "flex",
        alignContent: "flex-end",
    },
    messagesRow: {
        maxHeight: "calc(100vh - 184px)",
        overflowY: "auto",
    },
    newMessageRow: {
        width: "100%",
        padding: theme.spacing(0, 2, 1),
    },
    messageBubble: {
        padding: 10,
        border: "1px solid white",
        backgroundColor: theme.palette.secondary,
        borderRadius: "0 10px 10px 10px",
        boxShadow: "-3px 4px 4px 0px rgba(0,0,0,0.08)",
        marginTop: 8,
        maxWidth: "40em",
    },
    messageBubbleRight: {
        borderRadius: "10px 0 10px 10px",
    },
    inputRow: {
        display: "flex",
        alignItems: "flex-end",
    },
    form: {
        width: "100%",
    },
    avatar: {
        margin: theme.spacing(1, 1.5),
    },
    listItem: {
        display: "flex",
        width: "100%",
    },
    listItemRight: {
        flexDirection: "row-reverse",
    },
    pink: {
        color: theme.palette.getContrastText(pink[500]),
        backgroundColor: pink[500],
    },
    green: {
        color: '#fff',
        backgroundColor: green[500],
    },
}))

const ChatBox = (props) => {
    const [currentUserId] = useState(authenticationService.currentUserValue.userId)

    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [lastMessage, setLastMessage] = useState(null)

    const getGlobalMessages = useGetGlobalMessages()
    const sendGlobalMessage = useSendGlobalMessage()
    const getConversationMessages = useGetConversationMessages()
    const sendConversationMessage = useSendConversationMessage()

    let chatBottom = useRef(null)
    const classes = useStyles()

    useEffect(() => {
        reloadMessages()
        scrollToBottom()
    }, [lastMessage, props.scope, props.conversationId])

    useEffect(() => {
        const socket = socketIOClient(process.env.REACT_APP_API_URL)
        socket.on("messages", (data) => setLastMessage(data))
    }, [])

    const reloadMessages = () => {
        if (props.scope === "Global Chat") {
            getGlobalMessages().then((res) => {
                setMessages(res)
            })
        } else if (props.scope !== null && props.conversationId !== null) {
            getConversationMessages(props.user._id).then((res) => setMessages(res))
        } else {
            setMessages([])
        }
    }

    const scrollToBottom = () => {
        chatBottom.current.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (props.scope === "Global Chat") {
            sendGlobalMessage(newMessage).then(() => {
                setNewMessage("")
            })
        } else {
            sendConversationMessage(props.user._id, newMessage).then((res) => {
                setNewMessage("")
            })
        }
    }

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} className={classes.headerRow}>
                <Paper className={classes.paper} square elevation={2}>
                    <Typography color="inherit" variant="h6">
                        {props.scope}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Grid container className={classes.messageContainer}>
                    <Grid item xs={12} className={classes.messagesRow}>
                        {messages && (
                            <List>
                                {messages.map((m) => (
                                    <>
                                        <ListSubheader>

                                        </ListSubheader>
                                        <ListItem
                                            key={m._id}
                                            className={classnames(classes.listItem, {
                                                [`${classes.listItemRight}`]:
                                                    m.fromObj[0]._id === currentUserId,
                                            })}
                                            alignItems="flex-start"
                                        >
                                            <ListItemAvatar className={classes.avatar}>
                                                <Avatar
                                                    className={classnames(classes.pink, {
                                                        [`${classes.green}`]:
                                                            m.fromObj[0]._id === currentUserId,
                                                    })}>
                                                    {commonUtils.getInitialsFromName(m.fromObj[0].username)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                classes={{
                                                    root: classnames(classes.messageBubble, {
                                                        [`${classes.messageBubbleRight}`]:
                                                            m.fromObj[0]._id === currentUserId,
                                                    }),
                                                }}
                                                primary={<React.Fragment>{m.body}</React.Fragment>}
                                                secondary={moment(m.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                                            />
                                        </ListItem>
                                    </>
                                ))}
                            </List>
                        )}
                        <div ref={chatBottom} />
                    </Grid>
                    <Grid item xs={12} className={classes.inputRow}>
                        <form onSubmit={handleSubmit} className={classes.form}>
                            <Grid
                                container
                                className={classes.newMessageRow}
                                alignItems="flex-end"
                            >
                                <Grid item xs={11}>
                                    <TextField
                                        id="message"
                                        label="Message"
                                        variant="outlined"
                                        margin="dense"
                                        fullWidth
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.button}
                                        endIcon={<SendIcon />}
                                    >
                                        Send
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    )
}

export default ChatBox
