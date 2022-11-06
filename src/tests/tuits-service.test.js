import {createUser, deleteUsersByUsername, deleteUser} from "../services/users-service";
import {createTuit, deleteTuit, deleteTuitByUser, findAllTuits, findTuitById} from "../services/tuits-service";

describe('can create tuit with REST API', () => {
    let newTuit = null;

    // sample user for creating tuit
    const testUser = {
        username: 'harrypotter',
        password: 'theboywholived',
        email: 'harry.potter@hogwarts.com'
    };

    // sample tuit to create
    const testTuit = {
        tuit: 'My First Tuit',
        postedOn: '2022-10-30T00:00:00.000Z'
    };

    // setup test before running test
    beforeAll(async () => {
        // remove any/all users to make sure we create it in the test
        await deleteUsersByUsername(testUser.username);
    })

    // clean up after test runs
    afterAll(async () => {
        // remove any data we created
        await deleteUsersByUsername(testUser.username);
        await deleteTuit(newTuit._id);
    })

    test('can create new tuit', async () => {
        // create new user with test user parameter
        const newUser = await createUser(testUser);
        // create new tuit using created user's identifier
        newTuit = await createTuit(newUser._id, testTuit);

        // verify inserted tuit's properties match test tuit parameter
        expect(newTuit.tuit).toEqual(testTuit.tuit);
        expect(newTuit.postedOn).toEqual(testTuit.postedOn);
        expect(newTuit.postedBy).toEqual(newUser._id);
    });
});

describe('can delete tuit wtih REST API', () => {
    // sample user for creating tuit
    const testUser = {
        username: 'ronweasley',
        password: 'spiders',
        email: 'ron.weasley@hogwarts.com'
    };

    // sample tuit to be created
    const testTuit = {
        tuit: 'I hate Spiders.',
        postedOn: '2022-10-30T00:00:00.000Z'
    };

    // setup test before running test
    beforeAll(async () => {
        // remove any/all users to make sure we create it in the test
        await deleteUsersByUsername(testUser.username);
    })

    // clean up after test runs
    afterAll(async () => {
        // remove any data we created
        await deleteUsersByUsername(testUser.username);
    })

    test('can delete tuit', async () => {
        // create new user using test user parameter
        const newUser = await createUser(testUser);
        // create new tuit using created user's identifier
        const newTuit = await createTuit(newUser._id, testTuit);

        // delete newly created tuit and store status result
        const status = await deleteTuit(newTuit._id);

        // verify we deleted one tuit using the recorded status result
        expect(status.deletedCount).toEqual(1);
    });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
    let newTuit = null;

    // sample user for creating tuit
    const testUser = {
        username: 'hermione',
        password: 'wingardiumleviosa',
        email: 'hermione.granger@hogwarts.com'
    };

    // sample tuit to be created
    const testTuit = {
        tuit: 'Wingardium Leviosa',
        postedOn: '2022-11-01T00:00:00.000Z'
    };

    // setup test before running test
    beforeAll(async () => {
        // remove any/all users to make sure we create it in the test
        await deleteUsersByUsername(testUser.username);
    })

    // clean up after test runs
    afterAll(async () => {
        // remove any data we created
        await deleteUsersByUsername(testUser.username);
        await deleteTuit(newTuit._id);
    })

    test('can retrieve tuit by id', async () => {
        // create new user with the test user parameter
        const newUser = await createUser(testUser);
        // create new tuit using created user's identifier
        newTuit = await createTuit(newUser._id, testTuit);

        // retrieve tuit using created tuit's identifier
        const retrievedTuit = await findTuitById(newTuit._id);

        // verify retrieved tuit's properties match test parameter
        expect(retrievedTuit.tuit).toEqual(testTuit.tuit);
        expect(retrievedTuit.postedOn).toEqual(testTuit.postedOn);
        expect(retrievedTuit.postedBy._id).toEqual(newUser._id);
    });
});

describe('can retrieve all tuits with REST API', () => {

    // sample users we'll insert to then retrieve
    const usernames = [
        "harry", "ron", "hermione"
    ];

    let newUsers = [];

    // setup data before test
    beforeAll(async () =>
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
    );

    // clean up after test runs
    afterAll(async () => {
        // remove any data we created
        await Promise.all(newUsers.map(async (user) => {
            await deleteTuitByUser(user._id);
            await deleteUser(user._id);
        }))
    })

    test('can retrieve all tuits', async () => {
        // create new tuits with test data
        const newTuits = await Promise.all(newUsers.map(async (user) =>
            await createTuit(user._id, {
                tuit: `Test Tuit by ${user.username}`
            })
        ));

        // retrieve all the tuits
        const allTuits = await findAllTuits();

        // there should be a minimum number of tuits
        expect(allTuits.length).toBeGreaterThanOrEqual(newTuits.length);

        // let's find each tuit we inserted
        const insertedTuits = allTuits.filter(
            tuit => usernames.indexOf(tuit.postedBy.username) >= 0);

        // compare the actual tuits retrieved from api with the ones we sent
        insertedTuits.forEach(insertedtuit => {
            const newTuit = newTuits.find(newTuit => newTuit._id === insertedtuit._id);
            expect(insertedtuit.tuit).toEqual(newTuit.tuit);
            expect(insertedtuit.postedOn).toEqual(newTuit.postedOn);
            expect(insertedtuit.postedBy._id).toEqual(newTuit.postedBy);
        });
    });
});