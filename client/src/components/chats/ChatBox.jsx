import React, { useState, useEffect, useRef } from 'react'
import socketIOClient from 'socket.io-client'
import classnames from 'classnames'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

import SendIcon from '@material-ui/icons/Send'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'


import commonUtils from '../../utils/common'
import {
    useGetGroupMessages,
    useSendGroupMessage,
    useGetConversationMessages,
    useSendConversationMessage,
} from '../../services/messageServices'

import { authenticationService } from '../../services/authenticationService'

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
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
        color: theme.palette.primary.dark,
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
        backgroundColor: "white",
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
}))

const ChatBox = (props) => {
    const [currentUserId] = useState(
        authenticationService.currentUserValue.userId
    )

    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [lastMessage, setLastMessage] = useState(null)

    const getGroupMessages = useGetGroupMessages()
    const sendGroupMessage = useSendGroupMessage()
    const getConversationMessages = useGetConversationMessages()
    const sendConversationMessage = useSendConversationMessage()

    let chatBottom = useRef(null)
    const classes = useStyles()

    useEffect(() => {
        reloadMessages()
        scrollToBottom()
    }, [lastMessage, props.scope, props.conversationId])

    useEffect(() => {
        const socket = socketIOClient(process.env.SERVER_API_URL)
        socket.on('messages', (data) => setLastMessage(data))
    }, [])

    const reloadMessages = () => {
        if(props.scope === 'Group Chat') {
            getGroupMessages().then((res) => {
                setMessages(res)
            })
        } else if(props.scope !== null && props.conversationId !== null) {
            getConversationMessages(props.user._id).then((res) => {
                setMessages(res)
            })
        } else {
            setMessages([])
        }
    }

    const scrollToBottom = () => {
        chatBottom.current.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(scrollToBottom, [messages])

    const handleSubmit = (e) => {
        e.preventDefault()
        if(props.scope === 'Group Chat') {
            sendGroupMessage(newMessage).then(() => {
                setNewMessage('')
            })
        } else {
            sendConversationMessage(props.user._id, newMessage).then((res) => {
                setNewMessage('')
            })
        }
    }

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} className={classes.headerRow}>
                <Paper className={classes.paper} square elevation={2}>
                    <Typography color='inherit' variant='h6'>
                        {props.scope}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Grid container className={classes.messageContainer}>
                    <Grid item xs={12} className={classes.messagesRow}>
                        {messages && (
                            <List>
                                {messages.map((message) => (
                                    <ListItem
                                        key={message._id}
                                        className={classnames(classes.listItem, {
                                            [`${classes.listItemRight}`]:
                                            message.fromObj[0]._id === currentUserId,
                                        })}
                                        alignItems='flex-start'
                                    >
                                        <ListItemAvatar className={classes.avatar}>
                                            <Avatar>
                                                {commonUtils.getInitialsFromName(message.fromObj[0].name)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText 
                                            classes={{
                                                root: classnames(classes.messageBubble, {
                                                    [`${classes.messageBubbleRight}`]:
                                                    message.fromObj[0]._id === currentUserId,
                                                }),
                                            }}
                                        />
                                    </ListItem>
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
                                alignItems='flex-end'
                            >
                                <Grid item xs={11}>
                                    <TextField 
                                        id='message'
                                        label='Message'
                                        variant='outlined'
                                        margin='dense'
                                        fullWidth
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton type='submit'>
                                        <SendIcon />
                                    </IconButton>
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