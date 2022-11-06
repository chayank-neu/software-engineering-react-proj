import {UserList} from "../components/profile/user-list";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {createUser, deleteUsersByUsername, findAllUsers} from "../services/users-service";

// sample user to delete
const testUser = {
  username: 'harrypotter',
  password: 'theboywholived',
  email: 'harry.potter@hogwarts.com'
};

// setup the tests before verification
beforeAll(async () => {
  // insert the sample user we then try to remove
  await createUser(testUser);
});

// clean up after test runs
afterAll(async () => {
  // remove any data we created
  await deleteUsersByUsername(testUser.username);
});

test('user list renders async', async () => {
  // retrieve all users using api
  const users = await findAllUsers();
  render(
    <HashRouter>
      <UserList users={users}/>
    </HashRouter>);
  // find element with specific text from test user
  const linkElement = screen.getByText(/harrypotter/i);
  expect(linkElement).toBeInTheDocument();
});