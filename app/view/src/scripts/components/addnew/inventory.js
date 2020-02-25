import { url } from '../variable.js';
import HeadingBar from '../shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class AddInventory extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        this.state = {
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
        axios.get(url + '/terminal/read.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken')
            }
        })
            .then(response => response.data)
            .then((response) => {
                !response.error ? this.setState({ terminals: response.terminal, errormessage: "", error: "" }) : this.setState({ terminals: [], errormessage: response.error.message, error: response.error.errorcode || "" });
                this.setState({ terminal: this.state.terminals ? this.state.terminals[0].id : "" })
            })
            .catch((error) => console.log("error:", error));


        axios.get(url + '/devices/read.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken')
            }
        })
            .then(response => response.data)
            .then((response) => {
                !response.error ? this.setState({ devices: response.devices, errormessage: "", error: "" }) : this.setState({ devices: [], errormessage: response.error.message, error: response.error.errorcode || "" });
                this.setState({ device: this.state.devices ? this.state.devices[0].id : "" })
            })
            .catch((error) => console.log("error:", error));
    };

    resetForm = (e) => this.setState({ serial_number: "", hcs_number: "", purchase_date: "", status: "1", notes: "", terminal: this.state.terminals[0].id, device: this.state.devices[0].id });

    onAdd(e) {
        let formData = {
            serial_number: this.state.serial_number,
            hcs_number: this.state.hcs_number,
            purchase_date: this.state.purchase_date,
            status: this.state.status,
            notes: this.state.notes,
            terminal: this.state.terminal,
            device: this.state.device
        };

        axios.post(url + '/inventory/create.php', formData)
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
            window.scrollTo(0, 0);
        e.preventDefault();
    };

    render() {
        if (this.state.terminals && this.state.devices) {
            return (
                <div className="container">
                    <HeadingBar
                        title="Add New Inventory"
                        buttonType="Back"
                        linkTo="/inventory"
                    />
                    {this.state.successUpdate && <div className="alert alert-success"><p><i className="fa fa-check-circle fa-2x"></i> {this.state.successUpdate}</p></div>}
                    {this.state.error && <div className="alert alert-danger"><p><i className="fa fa-exclamation-triangle fa-2x"></i> {this.state.error}</p></div>}
                    <div className="edit-form login">
                        <div className="edit-form__container">
                            <form onSubmit={this.onAdd.bind(this)}>
                                <div className="form-group">
                                    <label htmlFor="terminal">Terminal:</label>
                                    <select onChange={this.onChange.bind(this)} id="terminal" name="terminal" value={this.state.terminal}>
                                        {this.state.terminals
                                            .map(ter => (
                                                <option key={ter.id} value={ter.id}>{ter.name}</option>
                                            ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="device">Device:</label>
                                    <select onChange={this.onChange.bind(this)} id="device" name="device" value={this.state.device}>
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

