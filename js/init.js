(function () {

  // Inject dummy users if there are none in localStorage
  if (!localStorage.users) {
    const users = [
      {
        username: "user1",
        password: "pass1",
      },
      {
        username: "user2",
        password: "pass2",
      },
    ];
    console.log("inject");
    localStorage.setItem("users", JSON.stringify(users));
  }
})();

