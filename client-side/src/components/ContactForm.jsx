import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import Title from "./Title"
import { sendMessage, clearContactState } from "../features/contactSlice";

const ContactForm = () => {
    const dispatch = useDispatch();
    const {isLoading, isError, errorMsg, isSuccess, successMsg } = useSelector(state => state.contact) 

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage]= useState("")

    useEffect(() => {
        if(isSuccess) {
            setUsername("")
            setEmail("")
            setSubject("")
            setMessage("")
        }                
    }, [isLoading, isSuccess, isError])

    const handleMessageClick = (e) => {
        e.preventDefault();        
        dispatch(sendMessage({username, email, subject, message}))
    }

    return (
        <div className="container-fluid pt-5">
            <Title title="Contact For Any Queries" />
            <div className="row px-xl-5">
                <div className="col-lg-7 mb-5">
                    <div className="contact-form">
                        <div className="text-success">{isSuccess && successMsg}</div>
                        <div className="text-danger">{isError && errorMsg}</div>
                        <form onSubmit={handleMessageClick} name="sentMessage" id="contactForm" novalidate="novalidate">
                            <div className="control-group">
                                <input type="text" className="form-control" id="name" placeholder="Your Name" value={username} onChange={(e)=>setUsername(e.target.value)}
                                    required="required" data-validation-required-message="Please enter your name" />
                                <p className="help-block text-danger"></p>
                            </div>
                            <div className="control-group">
                                <input type="email" className="form-control" id="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    required="required" data-validation-required-message="Please enter your email" />
                                <p className="help-block text-danger"></p>
                            </div>
                            <div className="control-group">
                                <input type="text" className="form-control" id="subject" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)}
                                    required="required" data-validation-required-message="Please enter a subject" />
                                <p className="help-block text-danger"></p>
                            </div>
                            <div className="control-group">
                                <textarea className="form-control" rows="6" id="message" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)}
                                    required="required"
                                    data-validation-required-message="Please enter your message"></textarea>
                                <p className="help-block text-danger"></p>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary py-2 px-4" type="submit" id="sendMessageButton">Send
                                    Message</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-lg-5 mb-5">
                    <h5 className="font-weight-semi-bold mb-3">Get In Touch</h5>
                    <p>Justo sed diam ut sed amet duo amet lorem amet stet sea ipsum, sed duo amet et. Est elitr dolor elitr erat sit sit. Dolor diam et erat clita ipsum justo sed.</p>
                    <div className="d-flex flex-column mb-3">
                        <h5 className="font-weight-semi-bold mb-3">Store 1</h5>
                        <p className="mb-2"><i className="fa fa-map-marker-alt text-primary mr-3"></i>123 Street, New York, USA</p>
                        <p className="mb-2"><i className="fa fa-envelope text-primary mr-3"></i>info@example.com</p>
                        <p className="mb-2"><i className="fa fa-phone-alt text-primary mr-3"></i>+012 345 67890</p>
                    </div>
                    <div className="d-flex flex-column">
                        <h5 className="font-weight-semi-bold mb-3">Store 2</h5>
                        <p className="mb-2"><i className="fa fa-map-marker-alt text-primary mr-3"></i>123 Street, New York, USA</p>
                        <p className="mb-2"><i className="fa fa-envelope text-primary mr-3"></i>info@example.com</p>
                        <p className="mb-0"><i className="fa fa-phone-alt text-primary mr-3"></i>+012 345 67890</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactForm
