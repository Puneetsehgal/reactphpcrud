import { url } from './variable.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class ForgetPassword extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        const { match: { params } } = this.props;
        this.state = {
            formValidError: "",
            useremail: ""
        }
        this.props.pageClass("login");
    };

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    handleEvent(e) {
        let formData = {
            useremail: this.state.useremail
        };

        axios.post(url + '/users/forgot-password.php', formData)
            .then(response => response.data)
            .then((response) => {
                console.log(response);
                if (!response.errorcode) {
                    this.setState({ successUpdate: response['message'], formValidError: "" });
                } else {
                    this.setState({ formValidError: response.message, successUpdate: "" });
                }
            })
            .catch((error) => console.log("error:", error));

        e.preventDefault();
    };

    render() {
        return (
            <div className="container">
                {this.state.formValidError && <div className="alert alert-danger">
                    <p><strong><i className="fa fa-exclamation-triangle"></i> There was a problem</strong></p>
                    <p>{this.state.formValidError}</p>
                </div>}
                {this.state.successUpdate && <div className="alert alert-success">
                    <p><i className="fa fa-check"></i> {this.state.successUpdate}</p>
                </div>}
                <div className="authentication-form ">
                    <div className="authentication-form__container forget-password">
                        <div className="authentication-form__heading-bar">Recover Password</div>
                        <form onSubmit={this.handleEvent.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="email">Email address:</label>
                                <input type="email" className="form-control" id="email" name="useremail" value={this.state.useremail} onChange={this.onChange.bind(this)} required />
                            </div>
                            <button type="submit" className="btn btn-default">Send</button>
                            <Link to="/" className="btn btn-default btn-back">Back</Link>
                        </form>
                    </div>
                </div>
            </div>
        );
    };
};

export default ForgetPassword;
