import { Link } from "react-router-dom";

function CustomerDashboard() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>SmartHub</h2>
          <p>Customer Console</p>
        </div>

        <nav className="sidebar-menu">
          <Link className="active" to="/customer/dashboard">
            Dashboard
          </Link>
          <Link to="/customer/services">Find Taskers</Link>
          <Link to="/customer/bookings">My Tasks</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Top Bar */}
        <header className="topbar">
          

          <div className="user-profile">
            
            
          </div>
        </header>

        {/* Page Heading */}
        <section className="dashboard-header">
          <h1>Dashboard Overview</h1>
          <p>Find and book trusted services easily.</p>
        </section>

        {/* Your Original Content */}
        <div className="dashboard-card">
          <h1>Smart Task Hub</h1>
          <h2>Customer Dashboard</h2>
          <p>Welcome! Find and book trusted services easily.</p>

          <div className="button-group">
            <Link to="/customer/services">
              <button>Find a Tasker</button>
            </Link>

            <Link to="/customer/bookings">
              <button className="dark-btn">View My Tasks</button>
            </Link>
            <Link to="/customer/about">
  <button>About SmartHub</button>
</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CustomerDashboard;