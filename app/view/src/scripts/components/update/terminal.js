import { url } from '../variable.js';
import HeadingBar from '../shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class UpdateTerminal extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        const { match: { params } } = this.props;
        this.state = {
            locations: [],
            id: params.id,
            regNumber: "",
            name: "",
            networkAddress: "",
            networkName: "",
            macAddress: "",
            description: "",
            status: "1",
            location: "",
            successUpdate: "",
            error: ""
        }
    }

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    componentDidMount() {
        axios.get(url + '/terminal/read_one.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken'), id: this.state.id
            }
        })
            .then(response => response.data)
            .then((response) => {
                if (!response.error) {
                    this.setState({
                        name: response.terminal.name,
                        regNumber: response.terminal.reg_number,
                        networkAddress: response.terminal.network_address,
                        networkName: response.terminal.network_name,
                        macAddress: response.terminal.mac_address,
                        description: response.terminal.description,
                        location: response.terminal.location_id || response.locations[0].id,
                        locations: response.locations
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
            reg_number: this.state.regNumber,
            network_address: this.state.networkAddress,
            network_name: this.state.networkName,
            mac_address: this.state.macAddress,
            description: this.state.description,
            location_id: this.state.location,
            status: this.state.status
        };

        axios.post(url + '/terminal/update.php', formData)
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
        e.preventDefault();
    };

    render() {
        return (
            <div className="container">
                <HeadingBar
                    title="Update Terminal"
                    buttonType="Back"
                    linkTo="/terminals"
                />
                {this.state.successUpdate && <div className="alert alert-success"><p><i className="fa fa-check-circle fa-2x"></i> {this.state.successUpdate}</p></div>}
                {this.state.error && <div className="alert alert-danger"><p><i className="fa fa-exclamation-triangle fa-2x"></i> {this.state.error}</p></div>}
                <div className="edit-form login">
                    <div className="edit-form__container">
                        <form onSubmit={this.onUpdate.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="location">Location:</label>
                                <select value={this.state.location} name="location" id="location" onChange={this.onChange.bind(this)} required>
                                    {this.state.locations
                                        .map(item => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="ter-num"> Reg Number:</label>
                                <input type="text" pattern="[0-9]*" className="form-control" id="ter-num" name="regNumber" value={this.state.regNumber} onChange={this.onChange.bind(this)} required />
                                <small id="regNumberHelp" className="form-text text-muted">*Numbers Only</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="ter-name"> Name:</label>
                                <input type="text" className="form-control" id="ter-name" name="name" value={this.state.name} onChange={this.onChange.bind(this)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="network-address"> Network Address:</label>
                                <input type="text" className="form-control" id="network-address" name="networkAddress" value={this.state.networkAddress} onChange={this.onChange.bind(this)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="network-name"> Network Name:</label>
                                <input type="text" className="form-control" id="network-name" name="networkName" value={this.state.networkName} onChange={this.onChange.bind(this)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="mac-address">Mac Address:</label>
                                <input type="text" className="form-control" id="mac-address" name="macAddress" value={this.state.macAddress} onChange={this.onChange.bind(this)} required />
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
                            <Link to="/terminals" type="button" className="btn btn-secondary btn-cancel">Cancel</Link>
                            <button type="submit" className="btn btn-default btn-submit">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    };
};