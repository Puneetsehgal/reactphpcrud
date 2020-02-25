import { url } from '../variable.js';
import HeadingBar from '../shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class AddDevice extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        this.state = {
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
        axios.get(url + '/supplier/read.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken')
            }
        })
            .then(response => response.data)
            .then((response) => {
                !response.error ? this.setState({ suppliers: response.supplier, errormessage: "", error: "" }) : this.setState({ suppliers: [], errormessage: response.error.message, error: response.error.errorcode || "" });
                this.setState({ supplier: this.state.suppliers ? this.state.suppliers[0].id : "" })
            })
            .catch((error) => console.log("error:", error));
    };

    resetForm = (e) => this.setState({ name: "", description: "", supplier: this.state.suppliers[0].id });

    onAdd(e) {
        let formData = {
            name: this.state.name,
            description: this.state.description,
            supplier_id: this.state.supplier
        };

        axios.post(url + '/devices/create.php', formData)
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
        return (
            <div className="container">
                <HeadingBar
                    title="Add New Device"
                    buttonType="Back"
                    linkTo="/devices"
                />
                {this.state.successUpdate && <div className="alert alert-success"><p><i className="fa fa-check-circle fa-2x"></i> {this.state.successUpdate}</p></div>}
                {this.state.error && <div className="alert alert-danger"><p><i className="fa fa-exclamation-triangle fa-2x"></i> {this.state.error}</p></div>}
                <div className="edit-form login">
                    <div className="edit-form__container">
                        <form onSubmit={this.onAdd.bind(this)}>
                            <div className="form-group">
                                <label htmlFor="dev-name">Device Name:</label>
                                <input type="text" className="form-control" id="dev-name" name="name" value={this.state.name} onChange={this.onChange.bind(this)} required/>
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
                            <button type="button" className="btn btn-secondary btn-cancel" onClick={this.resetForm.bind(this)}>Reset</button>
                            <button type="submit" className="btn btn-default btn-submit">Add</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    };
};