import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "../../styles/Shared/Modal.scss";
import ReactDOM from "react-dom";

interface IProps {
  title: string,
  children: React.ReactNode,
  setShowModal: (show: boolean) => any,
  height?: string // can be any valid css height value
  width?: string // can be any valid css width value
  maxWidth?: string // can be any valid css max-width value
  maxHeight?: string // can be any valid css min-height value
  icon?: string // link to an icon/symbol
}

export default function Modal(props: IProps) {
  document.documentElement.style.setProperty("--modal-height", props.height ?? "100vh");
  document.documentElement.style.setProperty("--modal-width", props.width ?? "50%");
  document.documentElement.style.setProperty("--modal-max-width", props.maxWidth ?? "600px");
  document.documentElement.style.setProperty("--modal-max-height", props.maxHeight ?? "100vh");

  const inTransaction = useSelector((state: RootState) => state.layoutReducer.inTransaction);

  const escapeHandler = useCallback((event) => {
    if (event.keyCode === 27 && !inTransaction) {
      props.setShowModal(false);
    }
  }, [props, inTransaction]);

  React.useEffect(() => {
    window.addEventListener("keydown", escapeHandler);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "initial";
      window.removeEventListener("keydown", escapeHandler);
    }
  }, [escapeHandler]);

  const onBackdropClick = (event) => {
    if (event.target.className === "modal-wrapper" && !inTransaction) {
      props.setShowModal(false);
    }
  }

  return ReactDOM.createPortal(
    <div className="modal-wrapper" onClick={onBackdropClick}>
      <div className="modal-content-wrapper">
        <div className="modal-top">
          <div className="name-icon-wrapper">
            {props.icon && typeof(props.icon) === "string" ? <img src={props.icon} alt="icon" /> : props.icon}
            {props.title}
          </div>
          <button
            className="close"
            onClick={() => props.setShowModal(false)}>&times;</button>
        </div>
        <div className="modal-content">
          {props.children}
        </div>
      </div>
    </div>, document.body)
}
