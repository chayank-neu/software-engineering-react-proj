import MyTuits from "./my-tuits";
import * as service from "../../services/auth-service"
import {Link, Routes, Route, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import MyLikes from "./my-likes";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  useEffect(() => {
    async function fetchProfile() {
        try {
            const user = await service.profile();
            setProfile(user);
        } catch (e) {
            navigate('/login');
        }
    }
    fetchProfile();
  }, [navigate]);
  const logout = () => {
    service.logout()
        .then(() => navigate('/login'));
  }
  return(
      <div>
          <h4>{profile.username}</h4>
          <h6>@{profile.username}</h6>
          <button onClick={logout}>
              Logout</button>
          <ul className="nav nav-pills nav-fill">
              <li className="nav-item">
                  <Link to="/profile/mytuits">
                      Tuits</Link>
              </li>
              <li className="nav-item">
                  <Link to="/profile/mylikes">
                      Likes</Link>
              </li>
          </ul>

        <Routes>
          <Route path="/mytuits"
                 element={<MyTuits/>}/>
          <Route path="/mylikes"
                 element={<MyLikes/>}/>
        </Routes>

      </div>
  );
};
export default Profile;