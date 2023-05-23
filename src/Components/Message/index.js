import React from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'

const Message = ({ variant, children }) => {
    return (
        <ToastContainer style={{ top: '10px', right: '10px' }} className="p-3 position-fixed">
            <Toast className={'text-white'} bg={variant} delay={6000} autohide>
                <Toast.Body>{children}</Toast.Body>
            </Toast>
        </ToastContainer>
    )
}

Message.defaultProps = {
    variant: 'info'
}

export default Message