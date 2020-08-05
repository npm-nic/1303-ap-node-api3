const express = require("express");
const userDb = require("./userDb");
const postDb = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, async (req, res) => {
  try {
    const addedUser = await userDb.insert(req.body);
    addedUser
      ? res.status(201).json({ new_user: addedUser })
      : res.status(500).json({ message: "insert() was unable to add user" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res) => {
  try {
    const newPost = { user_id: req.params.id, ...req.body };
    const addedPost = await postDb.insert(newPost);
    addedPost
      ? res.status(201).json(addedPost)
      : res.status(500).json({
          error: "postDb.insert() returned nothing --> unable to add post",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [1]
router.get("/", async (req, res) => {
  try {
    const usersFound = await userDb.get();
    usersFound
      ? res.status(200).json(usersFound)
      : res
          .status(400)
          .json({ error: "userDb.get() unable to find any users ..." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [2]
router.get("/:id", validateUserId, async (req, res) => {
  const req_id = req.params.id;
  try {
    const userFound = await userDb.getById(req_id);
    userFound
      ? res.status(200).json(userFound)
      : res.status(400).json({
          message: `getById() unable to find the user w/id: ${req_id}`,
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [3]
router.get("/:id/posts", validateUserId, async (req, res) => {
  const req_id = req.params.id;
  try {
    const userPostsFound = await userDb.getUserPosts(req_id);
    userPostsFound
      ? res.status(200).json(userPostsFound)
      : res.status(400).json({
          message: `getUserPosts() unable to find posts by the user w/id: ${req_id}`,
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  const req_id = req.params.id;
  try {
    const deletedUser = await userDb.remove(req_id);
    deletedUser
      ? res.status(200).json({ deleted: deletedUser })
      : res.status(400).json({
          message: `userDb.remove() unexpected response -- unable to delete user id:${req_id} `,
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", validateUserId, validateUser, async (req, res) => {
  try {
    const updated = await userDb.update(req.params.id, req.body);
    updated
      ? res.status(200).json({ updated: updated })
      : res.status(400).json({
          message: "userDb.update() unable to update or return updated user",
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const userFound = await userDb.getById(req.params.id);
    userFound
      ? next()
      : res
          .status(400)
          .json({ message: "invalid user id --> from validateUserId" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
function validateUser(req, res, next) {
  req.body.name
    ? next()
    : res.status(400).json({ message: "missing name on request body" });
}
function validatePost(req, res, next) {
  req.body.text
    ? next()
    : res.status(400).json({ message: "missing required text field" });
}

module.exports = router;

// [1] GET api/users
// try to find users --> await userDb.get()
// --> users? ... send them all back
// --> no users? ... let client know (no users found)
// catch any errors thrown along the way

// [2] GET api/users/:id
// try to find user by id --> await userDb.getById(<id>)
// --> found? ... send that user back
// --> no user at ID? ... 404 user at :id not found
// catch any errors along the way

// [3] GET api/users/:id/posts
// try to find posts by user :id --> await userDb.getUserPosts(<id>)
// --> found? ...send it all back
// --> not found? ... 400 unable to find posts by user <id>
