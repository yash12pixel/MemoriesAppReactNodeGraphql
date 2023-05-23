import React from "react";
import { Modal } from "react-bootstrap";
import { Button } from "@mui/material";
// import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import "./style.scss";

const WarningModal = ({ isOpen, onConfirm, onCancel, id, title }) => {
  return (
    <Modal show={isOpen} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-danger">
          {`Are you sure you want to delete this Memory! ${title}`}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => onConfirm(id)}>
          Delete
        </Button>
        <Button variant="default" onClick={onCancel}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

WarningModal.defaultProps = {
  btnText: "Close",
};

export default WarningModal;
