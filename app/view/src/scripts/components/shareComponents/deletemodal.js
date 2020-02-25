import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { url } from '../variable.js';
import axios from 'axios';

const DeleteModal = (props) => {
	const deleteLabel = props.deleteLabel || 'Delete';
	const deleteStyle = props.deleteStyle || 'default';
	const backdrop = props.backdrop || true;

	const deleteRow = () => {
		let deleteId = {
			'id': props.id
		}
		axios.post(url + "/" + props.pageName + "/delete.php", deleteId)
			.then(response => response.data)
			.then((response) => {
				props.refresh(response);
			})
			.catch((error) => console.log("error:", error));
	};

	return (
		<Modal
			show={props.show}
			backdrop={backdrop}>
			<Modal.Header>
				<Modal.Title>{props.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>{props.content}</p>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onCancel} className="btn btn-cancel">Cancel</Button>
				<Button onClick={deleteRow.bind()} bsStyle={deleteStyle}>{deleteLabel}</Button>
			</Modal.Footer>
		</Modal>
	);
};

DeleteModal.propTypes = {
	title: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	show: PropTypes.bool.isRequired,
	deleteLabel: PropTypes.string,
	deleteStyle: PropTypes.string,
	cancelStyle: PropTypes.string,
	backdrop: PropTypes.string,
	pageName: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	refresh: PropTypes.func.isRequired
};

export default DeleteModal;