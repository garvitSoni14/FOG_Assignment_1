import React from 'react';
import './ConfirmDialog.css';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  loading = false
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <FiAlertTriangle className="dialog-icon danger" />;
      case 'warning':
        return <FiAlertTriangle className="dialog-icon warning" />;
      case 'info':
        return <FiAlertTriangle className="dialog-icon info" />;
      default:
        return <FiAlertTriangle className="dialog-icon warning" />;
    }
  };

  return (
    <div className="confirm-dialog-overlay" onClick={handleClose}>
      <div className="confirm-dialog-container" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-header">
          <div className="dialog-icon-container">
            {getIcon()}
          </div>
          <h3 className="dialog-title">{title}</h3>
          <button 
            className="dialog-close-btn" 
            onClick={handleClose}
            disabled={loading}
          >
            <FiX />
          </button>
        </div>

        <div className="confirm-dialog-content">
          <p className="dialog-message">{message}</p>
        </div>

        <div className="confirm-dialog-actions">
          <button
            className="dialog-btn cancel-btn"
            onClick={handleClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className={`dialog-btn confirm-btn ${type}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
