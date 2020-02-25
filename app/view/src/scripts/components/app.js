import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { BrowserRouter as Router, Route, Redirect, IndexRoute, Switch, withRouter } from 'react-router-dom';
import Bootstrap from 'bootstrap/dist/js/bootstrap.min.js';
// global page component
import Header from './header.js';
import Sidebar from './sidebar.js';
import Footer from './footer.js';
// user login related page component
import Login from './login.js';
import ForgetPassword from './forgetPassword.js';
import ChangePassword from './changePassword.js';
// all individual page components
import Inventory from './inventory.js';
import InventoryInfo from './inventory-info.js';
import Locations from './locations.js';
import Organization from './organization.js';
import Terminal from './terminal.js';
import Supplier from './supplier.js';
import Device from './device.js';
import User from './user.js';
import MaintenanceHistory from './maintenance_history.js';
import My404Component from './nofound.js'
// Update Pages
import UpdateLocation from './update/locations.js'
import UpdateOrganization from './update/organization.js'
import UpdateUser from './update/user.js'
import UpdateDevice from './update/device.js'
import UpdateSupplier from './update/supplier.js'
import UpdateInventory from './update/inventory.js'
import UpdateTerminal from './update/terminal.js'
import UpdateMainHistory from './update/maintenance_history.js'
// Add new Pages
import AddLocation from './addnew/locations.js'
import AddOrganization from './addnew/organization.js'
import AddUser from './addnew/user.js'
import AddDevice from './addnew/device.js'
import AddSupplier from './addnew/supplier.js'
import AddInventory from './addnew/inventory.js'
import AddTerminal from './addnew/terminal.js'
import AddMainHistory from './addnew/maintenance_history.js'

// Authentication
const admin = ["admin"];
const tech = ["admin", "tech"];
const noTech = ["admin", "tech", "notech"];

const noTechTemplate = [
    {
        path: '/locations',
        component: Locations
    },
    {
        path: '/inventory',
        component: Inventory
    },
    {
        path: '/inventory/info/:inventId',
        component: InventoryInfo
    },
    {
        path: '/change-password',
        component: ChangePassword
    }
];

const techTemplate = [
    {
        path: '/organizations',
        component: Organization
    },
    {
        path: '/terminals',
        component: Terminal
    },
    {
        path: '/suppliers',
        component: Supplier
    },
    {
        path: '/devices',
        component: Device
    },
    {
        path: '/maintenance-history',
        component: MaintenanceHistory
    },
    {
        path: '/locations/update/:id',
        component: UpdateLocation
    },
    {
        path: '/locations/add-new',
        component: AddLocation
    },
    {
        path: '/organizations/update/:id',
        component: UpdateOrganization
    },
    {
        path: '/organizations/add-new',
        component: AddOrganization
    },
    {
        path: '/devices/update/:id',
        component: UpdateDevice
    },
    {
        path: '/devices/add-new',
        component: AddDevice
    },
    {
        path: '/terminals/update/:id',
        component: UpdateTerminal
    },
    {
        path: '/terminals/add-new',
        component: AddTerminal
    },
    {
        path: '/suppliers/update/:id',
        component: UpdateSupplier
    },
    {
        path: '/suppliers/add-new',
        component: AddSupplier
    },
    {
        path: '/maintenance-history/update/:id',
        component: UpdateMainHistory
    },
    {
        path: '/maintenance-history/add-new',
        component: AddMainHistory
    },
    {
        path: '/inventory/update/:id',
        component: UpdateInventory
    },
    {
        path: '/inventory/add-new',
        component: AddInventory
    }
];

const adminTemplate = [
    {
        path: '/users',
        component: User
    },
    {
        path: '/users/add-new',
        component: AddUser
    },
    {
        path: '/users/update/:id',
        component: UpdateUser
    }
];

class App extends Component {
    constructor(props, ctx) {
        super(props, ctx)
        this.state = {
            username: Cookies.get('user_name') || "",
            showMenu: false,
            activeOnLoadNav: "inventory",
            pageClass: this.props.location.pathname.split("/")[1] || "login"
        }

        this.updateUser = this.updateUser.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.pageClass = this.pageClass.bind(this);
    };

    static propTypes = {
        match: React.PropTypes.object.isRequired,
        location: React.PropTypes.object.isRequired,
        history: React.PropTypes.object.isRequired
    };

    updateUser = (name) => this.setState({ username: Cookies.get('user_name') });

    toggleMenu = () => this.setState({ showMenu: !this.state.showMenu });

    pageClass = (className) => {
        this.setState({ pageClass: className || "login" });
    }

    AdminRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
            admin.indexOf(Cookies.get('user_role')) != -1
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                }} />
        )} />
    );

    NoTechRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(...props) => (
            noTech.indexOf(Cookies.get('user_role')) != -1
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                }} />
        )} />
    );

    TechRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
            tech.indexOf(Cookies.get('user_role')) != -1
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                }} />
        )} />
    );

    render() {
        const { match, location, history } = this.props
        return (
            <Router history={browserHistory}>
                <div className="main" id={this.state.pageClass}>
                    <Header toggleMenu={this.toggleMenu} username={this.state.username} />
                    <div className="wrapper">
                        <Sidebar toggleMenu={this.toggleMenu} showMenu={this.state.showMenu} toggleNav={this.state.pageClass} pageClass={this.pageClass} username={this.state.username} />
                        <div className="content">
                            <Switch>
                                <Route path="/" exact username render={(props) => (<Login pageClass={this.pageClass} updateUser={this.updateUser} {...props} />)} />
                                <Route path="/forget-password" exact  render={(props) => (<ForgetPassword pageClass={this.pageClass} {...props} />)}/>
                                {adminTemplate.map(route => (
                                    <this.AdminRoute key={route.path} exact path={route.path} component={route.component} />
                                ))}
                                {noTechTemplate.map(route => (
                                    <this.NoTechRoute key={route.path} exact path={route.path} component={route.component} />
                                ))}
                                {techTemplate.map(route => (
                                    <this.TechRoute key={route.path} exact path={route.path} component={route.component} />
                                ))}
                                <Route path='*' component={My404Component} />
                            </Switch>
                            <Footer />
                        </div>
                    </div>
                </div>
            </Router>
        );
    };
};

const Application = withRouter(App);
export default Application;