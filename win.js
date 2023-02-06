// check for bingo for specifiv cell
const isConnectedRow = (index, checked) => {
	let y = Math.floor(index/config.size);

	for (let x = 0; x < config.size; x++)
		if (!checked[y*config.size + x]) return false;

	return true;
};

const isConnectedColumn = (index, checked) => {
	let x = index % config.size;

	for (let y = 0; y < config.size; y++)
		if (!checked[y*config.size + x]) return false;

	return true;
};

const isConnectedDiagonalMain = (index, checked) => {
	let x = index % config.size;
	let y = Math.floor(index/config.size);

	if (x != y) return false;

	for (let i = 0; i < config.size; i++)
		if (!checked[i*config.size + i]) return false;

	return true;
};

const isConnectedDiagonalAnti = (index, checked) => {
	let x = index % config.size;
	let y = Math.floor(index/config.size);

	if (config.size-1-x != y) return false;

	for (let i = 0; i < config.size; i++)
		if (!checked[i*config.size + config.size-1-i]) return false;

	return true;
};

const isConnected = (index, checked) => {
	return isConnectedRow(index, checked) || isConnectedColumn(index, checked)
		|| isConnectedDiagonalMain(index, checked) || isConnectedDiagonalAnti(index, checked);
}

const checkWin = (index, checked) => {
	if (isConnected(index, checked))
		win();
}

const confetti = () => {
	var confettiSettings = {
		target: "confetti-canvas",
		max: "200",
		rotate: true,
		respawn: true,
	};
	var confetti = new ConfettiGenerator(confettiSettings);
	confetti.render();
	
	//stop after 10s
	setTimeout(() => {
		confetti.clear();
	}, 5000);
};

const win = () => {
	confetti();
	alert("Bingo!");
};
