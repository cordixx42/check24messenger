import { Routes, Route, Link, NoMatch } from "react-router-dom";

const Home = () => <div>this is home</div>;
const User = () => <div>this is user</div>;
const Profile = () => <div>this is profile</div>;
const Account = () => <div>this is account</div>;

export const NavBar = () => {
  return (
    <>
      <h1>React Router</h1>

      <nav>
        <Link to="/home">Home</Link>
        <Link to="/user">User</Link>
      </nav>

      <Routes>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="user" element={<User />}>
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="account" element={<Account />} />
          {/* <Route path="*" element={<NoMatch />} /> */}
        </Route>
        {/* <Route path="*" element={<NoMatch />} /> */}
      </Routes>
    </>
  );
};
