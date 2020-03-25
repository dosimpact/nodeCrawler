const ejs = require("ejs");

const people = ["aweg", "neil", "ales"];

let html = ejs.render('<html><%= people.join(", "); %></html>', {
  people: people
});

console.log(html);

function loadTemplate() {
  var contents = fs.readFileSync("templates/test.js.ejs", "utf-8");
  var locals = Object.create(null);

  function render() {
    return ejs.render(contents, locals, {
      escape: util.inspect
    });
  }

  return {
    locals: locals,
    render: render
  };
}
