import { createPortal } from "react-dom";
import style from "../FeedbackModal/FeedbackModal.module.css";

const FormFeedbackModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  error = false,
  confirmLabel = "OK",
}) => {
  return createPortal(
    <div className={style.overlay} role="presentation">
      <section
        className={`${style.modal} ${error ? style.error : ""}`}
        role="alertdialog"
        aria-modal="true"
      >
        <div className={style.icon}>{error ? "!" : "✓"}</div>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={style.actions}>
          {onCancel && (
            <button type="button" className={style.cancelButton} onClick={onCancel}>
              CANCEL
            </button>
          )}
          <button type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
};

export default FormFeedbackModal;
