import {createUser, deleteUser} from "../services/users-service";
import {createTuit, deleteTuitByUser} from "../services/tuits-service";
import {findAllTuitsDislikedByUser, userTogglesTuitDislikes} from "../services/dislikes-service";

describe('dislike button updates tuit stats', () => {

    // sample users we'll insert to then retrieve
    const usernames = [
        "harry", "ron", "hermione"
    ];

    let newUsers = [];
    let newTuit = null;

    // setup data before test
    beforeAll(async () => {
        // insert several known users
        newUsers = await Promise.all(
            usernames.map(async (username) => {
                return await createUser({
                    username,
                    password: `${username}123`,
                    email: `${username}@hogwarts.com`
                })
            })
        )
    });

    // clean up after test runs
    afterAll(async () => {
        // remove any data we created
        for (const user of newUsers) {
            await userTogglesTuitDislikes(user._id, newTuit._id);
        }
        await Promise.all(newUsers.map(async (user) => {
            await deleteTuitByUser(user._id);
            await deleteUser(user._id);
        }))
    })

    test('dislike button updates tuit stats', async () => {
        // create new tuit by first user
        const user0 = newUsers[0];
        newTuit = await createTuit(user0._id, {
            tuit: `Test Tuit by ${user0.username}`
        });
        // all users dislike the new tuit
        for (const newUser of newUsers) {
            await userTogglesTuitDislikes(newUser._id, newTuit._id);
        }

        // retrieve all the tuits disliked by user 0
        const allDislikedTuits = await findAllTuitsDislikedByUser(user0._id);
        const filtered = allDislikedTuits.filter(tuit => tuit._id === newTuit._id);
        // check filtered tuits to include our sent tuit
        expect(filtered.length).toEqual(1);
        const tuitStats = filtered[0].stats;

        // compare the tuit stats retrieved from api with the number of users who disliked
        expect(tuitStats.dislikes).toEqual(newUsers.length);
    });
});