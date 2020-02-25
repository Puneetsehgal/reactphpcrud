import { url } from './variable.js';
import DeleteModal from './shareComponents/deletemodal.js';
import HeadingBar from './shareComponents/headerBar.js';
import Search from './shareComponents/search.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Locations extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        this.state = {
            locations: [],
            organizations: [],
            errormessage: "",
            error: "",
            delError: "",
            id: "",
            organization: "",
            showDeleteModal: false,
            search: ""
        };
        this.showDeleteModal = this.showDeleteModal.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.read = this.read.bind(this);
        this.onChange = this.onChange.bind(this);
    };

    componentDidMount = () => this.read();

    read(search = "") {
        axios.get(url + '/locations/read.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken'),
                s: search
            }
        })
            .then(response => response.data)
            .then((response) => {
                !response.error ? this.setState({ locations: response.locations, errormessage: "", error: "" }) : this.setState({ locations: [], errormessage: response.error.message, error: response.error.errorcode || "" });
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
            let filterData = this.state.locations.filter((item) => (this.state.id !== item.id));
            this.setState({ locations: filterData, showDeleteModal: false, id: "" });
        } else {
            this.setState({ delError: response.message });
            this.hideDeleteModal();
        }
    };

    render() {
        return (
            <div className="container">
                <HeadingBar
                    title="Locations"
                    buttonType="Add New"
                    linkTo="/locations/add-new"
                />
                <div className="inventory-table express-table">
                    <Search
                        search={this.state.value}
                        change={(e) => this.onChange(e)}
                    />
                    {this.state.delError && <div className="alert alert-danger"><i className="fa fa-exclamation-triangle"></i> {this.state.delError}</div>}
                    {(this.state.locations.length > 0 && !this.state.errormessage) &&
                        <table className="table table-striped table-bordered express-table__table">
                            <thead>
                                <tr>
                                    <th className="text-center" scope="col">Name</th>
                                    <th className="text-center" scope="col">Organizations</th>
                                    <th className="text-center" scope="col">Desctiption</th>
                                    <th className="text-center" scope="col">Status</th>
                                    {(Cookies.get("user_role") != "notech") &&
                                        <th className="text-center" colSpan="2" scope="col"></th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.locations
                                    .map(item => (
                                        <tr key={item.id} className="text-center">
                                            <td>{item.name}</td>
                                            <td>{item.organization_name}</td>
                                            <td>{item.description}</td>
                                            <td>{item.status}</td>
                                            {Cookies.get("user_role") != "notech" &&
                                                <td><Link to={"/locations/update/" + item.id} className="btn btn-default btn-update btn-icon" aria-label="edit this inventory"><i className="fa fa-pencil"></i></Link></td>}
                                            {Cookies.get("user_role") != "notech" &&
                                                <td><button data-target="#deleteModal" type="button" className="btn btn-default btn-del btn-icon" data-toggle="modal" onClick={this.showDeleteModal.bind(this, item.id)} aria-label="delete this location"><i className="fa fa-trash"></i></button></td>
                                            }
                                        </tr>
                                    ))}
                            </tbody>
                        </table>}
                    {/* errors section */}
                    {((this.state.error && this.state.errormessage) || (this.state.errormessage && !this.state.error)) && <div className="alert alert-danger"><i className="fa fa-exclamation-triangle"></i> {this.state.errormessage}</div>}
                    {this.state.delError && <div className="alert alert-danger"><i className="fa fa-exclamation-triangle"></i> {this.state.delError}</div>}
                </div>
                {/* Delete Modal Window */}
                <DeleteModal
                    backdrop="static"
                    title="Delete Selected Location"
                    content="Are you sure to delete?"
                    pageName="locations"
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

export default Locations;