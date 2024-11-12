"use client";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import Navbar from "@/components/navBar/NavBar";
import Sidebar from "@/components/sidebar/Sidebar";
import SearchUserModal from "@/components/searchUserModal/SearchUserModal";
import useDebounce from "@/hooks/useDebounce";
import { getUsers } from "@/reduxStore/slices/searchUserSlice";
import { AuthContext } from "@/components/authContext/AuthContext";

export default function HomeLayout({ children }) {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const [showDrawer, setShowDrawer] = useState(true);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state) => state?.auth?.user);
  const users = useSelector((state) => state?.search?.users);
  const router = useRouter();
  const dispatch = useDispatch();

  const debouncedSearchQuery = useDebounce(searchQuery);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login");
    }
  }, [loading, isLoggedIn]);

  const onShowSearchResults = () => setShowSearchResults(true);
  const onHideSearchResults = () => setShowSearchResults(false);

  useEffect(() => {
    debouncedSearchQuery
      ? dispatch(getUsers({ searchQuery: debouncedSearchQuery }))
      : onHideSearchResults();
  }, [debouncedSearchQuery]);

  const toggleDrawer = () => setShowDrawer(!showDrawer);

  const onSearch = (event) => {
    if (!!event?.target?.value && !showSearchResults) {
      setShowSearchResults(true);
    }
    setSearchQuery(event?.target?.value || "");
  };

  if (loading) {
    return null;
  }

  const profilePicturePath =
    user?.profilePictures?.length > 0
      ? user?.profilePictures[0]?.picture?.path
      : "";

  return (
    <div className="home-container" data-testid="home-component">
      <Navbar
        toggleDrawer={toggleDrawer}
        onSearch={onSearch}
        firstName={user?.firstName}
        profilePicture={profilePicturePath}
        onShowSearchResults={onShowSearchResults}
        userId={user?._id}
      />
      <div className="home-body-container">
        {showDrawer && <Sidebar showDrawer={showDrawer} userId={user?._id} />}
        <div
          className="home-proteced-routes"
          style={{
            flex: showDrawer ? "0 1 calc(100% - 140px)" : "0 1 100%",
          }}
        >
          {children}
        </div>
        {showSearchResults && (
          <SearchUserModal
            users={users}
            showSearchResults={showSearchResults}
            onHideSearchResults={onHideSearchResults}
          />
        )}
      </div>
    </div>
  );
}
