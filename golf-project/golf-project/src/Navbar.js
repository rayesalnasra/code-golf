const Navbar = () => {
    return (
        <nav className="Navbar">
            <div className="navbar">
                <a href="#Home.html">CODE GOLF</a>
                <div className="search">
                    <form role="search" method="get" className="search-form" action="">
                        <input
                            type="search"
                            id="search-form"
                            className="search-field"
                            placeholder="Search"
                            name="s"
                        />
                        <button type="submit" className="search-submit">
                            <svg className="search">
                                <use xlinkHref="#search"></use>
                            </svg>
                        </button>
                    </form>
                    <div className="dropdown">
                        <button className="dropbtn">
                            Menu <i className="fa fa-caret-down"></i>
                        </button>
                        <div className="dropdown-content">
                            <a href="#Home.html">Home</a>
                            <a href="#Profile.html">Profile</a>
                            <a href="#Scoreboard.html">Scoreboard</a>
                            <a href="#History.html">History</a>
                            <a href="#Discussion.html">Discussion</a>
                            <a href="#Documentation.html">Documentation</a>
                            <a href="#Tutorial.html">Tutorial</a>
                            <a href="#Sign Out.html">Sign Out</a>
                        </div>
                    </div>
                </div>
            </div>

        </nav>
    );
}

export default Navbar;