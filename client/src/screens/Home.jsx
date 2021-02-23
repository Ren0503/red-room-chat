import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';

import history from '../utils/history';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import { authenticationService } from '../services/authenticationService';

const Home = () => {
    const [page, setPage] = useState('login');

    useEffect(() => {
        if (authenticationService.currentUserValue) {
            history.push('/chat');
        }
    }, []);

    const handleClick = location => {
        setPage(location);
    };

    let Content;

    if (page === 'login') {
        Content = <Login handleClick={handleClick} />;
    } else {
        Content = <Register handleClick={handleClick} />;
    }

    return (
        <Container component="main" maxWidth="xs">
            {Content}
        </Container>
    );
};

export default Home;
