import {createUser, deleteUser} from "../services/users-service";
import {createTuit, deleteTuitByUser} from "../services/tuits-service";
import {findAllTuitsDislikedByUser, userTogglesTuitDislikes} from "../services/dislikes-service";

describe('user can retrieve my-dislikes with REST API', () => {

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
        // user dislikes all the tuits
        const userId = newUsers[0]._id;
        for (const tuit of newTuits) {
            await userTogglesTuitDislikes(userId, tuit._id);
        }
    });

    // clean up after test runs
    afterAll(async () => {
        // remove any data we created
        const userId = newUsers[0]._id;
        for (const tuit of newTuits) {
            await userTogglesTuitDislikes(userId, tuit._id);
        }
        await Promise.all(newUsers.map(async (user) => {
            await deleteTuitByUser(user._id);
            await deleteUser(user._id);
        }))
    })

    test('can retrieve my dislikes', async () => {
        const userId = newUsers[0]._id;

        // retrieve all the tuits disliked by user 0
        const dislikedTuits = await findAllTuitsDislikedByUser(userId);

        // there should be a minimum number of tuits
        expect(dislikedTuits.length).toEqual(newTuits.length);

        // compare the actual tuits retrieved from api with the ones we sent
        dislikedTuits.forEach(dislikedTuit => {
            const newTuit = newTuits.find(newTuit => newTuit._id === dislikedTuit._id);
            expect(dislikedTuit.tuit).toEqual(newTuit.tuit);
            expect(dislikedTuit.postedOn).toEqual(newTuit.postedOn);
            expect(dislikedTuit.postedBy._id).toEqual(newTuit.postedBy);
        });
    });
});