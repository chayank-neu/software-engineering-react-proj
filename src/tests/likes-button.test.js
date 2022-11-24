import {createUser, deleteUser} from "../services/users-service";
import {createTuit, deleteTuitByUser} from "../services/tuits-service";
import {findAllTuitsLikedByUser, userTogglesTuitLikes} from "../services/likes-service";

describe('like button updates tuit stats', () => {

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
            await userTogglesTuitLikes(user._id, newTuit._id);
        }
        await Promise.all(newUsers.map(async (user) => {
            await deleteTuitByUser(user._id);
            await deleteUser(user._id);
        }))
    })

    test('like button updates tuit stats', async () => {
        // create new tuit by first user
        const user0 = newUsers[0];
        newTuit = await createTuit(user0._id, {
            tuit: `Test Tuit by ${user0.username}`
        });
        // all users like the new tuit
        for (const newUser of newUsers) {
            await userTogglesTuitLikes(newUser._id, newTuit._id);
        }

        // retrieve all the tuits liked by user 0
        const allLikedTuits = await findAllTuitsLikedByUser(user0._id);
        const filtered = allLikedTuits.filter(tuit => tuit._id === newTuit._id);
        // check filtered tuits to include our sent tuit
        expect(filtered.length).toEqual(1);
        const tuitStats = filtered[0].stats;

        // compare the tuit stats retrieved from api with the number of users who liked
        expect(tuitStats.likes).toEqual(newUsers.length);
    });
});