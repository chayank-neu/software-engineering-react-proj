import Tuits from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";

jest.mock('axios');

const MOCKED_USERS = [
  "alice", "bob", "charlie"
];

const MOCKED_TUITS = [
  "alice's tuit", "bob's tuit", "charlie's tuit"
];

test('tuit list renders static tuit array', () => {
    // create test tuit objects using mock user data
    const testTuits = MOCKED_TUITS.map((tuit, index) => ({
            tuit: tuit,
            postedBy: { username: MOCKED_USERS[index] },
            _id: index
        })
    );
    render(
        <HashRouter>
            <Tuits tuits={testTuits}/>
        </HashRouter>);
    // find tuit element using specific text from mock data
    const tuitElement = screen.getByText(/alice's tuit/i);
    expect(tuitElement).toBeInTheDocument();
});

test('tuit list renders mocked', async () => {
    // create test tuit objects using mock user data
    const testTuits = MOCKED_TUITS.map((tuit, index) => ({
            tuit: tuit,
            postedBy: { username: MOCKED_USERS[index] },
            _id: index
        })
    );
    // mock api implementation with test tuit data
    axios.get.mockImplementation(() =>
        Promise.resolve({ data: {tuits: testTuits} }));

    const response = await findAllTuits();
    const tuits = response.tuits;

    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);
    // find tuit element using specific text from mock data
    const tuitElement = screen.getByText(/alice's tuit/i);
    expect(tuitElement).toBeInTheDocument();
});