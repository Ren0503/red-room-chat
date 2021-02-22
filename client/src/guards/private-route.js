import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { authenticationService } from '../services/authenticationService'

const PrivateRoute = ({ component: Comment, ...rest }) => (
    <Route 
        {...rest}
        render = {props => {
            const currentUser = authenticationService.currentUserValue
            if(!currentUser) {
                return (
                    <Redirect 
                        to={{ pathname: '/', state: { from: props.location }}}
                    />
                )
            }

            return <Component {...props} />
        }}
    />
)

export default PrivateRoute