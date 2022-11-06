import Tuits from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {createTuit, deleteTuitByUser, findAllTuits} from "../services/tuits-service";
import {createUser, deleteUsersByUsername} from "../services/users-service";

// sample user for testing
const testUser = {
    username: 'tonystark',
    password: 'stark3000',
    email: 'tony@starkindustries.com'
};

// sample tuit to create
const testTuit = {
    tuit: 'I am Iron Man.',
    postedOn: '2022-10-30T00:00:00.000Z'
};
let newUser = null;

// setup the tests before running
beforeAll(async () => {
    // insert the sample user to use for creating tuit
    newUser = await createUser(testUser);
    // create tuit for testing
    await createTuit(newUser._id, testTuit);
});

// clean up after test runs
afterAll(async () => {
    // remove any data we created
    await deleteTuitByUser(newUser._id)
    await deleteUsersByUsername(testUser.username);
});

test('tuit list renders async', async () => {
    // retrieve all tuits using api
    const tuits = await findAllTuits();
    render(
        <HashRouter>
            <Tuits tuits={tuits}/>
        </HashRouter>);
    // find element with specific text from test tuit
    const tuitElement = screen.getByText(/Iron Man/i);
    expect(tuitElement).toBeInTheDocument();
});
