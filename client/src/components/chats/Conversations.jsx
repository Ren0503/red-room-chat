import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'

import { makeStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'

import LanguageIcon from '@material-ui/icons/Language'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'

import commonUtils from '../../utils/common'
import { useGetConversations } from '../../services/messageServices'
import { authenticationService } from '../../services/authenticationService'


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
}))

const Conversations = (props) => {
    const classes = useStyles()
    const [conversations, setConversations] = useState([])
    const [newConversation, setNewConversation] = useState(null)
    const getConversations = useGetConversations()

    const handleRecipient = (recipients) => {
        for(let i = 0; i < recipients.length; i++) {
            if(
                recipients[i].username !== 
                authenticationService.currentUserValue.username
            ) {
                return recipients[i]
            }
        }

        return null
    }

    useEffect(() => {
        getConversations().then((res) => setConversations(res))
    }, [newConversation])

    useEffect(() => {
        let socket = socketIOClient(process.env.SERVER_API_URL)
        socket.on('messages', (data) => setNewConversation(data))
        return () => {
            socket.removeListener('messages')
        }
    }, [])

    return (
        <List className={classes.list}>
            <ListItem
                classes={{ root: classes.subheader }}
                onClick={() => {
                    props.setScope('Group Chat')
                }}
            >
                <ListItemAvatar>
                    <Avatar className={classes.globe}>
                        <LanguageIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText 
                    className={classes.subheaderText}
                    primary='Group Chat'
                />
            </ListItem>

            <Divider />

            {conversations && (
                <React.Fragment>
                    {conversations.map((conversation) => (
                        <ListItem
                            className={classes.listItem}
                            key={conversation._id}
                            button
                            onClick={() => {
                                props.setUser(handleRecipient(conversation.recipientObj))
                                props.setScope(handleRecipient(conversation.recipientObj).name)
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    {commonUtils.getInitialsFromName(
                                        handleRecipient(conversation.recipientObj).name
                                    )}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={handleRecipient(conversation.recipientObj).name}
                                secondary={<React.Fragment>{conversation.lastMessage}</React.Fragment>}
                            />
                        </ListItem>
                    ))}
                </React.Fragment>
            )}
        </List>
    )
}

export default Conversations