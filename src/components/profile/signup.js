import {useState} from "react";
import * as service
    from "../../services/auth-service";
import {useNavigate} from "react-router-dom";

const Signup = () => {
    const [newUser, setNewUser] = useState({});
    const navigate = useNavigate();
    const signup = () =>
        service.signup(newUser)
            .then(() => navigate('/profile'))
            .catch(e => alert(e));
    return (
        <div>
            <h1>Signup</h1>
            <input onChange={(e) =>
                setNewUser({...newUser,
                    username: e.target.value})}
                placeholder="username"/>
            <input onChange={(e) =>
                setNewUser({...newUser,
                    password: e.target.value})}
                   placeholder="password"/>
            <input onChange={(e) =>
                setNewUser({...newUser,
                    email: e.target.value})}
                   placeholder="email"/>
            <button onClick={signup}>
                Signup</button>
        </div>
    );
}
export default Signup;