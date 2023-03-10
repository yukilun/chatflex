import React, { useContext, useEffect, useState } from 'react';
import './Navbar.scss';
import NavHeader from './nav-components/NavHeader';
import NavProfile from './nav-components/NavProfile';
import NavSearch from './nav-components/NavSearch';
import NavResult from './nav-components/NavResult';
import { UserContext } from '../context/UserContext';
import { ImSpinner } from 'react-icons/im';

export default function Navbar({ isOpenNavbar, setOpenNavbar }) {

    const { currentUser: user, users } = useContext(UserContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);

    useEffect(() => {
        if (!searchQuery || !users) {
            setFilteredUsers(users);
        }
        else {
            setFilteredUsers(users.filter((user) => user.displayName?.match(new RegExp('^' + searchQuery, "i")) || user.email?.match(new RegExp('^' + searchQuery + '$', 'i'))));
        }
    }, [users, searchQuery]);

    if (Object.keys(user).length === 0 || users.length === 0) {
        return (
            <div className={(isOpenNavbar ? 'navbar navbar--open' : 'navbar')}>
                <NavHeader setOpenNavbar={setOpenNavbar} />
                <div className='nav-loading'>
                    <ImSpinner />
                </div>
            </div>
        )
    }

    return (
        <div className={(isOpenNavbar ? 'navbar navbar--open' : 'navbar')}>
            <NavHeader setOpenNavbar={setOpenNavbar} />
            <NavProfile />
            <NavSearch query={searchQuery} setQuery={setSearchQuery} />
            <NavResult query={searchQuery} users={!searchQuery ? users : filteredUsers} setOpenNavbar={setOpenNavbar} />
        </div>
    )
}
