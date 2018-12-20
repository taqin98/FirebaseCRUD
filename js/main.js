document.getElementById("form-edit").style.display = "none";
var config = {
    apiKey: "AIzaSyCK0t4BscgFGOqAqqNVQuwROpdYKmaZeVo",
    authDomain: "developerkejar.firebaseapp.com",
    databaseURL: "https://developerkejar.firebaseio.com",
    projectId: "developerkejar",
    storageBucket: "developerkejar.appspot.com",
    messagingSenderId: "759578895166"
  };
  firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
 window.user = user; // user is undefined if no user signed in
});


// Firebase Database Reference and the child
var dbRef = firebase.database().ref();
var usersRef = dbRef.child('users');

readUserData();


function readUserData() {
	// body...
	var userList = document.getElementById("user-list");

	usersRef.on("value", items => {
		// body...
		userList.innerHTML = "";

		items.forEach(data => {

			var key = data.key;
			var value = data.val();

			var li = document.createElement("li");

			var editIcon = document.createElement("button");
			editIcon.classList.add("edit-user");
			editIcon.innerHTML = "Edit ";
			editIcon.setAttribute("userid", key);
			editIcon.addEventListener("click", editButtonClicked);

			var deleteIcon = document.createElement("button");
			deleteIcon.classList.add("delete-user");
			deleteIcon.innerHTML = " Delete";
			deleteIcon.setAttribute("userid", key);
			deleteIcon.addEventListener("click", deleteButtonClicked);

			li.innerHTML = value.name + " ";
			li.append(editIcon);
			li.append(deleteIcon);

			li.setAttribute("user-key", key);
			li.addEventListener("click", userClicked);
			userList.append(li);





		});
	});
}

function userClicked(e) {
	// body...
	var userID = e.target.getAttribute("user-key");

	var usersRef = dbRef.child("users/" + userID);
	var userDetail = document.getElementById("user-detail");

	usersRef.on("value", items => {

		userDetail.innerHTML = "";

		items.forEach(data => {
			var li = document.createElement("li");
			var h3 = document.createElement("h3");
			h3.innerHTML = "Details Data";
			li.innerHTML = data.key + " - " + data.val();
			userDetail.append(li);
		});
	});

}


var btnAddUser = document.getElementById("btnAddUser");
btnAddUser.addEventListener("click", addButtonClicked);

function addButtonClicked() {
	// body...
	usersRef = dbRef.child('users');
	var addUserInput = document.getElementsByClassName("user-input");

	var newUser = {};
	for (var i = 0; i < addUserInput.length; i++) {

		var key = addUserInput[i].getAttribute('data-key');
		var value = addUserInput[i].value;
		newUser[key] = value;
	}
	usersRef.push(newUser);
		console.log(newUser);
}

function editButtonClicked(e) {
	// body...
	document.getElementById("form-input").style.display = "none";
	document.getElementById("form-edit").style.display = "block";

	document.querySelector(".edit-userid").value = e.target.getAttribute('userid');

	var usersRef = dbRef.child('users/' + e.target.getAttribute('userid'));

	var editUserInput = document.querySelectorAll(".user-edit");

	usersRef.on("value", data => {
		for (var i = 0; i < editUserInput.length; i++) {
			var key = editUserInput[i].getAttribute('data-key');
			editUserInput[i].value = data.val()[key];
		}
	});


	var saveBtn = document.getElementById('btnUpdate');
	saveBtn.addEventListener("click", updateData);
}

function updateData(e) {
	// body...
	var userID = document.querySelector(".edit-userid").value;
	var usersRef = dbRef.child('users/' + userID);

	var editUserObject = {};

	var editUserInput = document.querySelectorAll(".user-edit");

	editUserInput.forEach(items => {
		var key = items.getAttribute("data-key");
		var value = items.value;

		editUserObject[items.getAttribute("data-key")] = items.value;

	});

	usersRef.update(editUserObject);
	document.getElementById("form-edit").style.display = "none";
	document.getElementById("form-input").style.display = "block";

}

function deleteButtonClicked(e) {
	// body...
	e.stopPropagation();

	var userID = e.target.getAttribute('userid');

	var usersRef = dbRef.child("users/" + userID);

	usersRef.remove();
}
