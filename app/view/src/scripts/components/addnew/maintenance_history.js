import { url } from '../variable.js';
import HeadingBar from '../shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class AddMainHistory extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        this.state = {
            users: [],
            inventories: [],
            date: "",
            description: "",
            user: "",
            inventory: "",
            successUpdate: "",
            error: ""
        }
    };

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    componentDidMount() {
        axios.get(url + '/inventory/read.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken')
            }
        })
            .then(response => response.data)
            .then((response) => {
                !response.error ? this.setState({ inventories: response.inventory, errormessage: "", error: "" }) : this.setState({ inventories: [], errormessage: response.error.message, error: response.error.errorcode || "" });
                this.setState({ inventory: this.state.inventories ? this.state.inventories[0].id : "" })
            })
            .catch((error) => console.log("error:", error));

        axios.get(url + '/users/read.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken')
            }
        })
            .then(response => response.data)
            .then((response) => {
                !response.error ? this.setState({ users: response.user, errormessage: "", error: "" }) : this.setState({ users: [], errormessage: response.error.message, error: response.error.errorcode || "" });
                this.setState({ user: this.state.users ? this.state.users[0].id : "" })
            })
            .catch((error) => console.log("error:", error));
    };

    resetForm = (e) => this.setState({ date: "", description: "", user: this.state.users[0].id, inventory: this.state.inventories[0].id });

    onAdd(e) {
        let formData = {
            date: this.state.date,
            description: this.state.description,
            user_id: this.state.user,
            inventory_id: this.state.inventory
        };

        axios.post(url + '/maintenance_history/create.php', formData)
            .then(response => response.data)
            .then((response) => {
                if (!response.errorcode) {
                    this.setState({ successUpdate: response['message'], error: "" });
                } else {
                    this.setState({ error: response.message });
                }
                this.resetForm();
            })
            .catch((error) => console.log("error:", error));

        e.preventDefault();
    };

    render() {
        if (this.state.users && this.state.inventories) {
            return (
                <div className="container">
                    <HeadingBar
                        title="Add New Maintenance History"
                        buttonType="Back"
                        linkTo="/maintenance-history"
                    />
                    {this.state.successUpdate && <div className="alert alert-success"><p><i className="fa fa-check-circle fa-2x"></i> {this.state.successUpdate}</p></div>}
                    {this.state.error && <div className="alert alert-danger"><p><i className="fa fa-exclamation-triangle fa-2x"></i> {this.state.error}</p></div>}
                    <div className="edit-form login">
                        <div className="edit-form__container">
                            <form onSubmit={this.onAdd.bind(this)}>
                                <div className="form-group">
                                    <label htmlFor="inventory">Serial Number:</label>
                                    <select onChange={this.onChange.bind(this)} id="inventory" value={this.state.inventory} name="inventory" >
                                        {this.state.inventories
                                            .map(inv => (
                                                <option key={inv.id} value={inv.id}>{inv.serial_number}</option>
                                            ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description">Description:</label>
                                    <input type="text" className="form-control" id="descriptionr" name="description" value={this.state.description} onChange={this.onChange.bind(this)} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="date">Date:</label>
                                    <input type="date" className="form-control" id="date" name="date" value={this.state.date} onChange={this.onChange.bind(this)} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="username">User Namer:</label>
                                    <select onChange={this.onChange.bind(this)} id="username" value={this.state.user} name="user">
                                        {this.state.users
                                            .map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                    </select>
                                </div>
                                <button type="button" className="btn btn-secondary btn-cancel" onClick={this.resetForm.bind(this)}>Reset</button>
                                <button type="submit" className="btn btn-default btn-submit">Add</button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
        return <h1>Loading</h1>
    }
};

