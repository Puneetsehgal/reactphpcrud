import "../../styles/sidebar.less";
import { url } from './variable.js';
import DeleteModal from './shareComponents/deletemodal.js';
import HeadingBar from './shareComponents/headerBar.js';
import Search from './shareComponents/search.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

class User extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        this.state = {
            users: [],
            id: "",
            name: "",
            password: "",
            firstname: "",
            lastname: "",
            group: "",
            notes: "",
            error: "",
            errormessage: "",
            delError: "",
            showDeleteModal: false,
            search: ""
        }

        this.read = this.read.bind(this);
        this.onChange = this.onChange.bind(this);
        this.showDeleteModal = this.showDeleteModal.bind(this);
        this.refreshData = this.refreshData.bind(this);
    };

    componentDidMount = () => this.read();

    read(search) {
        axios.get(url + '/users/read.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken'), s: search
            }
        })
            .then(response => response.data)
            .then((response) => {
                !response.error ? this.setState({ users: response.user, errormessage: "", error: "" }) : this.setState({ users: [], errormessage: response.error.message, error: response.error.errorcode || "" });
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
            let filterData = this.state.users.filter((item) => (this.state.id !== item.id));
            this.setState({ users: filterData, showDeleteModal: false, id: "" });
        } else {
            this.setState({ delError: response.message });
            this.hideDeleteModal();
        }
    };

    render() {
        return (
            <div className="container">
                <HeadingBar
                    title="Users"
                    buttonType="Add New"
                    linkTo="/users/add-new"
                />
                <div className="inventory-table express-table">
                    <Search
                        search={this.state.value}
                        change={(e) => this.onChange(e)}
                    />
                    {this.state.delError && <div className="alert alert-danger"><i className="fa fa-exclamation-triangle"></i> {this.state.delError}</div>}
                    {(this.state.users && !this.state.error) &&
                        <table className="table table-striped table-bordered express-table__table">
                            <thead>
                                <tr>
                                    <th className="text-center" scope="col">User Name</th>
                                    <th className="text-center" scope="col">Password</th>
                                    <th className="text-center" scope="col">First Name</th>
                                    <th className="text-center" scope="col">Last Name</th>
                                    <th className="text-center" scope="col">Email</th>
                                    <th className="text-center" scope="col">Group</th>
                                    <th className="text-center" scope="col">Notes</th>
                                    <th className="text-center" colSpan="2" scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.users
                                    .map(item => (
                                        <tr key={item.id} className="text-center">
                                            <td>{item.name}</td>
                                            <td className="password">{item.password}</td>
                                            <td>{item.firstname}</td>
                                            <td>{item.lastname}</td>
                                            <td className="text-lowercase">{item.useremail}</td>
                                            <td>{item.group === "notech" ? "Non Technical Staff" : item.group === "tech" ? "Techincal Staff" : item.group}</td>
                                            <td>{item.notes}</td>
                                            <td><Link to={"/users/update/" + item.id} className="btn btn-default btn-update btn-icon" aria-label="edit this inventory"><i className="fa fa-pencil"></i></Link></td>
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
                    title="Delete Selected User"
                    content="Are you sure to delete?"
                    pageName="users"
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

export default User;