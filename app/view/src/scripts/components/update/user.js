

import { url } from '../variable.js';
import HeadingBar from '../shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

const valid = /[^a-zA-Z0-9]/;
const lowerCaseLetters = /[a-z]/g;
const upperCaseLetters = /[A-Z]/g;;
const numbers = /[0-9]/g;;

export default class AddUser extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        const { match: { params } } = this.props;
        this.state = {
            users: [],
            id: params.id,
            name: "",
            password: "",
            firstname: "",
            lastname: "",
            useremail: "",
            group: "notech",
            notes: "",
            successUpdate: "",
            error: "",
            errormessage: "",
            showDeleteModal: false,
            usernameError: "",
            passwordError: ""
        }
    };

    // handle name change
    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    componentDidMount() {
        axios.get(url + '/users/read_one.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken'), id: this.state.id
            }
        })
            .then(response => response.data)
            .then((response) => {
                if (!response.error) {
                    this.setState({
                        id: response.id,
                        name: response.name,
                        password: response.password,
                        firstname: response.firstname,
                        lastname: response.lastname,
                        useremail: response.useremail,
                        group: response.group,
                        notes: response.notes,
                    })
                } else {
                    this.setState({ error: response.error.message })
                }
            })
            .catch((error) => console.log("error:", error));
    };

    onUpdate(e) {
        e.preventDefault();
        if (this.state.name.length < 6 || this.state.name.length > 20) {
            this.setState({ usernameError: "Username should not be less than 6 and more than 20 character" });
            return false;
        } else if (valid.test(this.state.name)) {
            this.setState({ usernameError: "Space shouldn't be include in the username" });
            return false;
        }
        if (!this.state.password.match(numbers) || !this.state.password.match(lowerCaseLetters) || !this.state.password.match(upperCaseLetters) || this.state.password.length < 8) {
            this.setState({ passwordError: "Password must be 8 or more character long, it should contain atleast one uppercase, lowercase character and a number" });
            return false;
        }

        this.setState({ usernameError: "", passwordError: "" });

        let formData = {
            id: this.state.id,
            name: this.state.name,
            password: this.state.password,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            useremail: this.state.useremail,
            group: this.state.group,
            notes: this.state.notes,
        };

        axios.post(url + '/users/update.php', formData)
            .then(response => response.data)
            .then((response) => {
                if (!response.errorcode) {
                    this.setState({ successUpdate: response['message'], error: "" });
                } else {
                    this.setState({ error: response.message });
                }
            })
            .catch((error) => console.log("error:", error));
        window.scrollTo(0, 0);
    };

    render() {
        return (
            <div className="container">
                <HeadingBar
                    title="Update User"
                    buttonType="Back"
                    linkTo="/users"
                />
                {this.state.successUpdate && <div className="alert alert-success"><p><i className="fa fa-check-circle fa-2x"></i> {this.state.successUpdate}</p></div>}
                {this.state.error && <div className="alert alert-danger"><p><i className="fa fa-exclamation-triangle fa-2x"></i> {this.state.error}</p></div>}
                <div className="edit-form login">
                    <div className="edit-form__container">
                        <form onSubmit={this.onUpdate.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="usr-name">User Name:</label>
                                <input type="text" className="form-control" id="usr-name" name="name" value={this.state.name} onChange={this.onChange.bind(this)} required />
                                {this.state.usernameError && <p className="text-danger"> {this.state.usernameError}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="pswrd">Password:</label>
                                <input type="text" className="form-control" id="pswrd" name="password" value={this.state.password} onChange={this.onChange.bind(this)} required />
                                {this.state.passwordError && <p className="text-danger"> {this.state.passwordError}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstname">First Name:</label>
                                <input type="text" className="form-control" id="firstname" name="firstname" value={this.state.firstname} onChange={this.onChange.bind(this)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastname">Last Name:</label>
                                <input type="text" className="form-control" id="lastname" name="lastname" value={this.state.lastname} onChange={this.onChange.bind(this)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="useremail">User Email:</label>
                                <input type="email" className="form-control" id="useremail" name="useremail" value={this.state.useremail} onChange={this.onChange.bind(this)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="group">Group:</label>
                                <select value={this.state.group} name="group" id="group" onChange={this.onChange.bind(this)} required>
                                    <option value="notech">Non-Technical Staff</option>
                                    <option value="tech">Technical Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="notes">Notes: </label>
                                <input type="text" className="form-control" id="notes" name="notes" value={this.state.notes} onChange={this.onChange.bind(this)} />
                            </div>
                            <Link to="/users" type="button" className="btn btn-secondary btn-cancel">Cancel</Link>
                            <button type="submit" className="btn btn-default btn-submit">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    };
};


















