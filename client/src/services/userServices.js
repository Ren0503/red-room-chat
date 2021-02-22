import { useSnackbar } from 'notistack'
import authHeader from '../utils/auth-header'
import useHandleResponse from '../utils/handle-response'

export function useGetUsers() {
    const { enqueueSnackbar } = useSnackbar()
    const handleResponse = useHandleResponse()
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    }

    const getUsers = () => {
        return fetch(
            `${process.env.SERVER_API_URL}/api/users`,
            requestOptions
        ).then(handleResponse)
        .catch(() => 
            enqueueSnackbar('Could not load users', {
                variant: 'error',
            })
        )
    }

    return getUsers
}