import { Redirect } from 'react-router-dom';
import { url } from './variable.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Login extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        this.state = {
            username: "",
            password: "",
            usernameError: false,
            passwordError: false,
            formValidError: "",
            redirectToReferrer: false,
            role: ""
        };

        this.onChange = this.onChange.bind(this);
        this.props.pageClass("login");
    };

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    validate = (e) => {
        e.preventDefault();

        this.setState({ usernameError: false });
        this.setState({ passwordError: false });

        if (this.state.username && this.state.password) {
            let formData = {
                username: this.state.username,
                password: this.state.password
            };

            axios.post(url + '/users/login.php', formData)
                .then(response => response.data)
                .then((response) => {
                    if (!response.errorcode) {
                        const result = JSON.stringify(response);
                        sessionStorage.setItem('userData', result);
                        this.props.updateUser(username);
                        // set cookies
                        Cookies.set(('user_role'), response.group, { expires: 1});
                        Cookies.set('user_name', response.first_name + " " + response.last_name, { expires: 1});
                        Cookies.set('user_username', response.username, { expires: 1});
                        Cookies.set(('sessiontoken'), response.sessiontoken, { expires: 1 });
                        this.setState({ redirectToReferrer: true });
                    } else {
                        this.setState({ formValidError: response.message });
                    }
                })
                .catch((error) => console.log("error:", error));
        }

        if (!this.state.username) {
            this.setState({ usernameError: true });
        }
        if (!this.state.password) {
            this.setState({ passwordError: true });
        }
        return;
    };

    render() {
        if (this.state.redirectToReferrer || Cookies.get('sessiontoken')) {
            return (
                <Redirect to={'/inventory'} />
            );
        }

        return (
            <div className="container">
                {this.state.formValidError && <div className="alert alert-danger">
                    <p><strong><i className="fa fa-exclamation-triangle"></i> There was a problem</strong></p>
                    <p>{this.state.formValidError}</p>
                </div>}
                <div className="authentication-form login">
                    <div className="authentication-form__container">
                        <div className="authentication-form__heading-bar">Member Login</div>
                        <form onSubmit={this.validate.bind(this)} method="post" action="">
                            <div className="form-group">
                                <label htmlFor="username">Username:</label>
                                <input type="text" className="form-control" id="username" name="username" value={this.state.username} onChange={this.onChange} />
                                {this.state.usernameError && <div className="text-danger">Please enter valid username</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="pwd">Password:</label>
                                <input type="password" className="form-control" id="pwd" name="password" value={this.state.password} onChange={this.onChange} />
                                <div className="error password-error hide">Password required </div>
                                {this.state.passwordError && <div className="text-danger">Please enter valid password</div>}
                            </div>
                            <button type="submit" className="btn btn-default">Submit</button>
                            <Link to="/forget-password" className="forget-password-link">Forget Password</Link>
                        </form>

                    </div>
                </div>
            </div>
        );
    };
};

export default Login;


