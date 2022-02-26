import { User, FullUser, UserStore } from "../../models/user";

const us = new UserStore();

describe("User Model", () => {
  const user: User = {
    firstname: "Hans",
    lastname: "Meier",
    user_password: "password123",
  };

  async function createUser(user: User) {
    return us.create(user);
  }

  async function deleteUser(id: number) {
    return us.delete(id);
  }

  it("should have an index method", () => {
    expect(us.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(us.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(us.create).toBeDefined();
  });

  it("should have a remove method", () => {
    expect(us.delete).toBeDefined();
  });

  it("create method should create a user", async () => {
    const createdUser: FullUser = await createUser(user);
    if (createdUser) {
      const { firstname, lastname } = createdUser;

      expect(firstname).toBe(user.firstname);
      expect(lastname).toBe(user.lastname);
    }

    await deleteUser(createdUser.id);
  });

  it("index method should return a list of users", async () => {
    const createdUser: FullUser = await createUser(user);
    const userList = await us.index();

    expect(userList).toEqual([createdUser]);

    await deleteUser(createdUser.id);
  });

  it("show method should return the correct users", async () => {
    const createdUser: FullUser = await createUser(user);
    const userFromDb = await us.show(createdUser.id);

    expect(userFromDb).toEqual(createdUser);

    await deleteUser(createdUser.id);
  });

  it("remove method should remove the user", async () => {
    const createdUser: FullUser = await createUser(user);

    await deleteUser(createdUser.id);

    const userList = await us.index();

    expect(userList).toEqual([]);
  });

  it("authenticates the user with a user_password", async () => {
    const createdUser: FullUser = await createUser(user);

    const userFromDb = await us.authenticateUser(
      user.firstname,
      user.lastname,
      user.user_password
    );

    if (userFromDb) {
      const { firstname, lastname } = userFromDb;

      expect(firstname).toBe(user.firstname);
      expect(lastname).toBe(user.lastname);
    }

    await deleteUser(createdUser.id);
  });
});
