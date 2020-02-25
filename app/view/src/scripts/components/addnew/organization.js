
import { url } from '../variable.js';
import HeadingBar from '../shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class AddOrganization extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        this.state = {
            organizations: [],
            error: "",
            errormessage: "",
            name: "",
            description: "",
            status: "1",
            successUpdate: ""
        }
    };

    // handle name change
    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    resetForm = (e) => this.setState({ name: "", description: "", status: "1" });

    onAdd(e) {
        let formData = {
            name: this.state.name,
            description: this.state.description,
            status: this.state.status
        };

        axios.post(url + '/organization/create.php', formData)
            .then(response => response.data)
            .then((response) => {
                if (!response.errorcode) {
                    this.setState({ successUpdate: response['message'], error: "" });
                } else {
                    this.setState({ error: response.message });
                }
                this.setState({ name: "", description: "", status: "1" });
            })
            .catch((error) => console.log("error:", error));

        e.preventDefault();
    };

    render() {
        return (
            <div className="container">
                <HeadingBar
                    title="Add New Orgnization"
                    buttonType="Back"
                    linkTo="/organizations"
                />
                {this.state.successUpdate && <div className="alert alert-success"><p><i className="fa fa-check-circle fa-2x"></i> {this.state.successUpdate}</p></div>}
                {this.state.error && <div className="alert alert-danger"><p><i className="fa fa-exclamation-triangle fa-2x"></i> {this.state.error}</p></div>}
                <div className="edit-form login">
                    <div className="edit-form__container">
                        <form onSubmit={this.onAdd.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="name">Organization Name:</label>
                                <input type="text" className="form-control" id="name" name="name" value={this.state.name} onChange={this.onChange.bind(this)} required />
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
                            <button type="button" className="btn btn-secondary btn-cancel" onClick={this.resetForm.bind(this)}>Reset</button>
                            <button type="submit" className="btn btn-default btn-submit">Add New</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    };
};





