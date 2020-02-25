import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { url } from './variable.js';
import axios from 'axios';

class Sidebar extends Component {
    constructor(props, ctx) {
        super(props, ctx)
        this.state = {
            navigation: [],
            activeNav: "",
        };
    };

    logout() {
        Cookies.remove('user_role');
        Cookies.remove('user_name');
        Cookies.remove('user_username');
        Cookies.remove('sessiontoken');
        Cookies.remove('PHPSESSID');

        sessionStorage.clear();

        this.setState({ activeNav: "inventory"});
        this.props.pageClass("login");

        axios.post(url + "/users/logout.php")
            .then(response => response.data)
            .then((response) => {
                console.log(response.message);
            })
            .catch((error) => console.log("error:", error));
    };

    componentDidMount() {
        const admin = ["admin"];
        const tech = ["admin", "tech"];
        const noTech = ["admin", "tech", "notech"];

        let navigation_array = [];

        if (noTech.indexOf(Cookies.get('user_role')) != -1) {
            navigation_array.push({ name: "inventory", path: <Link to="/inventory" className="user-options__option option1" value="inventory">Inventory</Link> });
            navigation_array.push({ name: "locations", path: <Link to="/locations" className="user-options__option option2" value="locations">Locations</Link> });
        }
        if (tech.indexOf(Cookies.get('user_role')) != -1) {
            navigation_array.push({ name: "organizations", path: <Link to="/organizations" className="user-options__option option3" value="organizations">Organizations</Link> });
            navigation_array.push({ name: "terminals", path: <Link to="/terminals" className="user-options__option option4" value="terminals">Terminals</Link> });
            navigation_array.push({ name: "suppliers", path: <Link to="/suppliers" className="user-options__option option5" value="suppliers">Suppliers</Link> });
            navigation_array.push({ name: "devices", path: <Link to="/devices" className="user-options__option option6" value="devices">Devices</Link> });
            navigation_array.push({ name: "maintenance-history", path: <Link to="/maintenance-history" className="user-options__option option7" value="maintenance_history">Maintenance History</Link> });
        }
        if (admin.indexOf(Cookies.get('user_role')) != -1) {
            navigation_array.push({ name: "users", path: <Link to="/users" className="user-options__option option8" value="users">Users</Link> });
        }

        this.setState({ navigation: navigation_array, activeNav: this.props.toggleNav == "login" ? "inventory"  : this.props.toggleNav});
        this.props.pageClass("inventory");
    };

    handleSelect(name) {
        this.setState({ activeNav: name });
        this.props.pageClass(name);
        this.props.toggleMenu();
    };

    render() {
        if (this.state.navigation) {
            return (
                <nav id="sidebar" className={this.props.showMenu ? "active" : ""}>
                    <ul className="list-unstyled components main-list">
                        <p className="visible-xs text-capitalize sidebar-user"><i className="fa fa-user fa-2x" aria-hidden="true"></i> {Cookies.set('user_name')}</p>
                        {this.state.navigation.
                            map((nav, index) => (
                                <li key={index} value={nav.name} className={this.state.activeNav === nav.name ? "active" : ""} onClick={this.handleSelect.bind(this, nav.name)}>{nav.path}</li>
                            ))}
                    </ul>
                    <ul className="list-unstyled components">
                        <li value="change-password" className={this.state.activeNav === "change-password" ? "active" : ""} onClick={this.handleSelect.bind(this, "change-password")}>
                            <Link to="/change-password" className="user-options__option option8">Change Password</Link>
                        </li>
                        <li>
                            <Link to="#" onClick={this.logout.bind(this)} className="user-options__option option8">Log Out</Link>
                        </li>
                    </ul>
                </nav>
            );
        }
    };
};

const AuthSidebar = (props) => {
    if (Cookies.get('user_role')) {
        return (<Sidebar {...props} />);
    }
    return false;
};

export default AuthSidebar;