import React from "react";
import './tuits.css';
import Tuit from "./tuit";
import * as service from "../../services/likes-service";

function Tuits({tuits = [], deleteTuit, refreshTuits}) {

    const likeTuit = (tuit) =>
        service.userTogglesTuitLikes("me", tuit._id)
            .then(refreshTuits)
            .catch(e => alert(e));

    return (
    <div>
      <ul className="ttr-tuits list-group">
        {
          tuits.map && tuits.map(tuit => {
            return (
              <Tuit key={tuit._id}
                    deleteTuit={deleteTuit}
                    likeTuit={likeTuit}
                    tuit={tuit}/>
            );
          })
        }
      </ul>
    </div>
  );
}

export default Tuits;