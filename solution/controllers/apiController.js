function index(req, res) {
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/sf-wdi-labs/tunely",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
}

module.exports.index = index;
