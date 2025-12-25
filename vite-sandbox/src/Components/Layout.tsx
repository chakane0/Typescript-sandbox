import {Link, Outlet} from 'react-router';

export default function Layout() {
    return (
        <main>
            <nav>
                <Link to='/'>Main</Link>
                <span> | </span>
                <Link to='/one'>One</Link>
                <span> | </span>
                <Link to='/two'>Two</Link>
            </nav>
            <Outlet />
        </main>
    )
}