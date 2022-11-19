import MyTuits from "./my-tuits";
import * as service from "../../services/auth-service"
import {Routes, Route, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

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

          <Routes>
              <Route path="/mytuits"
                     element={<MyTuits/>}/>
          </Routes>

      </div>
  );
};
export default Profile;