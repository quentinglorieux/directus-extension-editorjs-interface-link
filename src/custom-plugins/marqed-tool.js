import { Directus } from '@directus/sdk';
import './index.css';

export default class MarqedTool {
	static get isInline() {
		return true;
	}

	get state() {
		return this._state;
	}

	set state(state) {
		this._state = state;
		this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
	}

	constructor({ data, api }) {
		this.api = api;
		this.button = null;
		this._state = false;
		this.data = {
			url: window.location.pathname, // Get the current URL
		};

		this.tag = 'MARK';
		this.class = 'comment-marker';
		this.class = 'comment-paragraph';
	}

	render() {
		this.button = document.createElement('button');
		this.button.type = 'button';
		this.button.innerHTML = 'Commentaires';
		this.button.classList.add(this.api.styles.inlineToolButton);

		return this.button;
	}

	surround(range) {
		if (this.state) {
			this.unwrap(range);
			return;
		}

		this.wrap(range);
	}

	wrap(range) {
		const selectedText = range.extractContents();
		const words = selectedText.textContent.trim().split(/\s+/);
		const containsMultipleWords = words.length > 1;
    console.log(containsMultipleWords)

		const mark = document.createElement(this.tag);
    this.class = words.length > 1 ? 'comment-paragraph' : 'comment-marker'

		mark.classList.add(this.class);
		mark.setAttribute('data-linkedcomment', '');
		mark.appendChild(selectedText);
		range.insertNode(mark);

		this.api.selection.expandToTag(mark);
	}

	unwrap(range) {
		const mark = this.api.selection.findParentTag(this.tag, this.class);
		const text = range.extractContents();

		mark.remove();

		range.insertNode(text);
	}

	checkState() {
		const mark = this.api.selection.findParentTag(this.tag);

    // Double negation to convert to boolean
		this.state = !!mark;

		if (this.state) {
			this.showActions(mark);
		} else {
			this.hideActions();
		}
	}

	renderActions() {
		const parts = this.data.url.split('/');
		const id = parts.pop();
		console.log(id);

		this.dropdown = document.createElement('select');

		const directus = new Directus('http://localhost:8055');
		directus
			.items('sources')
			.readOne(id, {
				fields: ['comments.id', 'comments.title'],
			})
			.then((response) => {
				console.log(response.comments);

				var option = document.createElement('option');
				option.value = 'id';
				option.text = '---';
				this.dropdown.appendChild(option);
				for (var i = 0; i < response.comments.length; i++) {
					var option = document.createElement('option');
					option.value = response.comments[i].id;
					option.text = response.comments[i].title;
					this.dropdown.appendChild(option);
				}
			})
			.catch((error) => console.error(error));

		this.dropdown.hidden = true;

		return this.dropdown;
	}

	showActions(mark) {
		this.dropdown.onchange = () => {
			if (this.dropdown.selectedIndex) {
				const selectedIndex = this.dropdown.selectedIndex;
				const selectedOption = this.dropdown.options[selectedIndex];
				const selectedValue = selectedOption.value;
				mark.dataset.linkedcomment = selectedValue;
			}
		};
		this.dropdown.hidden = false;
	}

	hideActions() {
		this.dropdown.onchange = null;
		this.dropdown.hidden = true;
	}

	static get sanitize() {
		return {
			mark: {
				class: true,
				'data-linkedcomment': true,
			},
		};
	}
}
