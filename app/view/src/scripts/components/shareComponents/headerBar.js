import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const HeadingBar = (props) => {
    return (
        <div className="heading-bar">
            <h1 className="page-title">{props.title}</h1>
            {(Cookies.get('user_role') != "notech" || props.buttonType == "Back") && <Link to={props.linkTo} className="btn btn-default btn-update"> {props.buttonType} </Link>}
        </div>
    );
};

HeadingBar.PropTypes = {
    title: PropTypes.string.isRequired,
    buttonType: PropTypes.string.isRequired,
    linkTo: PropTypes.string.isRequired
};
export default HeadingBar;