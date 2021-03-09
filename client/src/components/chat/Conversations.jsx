import React, { useState, useEffect } from "react"

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import Avatar from "@material-ui/core/Avatar"
import LanguageIcon from "@material-ui/icons/Language"
import Divider from "@material-ui/core/Divider"
import { withStyles, makeStyles } from "@material-ui/core/styles"
import socketIOClient from "socket.io-client"
import { pink } from '@material-ui/core/colors'
import Badge from '@material-ui/core/Badge';

import { useGetConversations } from "../../services/chatService"
import { authenticationService } from "../../services/authenticationService"
import commonUtils from "../../utils/common"

const StyledBadge = withStyles((theme) => ({
    badge: {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: '$ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(Badge)

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
    pink: {
        color: theme.palette.getContrastText(pink[500]),
        backgroundColor: pink[500],
    },
}))

const Conversations = (props) => {
    const classes = useStyles()
    const [conversations, setConversations] = useState([])
    const [newConversation, setNewConversation] = useState(null)
    const getConversations = useGetConversations()
    const [invisible, setInvisible] = useState(false);

    // Returns the recipient name that does not
    // belong to the current user.
    const handleIsOffline = (recipients) => {
        for (let i = 0; i < recipients.length; i++) {
            if (
                recipients[i].username !==
                authenticationService.currentUserValue.username
            ) {
                if (recipients[i].isOnline === true) {
                    return false
                }       
            }
        }
        return true
    }
    // Returns the recipient name that does not
    // belong to the current user.
    const handleRecipient = (recipients) => {
        for (let i = 0; i < recipients.length; i++) {
            if (
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
        let socket = socketIOClient(process.env.REACT_APP_API_URL)
        socket.on("messages", (data) => setNewConversation(data))

        return () => {
            socket.removeListener("messages")
        }
    }, [])

    return (
        <List className={classes.list}>
            <ListItem
                classes={{ root: classes.subheader }}
                onClick={() => {
                    props.setScope("Global Chat");
                }}
            >
                <ListItemAvatar>
                    <Avatar className={classes.globe}>
                        <LanguageIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText className={classes.subheaderText} primary="Global" />
            </ListItem>
            <Divider />

            {conversations && (
                <React.Fragment>
                    {conversations.map((c) => (
                        <ListItem
                            className={classes.listItem}
                            key={c._id}
                            button
                            onClick={() => {
                                props.setUser(handleRecipient(c.recipientObj));
                                props.setScope(handleRecipient(c.recipientObj).username);
                            }}
                        >
                            <ListItemAvatar>
                                <StyledBadge
                                    overlap="circle"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    variant="dot"
                                    invisible={handleIsOffline(c.recipientObj)}
                                >
                                    <Avatar className={classes.pink}>
                                        {commonUtils.getInitialsFromName(
                                            handleRecipient(c.recipientObj).username
                                        )}
                                    </Avatar>
                                </StyledBadge>
                            </ListItemAvatar>
                            <ListItemText
                                primary={handleRecipient(c.recipientObj).username}
                                secondary={<React.Fragment>{c.lastMessage}</React.Fragment>}
                            />
                        </ListItem>
                    ))}
                </React.Fragment>
            )}
        </List>
    )
}

export default Conversations
