import SnackBar from "./SnackBar";
const snackBar = new SnackBar();

if (typeof jQuery === "undefined") throw snackBar.show("ERROR! jQuery is not working!", 10);

const $ = jQuery;

class MySeries {
	constructor() {
		this.events();
	}

	events() {
		// create
		$(".submit-note").on("click", this.create.bind(this));

		// edit
		$(".series-main").on("click", ".edit-note", this.edit.bind(this));
		$(".series-main").on("click", ".delete-note", this.delete.bind(this));
		$(".series-main").on("click", ".update-note", this.update.bind(this));
		$(".series-main").on("click", ".copy-note", this.copy.bind(this));

		// season & episode buttons
		$(".series-main").on("click", ".season-plus", this.seasonPlus.bind(this));
		$(".series-main").on("click", ".season-minus", this.seasonMinus.bind(this));
		$(".series-main").on("click", ".episode-plus", this.episodePlus.bind(this));
		$(".series-main").on("click", ".episode-minus", this.episodeMinus.bind(this));

		// search series
		$("#search-series").on("input", this.searchSeries);
	}

	/******  DELETE SERIES  ******/
	delete(e) {
		const thisNote = $(e.target).parents("li");

		$.ajax({
			beforeSend: (xhr) => {
				xhr.setRequestHeader("X-WP-Nonce", trackerData.nonce);
			},
			url: `${trackerData.root_url}/wp-json/wp/v2/series/${thisNote.data("id")}`,
			type: "DELETE",
			success: (res) => {
				thisNote.slideUp();
				thisNote.remove();

				$('#tracked_series_count').text(res.tracked_series);
				
				snackBar.show("Succesfully deleted.");
				console.log(res);
			},
			error: (res) => {
				snackBar.show("Error, can't delete this!");
				console.log(res);
			},
		});
	}

	/******  UPDATE SERIES  ******/
	update(e) {
		const thisNote = $(e.target).parents("li");

		if (!thisNote.find(".note-title-field").val().length) return snackBar.show("Can't save! Series title cannot be blank!");

		const ourUpdatedPost = {
			title: thisNote.find(".note-title-field").val(),
			content: thisNote.find(".note-body-field").val(),
			series_number: thisNote.find("#SEASON_NO").text(),
			episode_number: thisNote.find("#EPISODE_NO").text(),
		};

		$.ajax({
			beforeSend: (xhr) => {
				xhr.setRequestHeader("X-WP-Nonce", trackerData.nonce);
			},
			url: `${trackerData.root_url}/wp-json/wp/v2/series/${thisNote.data("id")}`,
			type: "POST",
			data: ourUpdatedPost,
			success: (res) => {
				this.makeReadOnly(thisNote);
				snackBar.show("Succesfully updated.");
				console.log(res);
			},
			error: (res) => {
				snackBar.show("Error, can't update this!");
				console.log(res);
			},
		});
	}

	/******  CREATE SERIES  ******/
	create(e) {
		const thisNote = $(e.target).parents("div");

		if (!thisNote.find(".new-note-title").val().length) return snackBar.show("Can't create! Series title cannot be blank!");

		const ourNewNote = {
			title: thisNote.find(".new-note-title").val(),
			content: thisNote.find(".new-note-body").val(),
			status: "publish",
			series_number: thisNote.find("#SEASON_NO").text(),
			episode_number: thisNote.find("#EPISODE_NO").text(),
		};

		$.ajax({
			beforeSend: (xhr) => {
				xhr.setRequestHeader("X-WP-Nonce", trackerData.nonce);
			},
			url: `${trackerData.root_url}/wp-json/wp/v2/series/`,
			type: "POST",
			data: ourNewNote,
			success: (res) => {
				$(".new-note-title, .new-note-body").val("");

				$(`
				<li data-id="${res.id}">
					<sup class="se">
						<i class="fa fa-minus season-minus se-control" aria-hidden="true"></i>
                        S<span id="SEASON_NO">${res.series_number}</span>
                        <i class="fa fa-plus season-plus se-control" aria-hidden="true"></i>

                        <i class="fa fa-minus episode-minus se-control" aria-hidden="true"></i>
                        E<span id="EPISODE_NO">${res.episode_number}</span>
                        <i class="fa fa-plus episode-plus se-control" aria-hidden="true"></i>
                    </sup>

                    <input readonly class="note-title-field" value="${res.title.raw}">

                    <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
                    <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
                    <span class="copy-note"><i class="fa fa-copy" aria-hidden="true"></i> Copy</span>

                    <textarea readonly class="note-body-field">${res.content.raw}</textarea>

                    <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"> Save</i></span>
                </li>
				`)
					.prependTo("#my-notes")
					.hide()
					.slideDown();

				$('#tracked_series_count').text(res.tracked_series);

				snackBar.show("Succesfully created.");
				console.log(res);
			},
			error: (res) => {
				let errorMessage = `Error! ${res.responseText == "You have reached your series limit!" ? res.responseText : "Please contact administrator!"}`;

				snackBar.show(errorMessage);
				console.log(res);
			},
		});
	}

	/******  SEARCH SERIES  ******/
	search(e) {
		const searchTerm = $(e.target).val().toLowerCase();

		let showAll = false;

		if (!searchTerm.length) showAll = true;

		$("#my-notes").children("li").each(function() {
			if (showAll) return $(this).slideDown();

			let title = $(this).children(".note-title-field").val().toLowerCase();

			if (!title.includes(searchTerm)) $(this).slideUp();
			else $(this).slideDown();
		});
	}

	/******  EDIT SERIES  ******/
	edit(e) {
		const thisNote = $(e.target).parents("li");

		if (thisNote.data("state") == "editable") this.makeReadOnly(thisNote);
		else this.makeEditable(thisNote);
	}

	makeEditable(thisNote) {
		thisNote.find(".edit-note").html('<i class="fa fa-times" aria-hidden="true"></i> Cancel');
		thisNote.find(".note-title-field, .note-body-field").removeAttr("readonly").addClass("note-active-field");
		thisNote.find(".update-note").addClass("update-note--visible");

		thisNote.data("state", "editable");

		thisNote
			.children($("se"))
			.children($("se-control"))
			.each(function () {
				if ($(this).hasClass("se-control--active")) return;

				$(this).addClass("se-control--active");
			});
	}

	makeReadOnly(thisNote) {
		thisNote.find(".edit-note").html('<i class="fa fa-pencil" aria-hidden="true"></i> Edit');
		thisNote.find(".note-title-field, .note-body-field").attr("readonly", "readonly").removeClass("note-active-field");
		thisNote.find(".update-note").removeClass("update-note--visible");

		thisNote.data("state", "cancel");

		thisNote
			.children($("se"))
			.children($("se-control"))
			.each(function () {
				if ($(this).hasClass("se-control--active")) $(this).removeClass("se-control--active");
			});
	}

	/******  COPY TO CLIPBOARD  ******/
	copy(e) {
		const thisNote = $(e.target).parents("li");

		const name = thisNote.find(".note-title-field").val().trim();
		const season = thisNote.find("#SEASON_NO").text();
		const episode = thisNote.find("#EPISODE_NO").text();

		const output = `${name} S${season}E${episode}`;

		this.textToClipboard(output);
		snackBar.show("Copied to clipboard.");
	}

	textToClipboard(text) {
		const dummy = document.createElement("textarea");

		document.body.appendChild(dummy);
		dummy.value = text;
		dummy.select();
		document.execCommand("copy");
		document.body.removeChild(dummy);
	}

	/******  EPISODES  ******/
	episodePlus(e) {
		const thisNote = $(e.target).parents(".se");
		const episodeNumberElement = $(thisNote).find("#EPISODE_NO");

		let episodeNumber = parseFloat(episodeNumberElement.text());
		episodeNumber++;
		episodeNumber = episodeNumber.toString().padStart(2, "0");
		$(episodeNumberElement).text(episodeNumber);
	}

	episodeMinus(e) {
		const thisNote = $(e.target).parents(".se");
		const episodeNumberElement = $(thisNote).find("#EPISODE_NO");

		let episodeNumber = parseFloat(episodeNumberElement.text());

		if (episodeNumber == 0) return snackBar.show("The lowest episode number reached!");

		episodeNumber--;
		episodeNumber = episodeNumber.toString().padStart(2, "0");
		$(episodeNumberElement).text(episodeNumber);
	}

	/******	 SEASONS  ******/
	seasonPlus(e) {
		const thisNote = $(e.target).parents(".se");
		const seasonNumberElement = $(thisNote).find("#SEASON_NO");

		let seasonNumber = parseFloat(seasonNumberElement.text());

		seasonNumber++;
		seasonNumber = seasonNumber.toString().padStart(2, "0");
		$(seasonNumberElement).text(seasonNumber);
	}

	seasonMinus(e) {
		const thisNote = $(e.target).parents(".se");
		const seasonNumberElement = $(thisNote).find("#SEASON_NO");

		let seasonNumber = parseFloat(seasonNumberElement.text());

		if (seasonNumber == 1) return snackBar.show("The lowest season number reached!");

		seasonNumber--;
		seasonNumber = seasonNumber.toString().padStart(2, "0");
		$(seasonNumberElement).text(seasonNumber);
	}
}

export default MySeries;
