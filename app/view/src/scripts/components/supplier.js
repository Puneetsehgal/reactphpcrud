import { url } from './variable.js';
import DeleteModal from './shareComponents/deletemodal.js';
import HeadingBar from './shareComponents/headerBar.js';
import Search from './shareComponents/search.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Supplier extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        this.state = {
            suppliers: [],
            error: "",
            errormessage: "",
            delError: "",
            id: "",
            name: "",
            address: "",
            contact: "",
            email: "",
            description: "",
            showDeleteModal: false,
            search: ""
        }

        this.showDeleteModal = this.showDeleteModal.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.read = this.read.bind(this);
        this.onChange = this.onChange.bind(this);
    };

    componentDidMount = () => this.read();

    read(search = "") {
        axios.get(url + '/supplier/read.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken'),
                s: search
            }
        })
            .then(response => response.data)
            .then((response) => {
                !response.error ? this.setState({ suppliers: response.supplier, errormessage: "", error: "" }) : this.setState({ suppliers: [], errormessage: response.error.message, error: response.error.errorcode || "" });
            })
            .catch((error) => console.log("error:", error));
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        this.read(e.target.value);
    };

    hideDeleteModal = () => this.setState({ showDeleteModal: false, id: "" });

    showDeleteModal = (id) => this.setState({ showDeleteModal: true, id: id });

    refreshData = (response) => {
        if (!response.errorcode) {
            let filterData = this.state.suppliers.filter((item) => (this.state.id !== item.id));
            this.setState({ suppliers: filterData, showDeleteModal: false, id: "" });
        } else {
            this.setState({ delError: response.message });
            this.hideDeleteModal();
        }

    };

    render() {
        return (
            <div className="container">
                <HeadingBar
                    title="Supplier"
                    buttonType="Add New"
                    linkTo="/suppliers/add-new"
                />
                <div className="inventory-table express-table">
                    <Search
                        search={this.state.value}
                        change={(e) => this.onChange(e)}
                    />
                    {this.state.delError && <div className="alert alert-danger"><i className="fa fa-exclamation-triangle"></i> {this.state.delError}</div>}
                    {(this.state.suppliers.length > 0 && !this.state.errormessage) &&
                        <table className="table table-striped table-bordered express-table__table">
                            <thead>
                                <tr>
                                    <th className="text-center" scope="col">Name</th>
                                    <th className="text-center" scope="col">Address</th>
                                    <th className="text-center" scope="col">Contact</th>
                                    <th className="text-center" scope="col">Email</th>
                                    <th className="text-center" scope="col">Description</th>
                                    <th className="text-center" colSpan="2" scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.suppliers
                                    .map(item => (
                                        <tr key={item.id} className="text-center">
                                            <td>{item.name}</td>
                                            <td>{item.address}</td>
                                            <td>{item.contact}</td>
                                            <td className="text-lowercase">{item.email}</td>
                                            <td>{item.description}</td>
                                            <td><Link to={"/suppliers/update/" + item.id} className="btn btn-default btn-update btn-icon" aria-label="edit this inventory"><i className="fa fa-pencil"></i></Link></td>
                                            <td><button data-target="#deleteModal" type="button" className="btn btn-default btn-del btn-icon" data-toggle="modal" onClick={this.showDeleteModal.bind(this, item.id)} aria-label="delete this inventory"><i className="fa fa-trash"></i></button></td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>}
                    {/* errors section */}
                    {((this.state.error && this.state.errormessage) || (this.state.errormessage && !this.state.error)) && <div className="alert alert-danger"><i className="fa fa-exclamation-triangle"></i> {this.state.errormessage}</div>}
                </div>
                {/* Delete Modal Window */}
                <DeleteModal
                    backdrop="static"
                    title="Delete Selected Supplier"
                    content="Are you sure to delete?"
                    pageName="supplier"
                    id={this.state.id}
                    show={this.state.showDeleteModal}
                    refresh={(response) => this.refreshData(response)}
                    onCancel={() => this.hideDeleteModal()}
                />
            </div>
        );
        return <h1>Loading</h1>
    };
};

export default Supplier;