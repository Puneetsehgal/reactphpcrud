import { url } from '../variable.js';
import HeadingBar from '../shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class UpdateInventory extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        const { match: { params } } = this.props;
        this.state = {
            id: params.id,
            terminals: [],
            devices: [],
            serial_number: "",
            hcs_number: "",
            purchase_date: "",
            status: "1",
            notes: "",
            terminal: "",
            device: "",
            successUpdate: "",
            error: ""
        }
    };

    onChange = (e) => this.setState({ [e.target.name]: e.target.value });

    componentDidMount() {
        axios.get(url + '/inventory/read_one.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken'), id: this.state.id
            }
        })
            .then(response => response.data)
            .then((response) => {
                if (!response.error) {
                    this.setState({
                        serial_number: response.inventory.serial_number,
                        hcs_number: response.inventory.hcs_number,
                        purchase_date: response.inventory.purchase_date,
                        status: response.inventory.status === "Active" ? "1" : "0",
                        notes: response.inventory.notes,
                        terminal: response.inventory.terminal_id || response.terminal[0].id,
                        device: response.inventory.device_id || response.device[0].id,
                        terminals: response.terminal,
                        devices: response.device
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
            serial_number: this.state.serial_number,
            hcs_number: this.state.hcs_number,
            purchase_date: this.state.purchase_date,
            status: this.state.status,
            notes: this.state.notes,
            terminal: this.state.terminal,
            device: this.state.device
        };

        axios.post(url + '/inventory/update.php', formData)
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
        if (this.state.terminals && this.state.devices) {
            return (
                <div className="container">
                    <HeadingBar
                        title="Update Inventory"
                        buttonType="Back"
                        linkTo="/inventory"
                    />
                    {this.state.successUpdate && <div className="alert alert-success"><p><i className="fa fa-check-circle fa-2x"></i> {this.state.successUpdate}</p></div>}
                    {this.state.error && <div className="alert alert-danger"><p><i className="fa fa-exclamation-triangle fa-2x"></i> {this.state.error}</p></div>}
                    <div className="edit-form login">
                        <div className="edit-form__container">
                            <form onSubmit={this.onUpdate.bind(this)}>
                                <div className="form-group">
                                    <label htmlFor="terminal">Terminal:</label>
                                    <select onChange={this.onChange.bind(this)} name="terminal" id="terminal" value={this.state.terminal}>
                                        {this.state.terminals
                                            .map(ter => (
                                                <option key={ter.id} value={ter.id}>{ter.name}</option>
                                            ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="device">Device:</label>
                                    <select onChange={this.onChange.bind(this)} name="device" id="device" value={this.state.device}>
                                        {this.state.devices
                                            .map(dev => (
                                                <option key={dev.id} value={dev.id}>{dev.name}</option>
                                            ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="serial-number">Serial Number:</label>
                                    <input type="text" className="form-control" id="serial-number" name="serial_number" value={this.state.serial_number} onChange={this.onChange.bind(this)} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="hcs-number">HCS Number:</label>
                                    <input type="text" className="form-control" id="hcs-number" name="hcs_number" value={this.state.hcs_number} onChange={this.onChange.bind(this)} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="purchase-date">Purchase Date:</label>
                                    <input type="date" className="form-control" id="purchase-date" name="purchase_date" value={this.state.purchase_date} onChange={this.onChange.bind(this)} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="notes">Notes:</label>
                                    <input type="text" className="form-control" id="notes" name="notes" value={this.state.notes} onChange={this.onChange.bind(this)} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Status:</label>
                                    <select value={this.state.status} id="status" name="status" onChange={this.onChange.bind(this)}>
                                        <option value="1">Active</option>
                                        <option value="0">Not Active</option>
                                    </select>
                                </div>
                                <Link to="/inventory" type="button" className="btn btn-secondary btn-cancel">Cancel</Link>
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