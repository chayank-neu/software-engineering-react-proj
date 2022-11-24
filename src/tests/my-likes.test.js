import {createUser, deleteUser} from "../services/users-service";
import {createTuit, deleteTuitByUser} from "../services/tuits-service";
import {findAllTuitsLikedByUser, userTogglesTuitLikes} from "../services/likes-service";

describe('user can retrieve my-likes with REST API', () => {

    // sample users we'll insert to then retrieve
    const usernames = [
        "harry", "ron", "hermione"
    ];

    let newUsers = [];
    let newTuits = [];

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
        // create new tuits with test data
        newTuits = await Promise.all(newUsers.map(async (user) =>
            await createTuit(user._id, {
                tuit: `Test Tuit by ${user.username}`
            })
        ));
        // user likes all the tuits
        const userId = newUsers[0]._id;
        for (const tuit of newTuits) {
            await userTogglesTuitLikes(userId, tuit._id);
        }
    });

    // clean up after test runs
    afterAll(async () => {
        // remove any data we created
        const userId = newUsers[0]._id;
        for (const tuit of newTuits) {
            await userTogglesTuitLikes(userId, tuit._id);
        }
        await Promise.all(newUsers.map(async (user) => {
            await deleteTuitByUser(user._id);
            await deleteUser(user._id);
        }))
    })

    test('can retrieve my likes', async () => {
        const userId = newUsers[0]._id;

        // retrieve all the tuits liked by user 0
        const likedTuits = await findAllTuitsLikedByUser(userId);

        // there should be a minimum number of tuits
        expect(likedTuits.length).toEqual(newTuits.length);

        // compare the actual tuits retrieved from api with the ones we sent
        likedTuits.forEach(likedTuit => {
            const newTuit = newTuits.find(newTuit => newTuit._id === likedTuit._id);
            expect(likedTuit.tuit).toEqual(newTuit.tuit);
            expect(likedTuit.postedOn).toEqual(newTuit.postedOn);
            expect(likedTuit.postedBy._id).toEqual(newTuit.postedBy);
        });
    });
});