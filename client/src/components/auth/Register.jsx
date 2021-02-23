import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';

import history from '../../utils/history';
import { useRegister } from '../../services/authenticationService';
import background from '../../assets/background.jpg'

const useStyles = makeStyles(theme => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor:
          theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Register = props => {
    const register = useRegister();

    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" align="center">
                        Register
                    </Typography>
                    <Formik
                        initialValues={{
                            name: '',
                            username: '',
                            password: '',
                            confirmPassword: '',
                        }}
                        validationSchema={Yup.object().shape({
                            email: Yup.string()
                                .required('Email is required')
                                .email('Invalid email'),
                            username: Yup.string()
                                .required('Username is required')
                                .max(40, 'Username address too long'),
                            password: Yup.string()
                                .required('Password is Required')
                                .max(100, 'Password too long')
                                .min(
                                    6,
                                    'Password should be at least 6 characters long'
                                ),
                            confirmPassword: Yup.string().oneOf(
                                [Yup.ref('password'), null],
                                'Passwords do not match'
                            ),
                        })}
                        onSubmit={(
                            { email, username, password, confirmPassword },
                            { setStatus, setSubmitting }
                        ) => {
                            setStatus();
                            register(email, username, password, confirmPassword).then(
                                user => {
                                    const { from } = history.location.state || {
                                        from: { pathname: '/chat' },
                                    };
                                    history.push(from);
                                },
                                error => {
                                    setSubmitting(false);
                                    setStatus(error);
                                }
                            );
                        }}
                        validateOnChange={false}
                        validateOnBlur={false}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            values,
                            touched,
                            isValid,
                            errors,
                        }) => (
                            <form
                                onSubmit={handleSubmit}
                                className={classes.form}
                            >
                                <TextField
                                    id="email"
                                    className={classes.textField}
                                    name="email"
                                    label="Email"
                                    fullWidth={true}
                                    variant="outlined"
                                    margin="normal"
                                    required={true}
                                    helperText={
                                        touched.email ? errors.email : ''
                                    }
                                    error={
                                        touched.email &&
                                        Boolean(errors.email)
                                    }
                                    value={values.email}
                                    onChange={handleChange}
                                    type="email"
                                />

                                <TextField
                                    id="username"
                                    className={classes.textField}
                                    name="username"
                                    label="Username"
                                    fullWidth={true}
                                    variant="outlined"
                                    margin="normal"
                                    required={true}
                                    helperText={
                                        touched.username ? errors.username : ''
                                    }
                                    error={
                                        touched.username &&
                                        Boolean(errors.username)
                                    }
                                    value={values.username}
                                    onChange={handleChange}
                                />

                                <TextField
                                    id="password"
                                    className={classes.textField}
                                    name="password"
                                    label="Password"
                                    fullWidth={true}
                                    variant="outlined"
                                    margin="normal"
                                    required={true}
                                    helperText={
                                        touched.password ? errors.password : ''
                                    }
                                    error={
                                        touched.password &&
                                        Boolean(errors.password)
                                    }
                                    value={values.password}
                                    onChange={handleChange}
                                    type="password"
                                />

                                <TextField
                                    id="confirmPassword"
                                    className={classes.textField}
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    fullWidth={true}
                                    variant="outlined"
                                    margin="normal"
                                    required={true}
                                    helperText={
                                        touched.confirmPassword
                                            ? errors.confirmPassword
                                            : ''
                                    }
                                    error={
                                        touched.confirmPassword &&
                                        Boolean(errors.confirmPassword)
                                    }
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    type="password"
                                />

                                <Button
                                    type="submit"
                                    fullWidth={true}
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Register
                                </Button>
                            </form>
                        )}
                    </Formik>
                    <Typography>
                        <Link
                            onClick={() => props.handleClick('login')}
                            href="#"
                        >
                            Already have an account?
                        </Link>
                    </Typography>
                </div>
            </Grid>
        </Grid>
    );
};

export default Register;
