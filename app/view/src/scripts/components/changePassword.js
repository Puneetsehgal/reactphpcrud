import { Link } from 'react-router-dom';
import { url } from './variable.js';

class ChangePassword extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        this.state = {
            oldPassword: "",
            password: "",
            confirmPassword: "",
            oldPasswordError: false,
            passwordError: false,
            confirmPassword: "",
            formValidError: "",
            successUpdate: ""
        };
        this.onChange = this.onChange.bind(this);
    };

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    validate = (ee) => {
        e.preventDefault();

        this.setState({ oldPasswordError: false, passwordError: false, confirmPasswordError: '' });
        if (this.state.oldPassword && this.state.password && this.state.confirmPassword) {
            if (this.state.password == this.state.confirmPassword) {
                let formData = {
                    username: Cookies.get('user_username'),
                    oldPassword: this.state.oldPassword,
                    newPassword: this.state.password
                }
                $.ajax({
                    url: url + "/users/change-password.php",
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify(formData),
                    success: function (response) {
                        if (!response.errorcode) {
                           this.setState({successUpdate: response.message});
                        } else {
                            this.setState({ formValidError: response.message });
                        }
                    }.bind(this),
                    error: function (xhr, resp, text) {
                        console.log(xhr, resp, text);
                    }
                });
                this.setState({ oldPassword: "", password: "", confirmPassword: '' });
            } else {
                this.setState({ confirmPasswordError: "Confirm Password Doesn't match with new password" });
            }
        }

        if (!this.state.oldPassword) {
            this.setState({ oldPasswordError: true });
        }
        if (!this.state.password) {
            this.setState({ passwordError: true });
        }
        if (!this.state.confirmPassword) {
            this.setState({ confirmPasswordError: 'Confirm Password Required' });
        } 
        return;
    };

    render() {
        return (
            <div className="container">
                {this.state.formValidError && <div className="alert alert-danger">
                    <p><strong><i className="fa fa-exclamation-triangle"></i> There was a problem</strong></p>
                    <p>{this.state.formValidError}</p>
                </div>}
                {this.state.successUpdate && <div className="alert alert-success">
                    <p><i className="fa fa-check"></i>{this.state.successUpdate}</p>
                </div>}
                <div className="authentication-form login">
                    <div className="authentication-form__container">
                        <div className="authentication-form__heading-bar">Member Login</div>
                        <form onSubmit={this.validate.bind(this)} method="post" action="">
                            <div className="form-group">
                                <label htmlFor="old-password">Old Password:</label>
                                <input type="password" className="form-control" id="old-password" name="oldPassword" value={this.state.oldPassword} onChange={this.onChange} />
                                {this.state.oldPasswordError && <div className="text-danger">Please enter valid old password</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="pwd">New Password:</label>
                                <input type="password" className="form-control" id="pwd" name="password" value={this.state.password} onChange={this.onChange} />
                                {this.state.passwordError && <div className="text-danger">Please enter valid new password</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password">Confirm Password:</label>
                                <input type="password" className="form-control" id="confirm-password" name="confirmPassword" value={this.state.confirmPassword} onChange={this.onChange} />
                                {this.state.confirmPasswordError && <div className="text-danger">{this.state.confirmPasswordError}</div>}
                            </div>
                            <button type="submit" className="btn btn-default">Change</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    };
};

export default ChangePassword;