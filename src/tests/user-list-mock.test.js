import {UserList} from "../components/profile/user-list";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllUsers} from "../services/users-service";
import axios from "axios";

jest.mock('axios');

const MOCKED_USERS = [
  {username: 'ellen_ripley', password: 'lv426', email: 'repley@weyland.com', _id: "123"},
  {username: 'sarah_conor', password: 'illbeback', email: 'sarah@bigjeff.com', _id: "234"},
]

test('user list renders static user array', () => {
  render(
    <HashRouter>
      <UserList users={MOCKED_USERS}/>
    </HashRouter>);
  // find element with specific text from mock user data
  const linkElement = screen.getByText(/ellen_ripley/i);
  expect(linkElement).toBeInTheDocument();
});

test('user list renders mocked', async () => {
  // mock api implementation with test user data
  axios.get.mockImplementation(() =>
    Promise.resolve({ data: {users: MOCKED_USERS} }));

  const response = await findAllUsers();
  const users = response.users;

  render(
    <HashRouter>
      <UserList users={users}/>
    </HashRouter>);

  // find element with specific text from mock user data
  const user = screen.getByText(/ellen_ripley/i);
  expect(user).toBeInTheDocument();
});
