//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch((err) => console.log(err));

async function main() {
	const url = "mongodb://127.0.0.1:27017/blogDB";
	await mongoose.connect(url, { useNewUrlParser: true });

	const postSchema = new mongoose.Schema({
		title: String,
		content: String,
	});

	const Post = new mongoose.model("Post", postSchema);

	const homeStarter = new Post({
		title: "Home",
		content:
			"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.",
	});

	app.get("/", function (req, res) {
		Post.find()
			.then((posts) => {
				if (posts.length === 0) {
					Post.create(homeStarter)
						.then(() => console.log("Items added successfully"))
						.catch((err) => console.log(err));
					posts = homeStarter;
				}
				res.render("home", { posts: posts });
			})
			.catch((err) => console.log(err));
	});

	app.get("/about", function (req, res) {
		res.render("about");
	});

	app.get("/contact", function (req, res) {
		res.render("contact");
	});

	app.get("/compose", function (req, res) {
		res.render("compose");
	});

	app.post("/compose", function (req, res) {
		const post = new Post({
			title: req.body.postTitle,
			content: req.body.postBody,
		});

		post.save();
		res.redirect("/");
	});

	app.get("/posts/:postId", function (req, res) {
		const requestedPostId = req.params.postId;

		Post.findById({ _id: requestedPostId }).then((post) => {
			res.render("post", {
				title: post.title,
				content: post.content,
				id: requestedPostId,
			});
		});
	});

	app.post("/delete", function (req, res) {
		const deletedPostId = req.body.deletebutton.trim();
		Post.deleteOne({ _id: deletedPostId })
			.then(() => {
				console.log("Successfully deleted");
				res.redirect("/");
			})
			.catch((err) => console.log(err));
	});

	app.post("/update", function (req, res) {
		const updatedPostId = req.body.updatebutton.trim();
		Post.findByIdAndUpdate(updatedPostId, {
			title: req.body.updateTitle,
			content: req.body.updateBody,
		})
			.then(() => {
				console.log("updated successfully");
				res.redirect("/");
			})
			.catch((err) => console.log(err));
	});

	app.listen(3000, function () {
		console.log("Server started on port 3000");
	});
}
