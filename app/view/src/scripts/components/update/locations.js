import { url } from '../variable.js';
import HeadingBar from '../shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class UpdateLocation extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        const { match: { params } } = this.props;
        this.state = {
            id: params.id,
            name: "",
            organization: "",
            organizations: [],
            description: "",
            status: "1",
            orgId: "",
            successUpdate: "",
            error: ""
        }
    };

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    componentDidMount() {
        axios.get(url + '/locations/read_one.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken'), id: this.state.id
            }
        })
            .then(response => response.data)
            .then((response) => {
                if (!response.error) {
                    this.setState({
                        name: response.location.name,
                        organization: response.location.organization_id || response.organizations[0].id,
                        description: response.location.description,
                        status: response.location.status === "Active" ? "1" : "0",
                        organizations: response.organizations
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
            name: this.state.name,
            description: this.state.description,
            organization_id: this.state.organization,
            status: this.state.status
        };

        axios.post(url + '/locations/update.php', formData)
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
        if (this.state.organizations) {
            return (
                <div className="container">
                    <HeadingBar
                        title="Update Location"
                        buttonType="Back"
                        linkTo="/locations"
                    />
                    {this.state.successUpdate && <div className="alert alert-success"><p><i className="fa fa-check-circle fa-2x"></i> {this.state.successUpdate}</p></div>}
                    {this.state.error && <div className="alert alert-danger"><p><i className="fa fa-exclamation-triangle fa-2x"></i> {this.state.error}</p></div>}
                    <div className="edit-form login">
                        <div className="edit-form__container">
                            <form onSubmit={this.onUpdate.bind(this)}>
                                <div className="form-group">
                                    <label htmlFor="loc-name">Location Name:</label>
                                    <input type="text" className="form-control" id="loc-name" name="name" value={this.state.name} onChange={this.onChange.bind(this)} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="organization">Organization:</label>
                                    <select value={this.state.organization} name="organization" id="organization" onChange={this.onChange.bind(this)} required>
                                        {this.state.organizations
                                            .map(org => (
                                                <option key={org.id} value={org.id}>{org.name}</option>
                                            ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="desc">Description:</label>
                                    <input type="text" className="form-control" id="desc" name="description" value={this.state.description} onChange={this.onChange.bind(this)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Status:</label>
                                    <select value={this.state.status} id="status" name="status" onChange={this.onChange.bind(this)} required>
                                        <option value="1">Active</option>
                                        <option value="0">Not Active</option>
                                    </select>
                                </div>
                                <div className="form-buttons">
                                    <Link to="/locations" type="button" className="btn btn-secondary btn-cancel">Cancel</Link>
                                    <button type="submit" className="btn btn-default btn-submit">Update</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            );
        }
        return <h1>Loading</h1>
    };
};
