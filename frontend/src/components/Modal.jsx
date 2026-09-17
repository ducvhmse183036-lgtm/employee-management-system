import { useEffect, useRef } from 'react'
import BootstrapModal from 'bootstrap/js/dist/modal'

export default function Modal({ title, onClose, children, busy = false }) {
  const ref = useRef(null)
  useEffect(() => {
    const previous = document.activeElement
    const modal = new BootstrapModal(ref.current, {
      backdrop: 'static',
      keyboard: false,
    })
    modal.show()
    return () => {
      modal.hide()
      modal.dispose()
      previous?.focus()
    }
  }, [])
  return (
    <div
      className="modal"
      ref={ref}
      tabIndex="-1"
      aria-labelledby="dialog-title"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5" id="dialog-title">
              {title}
            </h2>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              disabled={busy}
              onClick={onClose}
            />
          </div>
          <div className="modal-body p-4">{children}</div>
        </div>
      </div>
    </div>
  )
}
