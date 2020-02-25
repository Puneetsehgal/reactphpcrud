import { url } from '../variable.js';
import HeadingBar from '../shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class AddLocation extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        this.state = {
            name: "",
            organization: "",
            organizations: [],
            description: "",
            statu: "",
            orgId: "",
            successUpdate: "",
            error: ""
        };
    };

    // handle name change
    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    componentDidMount() {
        axios.get(url + '/organization/read.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken')
            }
        })
            .then(response => response.data)
            .then((response) => {
                !response.error ? this.setState({ organizations: response.organizations, errormessage: "", error: "" }) : this.setState({ organizations: [], errormessage: response.error.message, error: response.error.errorcode || "" });
                this.setState({ organization: this.state.organizations ? this.state.organizations[0].id : "" })
            })
            .catch((error) => console.log("error:", error));
    };

    resetForm = (e) => this.setState({ name: "", description: "", organization: this.state.organizations[0].id, status: "1" });

    onAdd(e) {
        let formData = {
            name: this.state.name,
            description: this.state.description,
            organization_id: this.state.organization,
            status: this.state.status
        };
        axios.post(url + '/locations/create.php', formData)
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
        if (this.state.organizations) {
            return (
                <div className="container">
                    <HeadingBar
                        title="Add New Location"
                        buttonType="Back"
                        linkTo="/locations"
                    />
                    {this.state.successUpdate && <div className="alert alert-success"><p><i className="fa fa-check-circle fa-2x"></i> {this.state.successUpdate}</p></div>}
                    {this.state.error && <div className="alert alert-danger"><p><i className="fa fa-exclamation-triangle fa-2x"></i> {this.state.error}</p></div>}
                    <div className="edit-form login">
                        <div className="edit-form__container">
                            <form onSubmit={this.onAdd.bind(this)}>
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
                                    <select value={this.state.status} name="status" id="status" onChange={this.onChange.bind(this)} required>
                                        <option value="1">Active</option>
                                        <option value="0">Not Active</option>
                                    </select>
                                </div>
                                <div className="form-buttons">
                                    <button type="button" className="btn btn-secondary btn-cancel" onClick={this.resetForm.bind(this)}>Reset</button>
                                    <button type="submit" className="btn btn-default btn-submit">Add</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            );
        }
        return <h1>Loading</h1>
    };
}
