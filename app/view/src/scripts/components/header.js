import "../../styles/header.less";
import { url } from './variable.js';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { active: false };
    };

    render() {
        return (
            <header>
                <div className="logo">Logo Name</div>
                <div className="user">
                    <div className="toggle visible-xs">
                        <button type="button" id="sidebarCollapse" className="btn btn-info toggle-btn" onClick={this.props.toggleMenu}>
                            <i className="glyphicon glyphicon-align-left"></i>
                        </button>
                    </div>
                    <div className="hidden-xs text-capitalize"><i className="fa fa-user fa-2x" aria-hidden="true"></i> {Cookies.set('user_name')}</div>
                </div>
            </header>
        );
    };
};

class NoAuthHeader extends React.Component {
    render() {
        return (
            <header>
                <div className="logo">Logo Name</div>
            </header>
        );
    };
};

const AuthHeader = (props) => {
    if (Cookies.get('user_role')) {
        return (<Header {...props} />);
    }
    return (<NoAuthHeader {...props} />);
};

export default AuthHeader;