import { useSnackbar } from 'notistack'
import authHeader from '../utils/auth-header'
import useHandleResponse from '../utils/handle-response'

export function useGetGroupMessages() {
    const { enqueueSnackbar } = useSnackbar()
    const handleResponse = useHandleResponse()
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    }

    const getGroupMessages = () => {
        return fetch(
            `${process.env.SERVER_API_URL}/api/messages/group`,
            requestOptions
        ).then(handleResponse)
        .catch(() => 
            enqueueSnackbar('Could not load group chat', {
                variant: 'error',
            })
        )
    }

    return getGroupMessages
}

export function useSendGroupMessage() {
    const { enqueueSnackbar } = useSnackbar()
    const handleResponse = useHandleResponse()

    const sendGroupMessage = body => {
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({ body: body, global: true }),
        }

        return fetch(
            `${process.env.SERVER_API_URL}/api/messages/group`,
            requestOptions
        ).then(handleResponse)
        .catch(err => {
            console.log(err)
            enqueueSnackbar('Could send message', {
                variant: 'error',
            })
        })
    }

    return sendGroupMessage
}

export function useGetConversations() {
    const { enqueueSnackbar } = useSnackbar()
    const handleResponse = useHandleResponse()
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    }

    const getConversations = () => {
        return fetch(
            `${process.env.SERVER_API_URL}/api/messages/conversations`,
            requestOptions
        ).then(handleResponse)
        .catch(() => 
            enqueueSnackbar('Could not loads chats', {
                variant: 'error',
            })
        )
    }

    return getConversations
}

export function useGetConversationMessages() {
    const { enqueueSnackbar } = useSnackbar()
    const handleResponse = useHandleResponse()
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    }

    const getConversationMessages = id => {
        return fetch(
            `${process.env.SERVER_API_URL}/api/messages/conversations/query?userId=${id}`,
            requestOptions
        ).then(handleResponse)
        .catch(() => 
            enqueueSnackbar('Could not load chats', {
                variant: 'error',
            })
        )
    }

    return getConversationMessages
}

export function useSendConversationMessage() {
    const { enqueueSnackbar } = useSnackbar()
    const handleResponse = useHandleResponse()

    const sendConversationMessage = (id, body) => {
        const requestOptions = {
            method: 'POST',
            headers: authHeader(),
            body: JSON.stringify({ to: id, body: body }),
        }

        return fetch(
            `${process.env.SERVER_API_URL}/api/messages/`,
            requestOptions
        ).then(handleResponse)
        .catch(err => {
            console.log(err)
            enqueueSnackbar('Could send message', {
                variant: 'error',
            })
        })
    }

    return sendConversationMessage
}