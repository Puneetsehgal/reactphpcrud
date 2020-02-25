import { url } from './variable.js';
import HeadingBar from './shareComponents/headerBar.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

class InventoryInfo extends React.Component {
    constructor(props, ctx) {
        super(props, ctx)
        const { match: { params } } = this.props[0];
        this.state = {
            id: params.inventId,
            inventory: []
        }
    };

    componentDidMount() {
        axios.get(url + '/inventory/read_one.php', {
            params: {
                sessiontoken: Cookies.get('sessiontoken'), id: this.state.id
            }
        })
            .then(response => response.data)
            .then((response) => {
                if (!response.error) {
                    this.setState({ inventory: [response.inventory] });
                } else {
                    this.setState({ error: response.error.message })
                }
            })
            .catch((error) => console.log("error:", error));
    };

    render() {
        if (this.state.inventory) {
            return (
                <div className="container">
                    <HeadingBar
                        title="Inventory Info"
                        buttonType="Back"
                        linkTo="/inventory"
                    />
                    {this.state.inventory
                        .map(info => (
                            <div className="inventory-view" key={info.id}>
                                <div className="inventory-view__heading-bar">
                                    <div className="inventory-view__title"> MAC Express Inventory</div>
                                    <div className="inventory-view__serial text-uppercase">SN: {info.serial_number}</div>
                                </div>
                                <div className="inventory-view__content clearfix">
                                    <p><strong>Date:</strong> {info.purchase_date}</p>
                                    <p><strong>HCS Number:</strong> <span className="text-uppercase">{info.hcs_number}</span></p>
                                    <div className="margin50">
                                        <table className="table table-striped table-bordered express-table__table info">
                                            <tbody className="info">
                                                <tr>
                                                    <td className="heading col-xs-4 spacer">Terminal:</td>
                                                    <td className="text-right col-xs-8 spacer">{info.terminal_name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="heading col-xs-4 spacer">Device:</td>
                                                    <td className="text-right col-xs-8 spacer">{info.device_name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="heading col-xs-4 spacer">Supplier:</td>
                                                    <td className="text-right col-xs-8 spacer">{info.supplier_name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="heading col-xs-4 spacer">Location:</td>
                                                    <td className="text-right col-xs-8 spacer">{info.location_name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="heading col-xs-4 spacer">Organization:</td>
                                                    <td className="text-right col-xs-8 spacer">{info.organization_name}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <a href="javascript:window.print()" className="btn btn-default btn-print">Print</a>
                                </div>
                            </div>
                        ))}
                </div>
            );
        }
        return <h1>Loading</h1>
    };
};

export default InventoryInfo;