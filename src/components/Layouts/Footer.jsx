import React from 'react'

const Footer = () => {
  return (
    <div className="footer-sec">
    <div className="row primary">
        <div className="column about">
            <h3>Connect</h3>
            <p>
            <i className="fa fa-map-marker" aria-hidden="true"></i>
            Sienna Towers, Service Road, Bangalore
            </p>
            <div className="social">
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-linkedin"></i>
            <i className="fa-brands fa-instagram"></i>
            </div>
        </div>

        <div className="column link">
            <h3>Links</h3>
            <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#blogs">Blogs</a></li>
            <li><a href="#support">Support</a></li>
            </ul>
        </div>

        {/* <div className="column subscribe">
            <h3>Newsletter</h3>
            <div>
            <input type="email" placeholder="Your email id here" />
            <button>Subscribe</button>
            </div>
        </div> */}
    </div>
    </div>

  )
}

export default Footer
