import { url } from '../variable.js';
import HeadingBar from '../shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class UpdateDevice extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        const { match: { params } } = this.props;
        this.state = {
            id: params.id,
            suppliers: [],
            supplier: "",
            name: "",
            description: "",
            successUpdate: "",
            error: ""
        }
    };

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    componentDidMount() {
        axios.get(url + '/devices/read_one.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken'), id: this.state.id
            }
        })
            .then(response => response.data)
            .then((response) => {
                if (!response.error) {
                    this.setState({
                        name: response.device.name,
                        supplier: response.device.supplier_id || response.suppliers[0].id,
                        description: response.device.description,
                        suppliers: response.suppliers
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
            supplier_id: this.state.supplier
        };

        axios.post(url + '/devices/update.php', formData)
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
        if (this.state.suppliers) {
            return (
                <div className="container">
                    <HeadingBar
                        title="Update Device"
                        buttonType="Back"
                        linkTo="/devices"
                    />
                    {this.state.successUpdate && <div className="alert alert-success"><p><i className="fa fa-check-circle fa-2x"></i> {this.state.successUpdate}</p></div>}
                    {this.state.error && <div className="alert alert-danger"><p><i className="fa fa-exclamation-triangle fa-2x"></i> {this.state.error}</p></div>}
                    <div className="edit-form login">
                        <div className="edit-form__container">
                            <form onSubmit={this.onUpdate.bind(this)}>
                                <div className="form-group">
                                    <label htmlFor="dev-name">Device Name:</label>
                                    <input type="text" className="form-control" id="dev-name" name="name" value={this.state.name} onChange={this.onChange.bind(this)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="desc">Description:</label>
                                    <input type="text" className="form-control" id="desc" name="description" value={this.state.description} onChange={this.onChange.bind(this)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="supplier">Supplier:</label>
                                    <select value={this.state.supplier} name="supplier" id="supplier" onChange={this.onChange.bind(this)} required>
                                        {this.state.suppliers
                                            .map(item => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                    </select>
                                </div>
                                <Link to="/devices" type="button" className="btn btn-secondary btn-cancel">Cancel</Link>
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
