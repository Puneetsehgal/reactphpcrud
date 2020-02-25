import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Search = (props) => {
    return (
        <form className="search-form">
            <div className="form-group">
                <label htmlFor="search">Search</label>
                <input type="text" className="form-control form-control-lg" id="search" name="search" value={props.search} onChange={props.change} />
            </div>
        </form>
    );
};

export default Search;