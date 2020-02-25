import { url } from '../variable.js';
import HeadingBar from '../shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class UpdateMainHistory extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        const { match: { params } } = this.props;
        this.state = {
            id: params.id,
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
        axios.get(url + '/maintenance_history/read_one.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken'), id: this.state.id
            }
        })
            .then(response => response.data)
            .then((response) => {
                if (!response.error) {
                    this.setState({
                        date: response.maintenance_history.date,
                        description: response.maintenance_history.description,
                        user: response.maintenance_history.user_id ||response.user[0].id,
                        inventory: response.maintenance_history.inventory_id || response.inventory[0].id,
                        users: response.user,
                        inventories: response.inventory
                    });
                } else {
                    this.setState({ error: response.error.message })
                }
            })
            .catch((error) => console.log("error:", error));
    };

    onUpdate(e) {
        let formData = {
            id: this.state.id,
            date: this.state.date,
            description: this.state.description,
            user_id: this.state.user,
            inventory_id: this.state.inventory
        };

        axios.post(url + '/maintenance_history/update.php', formData)
            .then(response => response.data)
            .then((response) => {
                if (!response.errorcode) {
                    this.setState({ successUpdate: response['message'], error: "" });
                } else {
                    this.setState({ error: response.message });
                }
            })
            .catch((error) => console.log("error:", error));

        e.preventDefault();
    };

    render() {
        if (this.state.users && this.state.inventories) {
            return (
                <div className="container">
                    <HeadingBar
                        title="Update Maintenance History"
                        buttonType="Back"
                        linkTo="/maintenance-history"
                    />
                    {this.state.successUpdate && <div className="alert alert-success"><p><i className="fa fa-check-circle fa-2x"></i> {this.state.successUpdate}</p></div>}
                    {this.state.error && <div className="alert alert-danger"><p><i className="fa fa-exclamation-triangle fa-2x"></i> {this.state.error}</p></div>}
                    <div className="edit-form login">
                        <div className="edit-form__container">
                            <form onSubmit={this.onUpdate.bind(this)}>
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
                                    <input type="text" className="form-control" id="description" name="description" value={this.state.description} onChange={this.onChange.bind(this)} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="date">Date:</label>
                                    <input type="date" className="form-control" id="date" name="date" value={this.state.date} onChange={this.onChange.bind(this)} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="username">User Name:</label>
                                    <select onChange={this.onChange.bind(this)} id="username" value={this.state.user} name="user">
                                        {this.state.users
                                            .map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                    </select>
                                </div>
                                <Link to="/maintenance-history" type="button" className="btn btn-secondary btn-cancel">Cancel</Link>
                                <button type="submit" className="btn btn-default btn-submit">Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
        return <h1>Loading</h1>
    };
};