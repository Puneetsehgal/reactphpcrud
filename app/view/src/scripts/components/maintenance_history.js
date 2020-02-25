import { url } from './variable.js';
import DeleteModal from './shareComponents/deletemodal.js';
import HeadingBar from './shareComponents/headerBar.js';
import Search from './shareComponents/search.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

class MaintenanceHistory extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        this.state = {
            maintenance_history: [],
            error: "",
            id: "",
            date: "",
            description: "",
            delError: "",
            showDeleteModal: false,
            search: ""
        }
        this.showDeleteModal = this.showDeleteModal.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.read = this.read.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount = () => this.read();

    read(search = "") {
        axios.get(url + '/maintenance_history/read.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken'),
                s: search
            }
        })
            .then(response => response.data)
            .then((response) => {
                !response.error ? this.setState({ maintenance_history: response.maintenance_history, errormessage: "", error: "" }) : this.setState({ maintenance_history: [], errormessage: response.error.message, error: response.error.errorcode || "" });
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
            let filterData = this.state.maintenance_history.filter((item) => (this.state.id !== item.id));
            this.setState({ maintenance_history: filterData, showDeleteModal: false, id: "" });
        } else {
            this.setState({ delError: response.message });
            this.hideDeleteModal();
        }
    };

    render() {
        return (
            <div className="container">
                <HeadingBar
                    title="Maintenance History"
                    buttonType="Add New"
                    linkTo="/maintenance-history/add-new"
                />
                <div className="inventory-table express-table">
                    <Search
                        search={this.state.value}
                        change={(e) => this.onChange(e)}
                    />
                    {this.state.delError && <div className="alert alert-danger"><i className="fa fa-exclamation-triangle"></i> {this.state.delError}</div>}
                    {(this.state.maintenance_history && !this.state.error) &&
                        <table className="table table-striped table-bordered express-table__table">
                            <thead>
                                <tr>
                                    <th className="text-center" scope="col">Serial Number</th>
                                    <th className="text-center" scope="col">Description</th>
                                    <th className="text-center" scope="col">Date</th>
                                    <th className="text-center" scope="col">User</th>
                                    <th className="text-center" colSpan="2" scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.maintenance_history
                                    .map(item => (
                                        <tr key={item.id} className="text-center">
                                            <td>{item.serial_number}</td>
                                            <td>{item.description}</td>
                                            <td>{item.date}</td>
                                            <td>{item.user_name}</td>
                                            <td><Link to={"/maintenance-history/update/" + item.id} className="btn btn-default btn-update btn-icon" aria-label="edit this inventory"><i className="fa fa-pencil"></i></Link></td>
                                            <td><button data-target="#deleteModal" type="button" className="btn btn-default btn-del btn-icon" data-toggle="modal" onClick={this.showDeleteModal.bind(this, item.id)} aria-label="delete this inventory"><i className="fa fa-trash"></i></button></td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>}
                    {/* errors section */}
                    {this.state.error && <div className="alert alert-danger"><i className="fa fa-exclamation-triangle"></i> {this.state.errormessage}</div>}
                </div>
                {/* Delete Modal Window */}
                <DeleteModal
                    backdrop="static"
                    title="Delete Selected Maintenance history"
                    content="Are you sure to delete?"
                    pageName="maintenance_history"
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

export default MaintenanceHistory;