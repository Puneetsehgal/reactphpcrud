import { url } from '../variable.js';
import HeadingBar from '../shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class UpdateSupplier extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        const { match: { params } } = this.props;
        this.state = {
            suppliers: [],
            error: "",
            errormessage: "",
            id: params.id,
            name: "",
            address: "",
            contact: "",
            email: "",
            description: "",
            successUpdate: ""
        }
    };

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    componentDidMount() {
        axios.get(url + '/supplier/read_one.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken'), id: this.state.id
            }
        })
            .then(response => response.data)
            .then((response) => {
                if (!response.error) {
                    this.setState({
                        name: response.name,
                        address: response.address,
                        contact: response.contact,
                        email: response.email,
                        description: response.description
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
            address: this.state.address,
            contact: this.state.contact,
            email: this.state.email,
            description: this.state.description
        };

        axios.post(url + '/supplier/update.php', formData)
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
                    title="Update Supplier"
                    buttonType="Back"
                    linkTo="/suppliers"
                />
                {this.state.successUpdate && <div className="alert alert-success"><p><i className="fa fa-check-circle fa-2x"></i> {this.state.successUpdate}</p></div>}
                {this.state.error && <div className="alert alert-danger"><p><i className="fa fa-exclamation-triangle fa-2x"></i> {this.state.error}</p></div>}
                <div className="edit-form login">
                    <div className="edit-form__container">
                        <form onSubmit={this.onUpdate.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="sup-name">Supplier Name:</label>
                                <input type="text" className="form-control" id="sup-name" name="name" value={this.state.name} onChange={this.onChange.bind(this)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="sup-address">Address:</label>
                                <input type="text" className="form-control" id="sup-address" name="address" value={this.state.address} onChange={this.onChange.bind(this)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="sup-contact">Contact:</label>
                                <input type="text" className="form-control" id="sup-contact" name="contact" value={this.state.contact} onChange={this.onChange.bind(this)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="sup-email">Email:</label>
                                <input type="email" className="form-control" id="sup-email" name="email" value={this.state.email} onChange={this.onChange.bind(this)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="desc">Description:</label>
                                <input type="text" className="form-control" id="desc" name="description" value={this.state.description} onChange={this.onChange.bind(this)} />
                            </div>
                            <Link to="/suppliers" type="button" className="btn btn-secondary btn-cancel">Cancel</Link>
                            <button type="submit" className="btn btn-default btn-submit">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    };
};
