function setTextToday(today) {
	let date_text =
		String(today.getDate()) +
		". " +
		String(today.getMonth() + 1) +
		". " +
		String(today.getFullYear());

	document.getElementById("date").innerText = date_text;
};

function resetLocalStorage() {
	const checked = Array(16).fill(false);
	localStorage.removeItem("checked"); //removing old checked array
	localStorage.setItem("checked", JSON.stringify(checked)); //adding new checked array
};

function getCookies(today) {
	// random UUID seed stored in a cookie, that expires on midnight
	let device_unique_seed = "";

	// get the UUID from cookie
	const parts = document.cookie.split("; ");

	//find unique seed in cookie
	device_unique_seed = parts
		.find((row) => row.startsWith("bingo_device_unique_seed="))
		?.split("=")[1];

	// if no cookie is found (none created / expired), create one
	if (!device_unique_seed) {
		resetLocalStorage();

		device_unique_seed = crypto.randomUUID();
		let midnight = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
			23,
			59,
			59
		);
		let expires = "; expires=" + midnight.toGMTString();
		document.cookie =
			"bingo_device_unique_seed=" +
			device_unique_seed +
			expires +
			"; path=/";
	}
	//parse array from localStorage
	const checked = JSON.parse(localStorage.getItem("checked"));
	
	return [device_unique_seed, checked];
};

function shuffleArray(device_unique_seed) {
	//shuffle
	let random_gen = new Math.seedrandom(device_unique_seed);
	const dict = config.dict;

	for (i = 0; i < dict.length; ++i) {
		var swap_index = Math.floor(random_gen.quick() * dict.length);
		[dict[swap_index], dict[i]] = [dict[i], dict[swap_index]];
	}
};

function applyCheckedStyle(cell, check) {
	if (check && !cell.classList.contains("checked")) {
		cell.classList.add("checked");
	} else if (!check && cell.classList.contains("checked")) {
		cell.classList.remove("checked");
	}
}

function onClickCell(cell, index, checked) {
	cell.onclick = function () {
		checked[index] = !checked[index];
		applyCheckedStyle(this, checked[index]);
		localStorage.setItem("checked", JSON.stringify(checked)); //set new value for squares
		checkWin(index, checked);
	};
};

function mainLoop() {

	// get board elemtn
	let board = document.getElementById("board");

	// set date
	let today = new Date();
	setTextToday(today);


	// check valid size config
	if (config.size**2 > config.dict.length) {
		console.error("Grid size too large, not enought dictionary items.")
		board.innerHTML = "<b>Developer of this app is stupid, check logs.</b>";
		return;
	}

	// generate or get ID for device
	let [device_unique_seed, checked] = getCookies(today);

	// shuffle dict array for uniq bingo
	shuffleArray(device_unique_seed);

	// generate squares to be filled
	for (let i = 0; i < config.size**2; i++)
		board.insertAdjacentHTML("beforeend", '<div class="square"><div></div></div>');

	// set board size
	board.style.setProperty("grid-template-rows", "repeat("+config.size+", 1fr)");
	board.style.setProperty("grid-template-columns", "repeat("+config.size+", 1fr)");

	// get squares
	let squares = document.getElementsByClassName("square");
	squares = [...squares];

	// fill text and attach onClick
	squares.forEach((cell) => {
		let index = squares.indexOf(cell);
		cell.children[0].innerText = config.dict[index];
		applyCheckedStyle(cell, checked[index]);
		onClickCell(cell, index, checked);
	});
};

mainLoop();
