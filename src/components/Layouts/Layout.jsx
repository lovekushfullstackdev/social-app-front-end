import React, { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';


const Layout = () => {
    const location = useLocation();  

  return (
    <div>
      <Header />
      <div className="main-content">
        <div className="left-content">
            <nav id="sidebarMenu" className="collapse d-lg-block sidebar collapse bg-white">
                <div className="position-sticky">
                <div className="list-group list-group-flush mx-3 mt-4">
                    <Link to="/" className={`list-group-item list-group-item-action py-2 ripple ${location.pathname=="/" ? 'active':''}`} aria-current="true">
                        <i className="fa-solid fa-house fa-fw me-3"></i><span>Home</span>
                    </Link>
                    <Link to="/my-profile" className={`list-group-item list-group-item-action py-2 ripple ${location.pathname=="/my-profile" ? 'active':''}`} aria-current="true">
                        <i className="fa-solid fa-user fa-fw me-3"></i><span>My Profile</span>
                    </Link>
                    <Link to="/message-chat" className={`list-group-item list-group-item-action py-2 ripple ${location.pathname=="/message-chat" ? 'active':''}`}>
                      <i className="fa-solid fa-message fa-fw me-3"></i><span>Chat with</span>
                    </Link>

                    <Link to="/payment" className={`list-group-item list-group-item-action py-2 ripple ${location.pathname=="/payment" ? 'active':''}`}><i
                        className="fas fa-lock fa-fw me-3"></i><span>Subscriptions</span></Link>
                    <a href="#" className={`list-group-item list-group-item-action py-2 ripple ${location.pathname=="/a" ? 'active':''}`}><i
                        className="fas fa-chart-line fa-fw me-3"></i><span>Analytics</span></a>
                    <a href="#" className="list-group-item list-group-item-action py-2 ripple">
                    <i className="fas fa-chart-pie fa-fw me-3"></i><span>SEO</span>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-2 ripple"><i
                        className="fas fa-chart-bar fa-fw me-3"></i><span>Orders</span></a>
                    <a href="#" className="list-group-item list-group-item-action py-2 ripple"><i
                        className="fas fa-globe fa-fw me-3"></i><span>International</span></a>
                    <a href="#" className="list-group-item list-group-item-action py-2 ripple"><i
                        className="fas fa-building fa-fw me-3"></i><span>Partners</span></a>
                    <a href="#" className="list-group-item list-group-item-action py-2 ripple"><i
                        className="fas fa-calendar fa-fw me-3"></i><span>Calendar</span></a>
                    <a href="#" className="list-group-item list-group-item-action py-2 ripple"><i
                        className="fas fa-users fa-fw me-3"></i><span>Users</span></a>
                    <a href="#" className="list-group-item list-group-item-action py-2 ripple"><i
                        className="fas fa-money-bill fa-fw me-3"></i><span>Sales</span></a>
                </div>
                </div>
            </nav>
            <main style={{marginTop: "58px"}} >
                <div className="container pt-4">
                    <Outlet />
                </div>
            </main>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default Layout
