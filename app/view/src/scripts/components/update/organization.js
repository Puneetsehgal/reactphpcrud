
import { url } from '../variable.js';
import HeadingBar from '../shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class UpdateOrganization extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        const { match: { params } } = this.props;
        this.state = {
            id: params.id,
            name: "",
            description: "",
            status: "1",
            successUpdate: "",
            error: ""
        }
    };

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    componentDidMount() {
        axios.get(url + '/organization/read_one.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken'), id: this.state.id
            }
        })
            .then(response => response.data)
            .then((response) => {
                if (!response.error) {
                    this.setState({
                        name: response.name,
                        description: response.description,
                        status: response.status === "Active" ? "1" : "0"
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
            status: this.state.status
        };

        axios.post(url + '/organization/update.php', formData)
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
        return (
            <div className="container">
                <HeadingBar
                    title="Update Orgnization"
                    buttonType="Back"
                    linkTo="/organizations"
                />
                {this.state.successUpdate && <div className="alert alert-success"><p><i className="fa fa-check-circle fa-2x"></i> {this.state.successUpdate}</p></div>}
                {this.state.error && <div className="alert alert-danger"><p><i className="fa fa-exclamation-triangle fa-2x"></i> {this.state.error}</p></div>}
                <div className="edit-form login">
                    <div className="edit-form__container">
                        <form onSubmit={this.onUpdate.bind(this)}>
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
                            <Link to="/organizations" type="button" className="btn btn-secondary btn-cancel">Cancel</Link>
                            <button type="submit" className="btn btn-default">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    };
};




