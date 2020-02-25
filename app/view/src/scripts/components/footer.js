import { Link } from 'react-router-dom';

class Footer extends React.Component {
    render() {
        let d = new Date();
        return (
            <footer>
                <small><a href="http://puneetsehgal.com/" target="_blank">Puneet Sehgal</a> {<span dangerouslySetInnerHTML={{ __html: '&copy;' }} />} {d.getFullYear()}</small>
            </footer>
        );
    };
};

export default Footer;