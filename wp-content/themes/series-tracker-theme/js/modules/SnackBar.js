class SnackBar {
	constructor() {
		this.snackElement = document.getElementById("snackbar");

		this.timeout = {
			main: null,
			startTime: null,
			timerStep: 3000,
		};
	}

	async show(text, duration = null) {
		if (this.timeout.main) {
			await this.sleep((await this.getRemainingTime() + 500));
			this.show(text);
		}

		this.snackElement.textContent = text;
		this.snackElement.className = "show";

		this.timeout.startTime = (new Date()).getTime();
		this.timeout.main = setTimeout(() => {
			this.snackElement.className = this.snackElement.className.replace("show", "");

			this.timeout.main = null;
			this.timeout.startTime = null;
		}, duration * 1000 || 3000);
	}

	getRemainingTime() {
		return new Promise((resolve, reject) => {
			if (!this.timeout.startTime) return reject("Can't get remaining time because its not set!");
			resolve(this.timeout.timerStep - (new Date().getTime() - this.timeout.startTime));
		});
	}

	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}

export default SnackBar;
