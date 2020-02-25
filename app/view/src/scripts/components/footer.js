import { Link } from 'react-router-dom';

class Footer extends React.Component {
    render() {
        let d = new Date();
        return (
            <footer>
                <small><a href="http://www.mcmaster.ca/" target="_blank">McMaster University</a> {<span dangerouslySetInnerHTML={{ __html: '&copy;' }} />} {d.getFullYear()}</small>
            </footer>
        );
    };
};

export default Footer;