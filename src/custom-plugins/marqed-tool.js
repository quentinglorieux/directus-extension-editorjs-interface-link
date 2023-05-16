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
		this.class = '';
		// 'comment-marker';
		// this.class = 'comment-paragraph';
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
		let mark = document.createElement(this.tag);

		const selectedText = range.extractContents();
		this.class = this.isMultipleWords(selectedText) ? 'comment-paragraph' : 'comment-marker';

		mark.classList.add(this.class);
		mark.setAttribute('data-linkedcomment', '');
		mark.appendChild(selectedText);
		range.insertNode(mark);
		
		this.api.selection.expandToTag(mark);
	}

	unwrap(x) {
		let termWrapper = this.api.selection.findParentTag(this.tag);
		this.api.tooltip.hide(termWrapper);
		this.api.selection.expandToTag(termWrapper);

		let sel = window.getSelection();
		let range2 = sel.getRangeAt(0);

		let unwrappedContent = range2.extractContents();
		termWrapper.parentNode.removeChild(termWrapper);

		range2.insertNode(unwrappedContent);

		sel.removeAllRanges();
		sel.addRange(range2);
	}

	checkState() {
		let mark = this.api.selection.findParentTag(this.tag);
		this.state = !!mark; // Double negation to convert to boolean

		if (this.state) {
			this.showActions(mark)
		} else {
			this.hideActions();
		}
	}

	renderActions() {
		const parts = this.data.url.split('/');
		const id = parts.pop();

		this.dropdown = document.createElement('select');

		const directus = new Directus('http://localhost:8055');
		directus
			.items('sources')
			.readOne(id, {
				fields: ['comments.id', 'comments.title'],
			})
			.then((response) => {
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
				mark.dataset.linkedcomment = selectedOption.value;
				if (selectedOption.text) {
					const content = selectedOption.text.slice(0, 20) + ' ...';
					this.api.tooltip.onHover(mark, content);
					}
			}
		};
		this.dropdown.hidden = false;
	}

	hideActions() {
		this.dropdown.onchange = null;
		this.dropdown.hidden = true;
	}

	isMultipleWords(selectedText) {
		const words = selectedText.textContent.trim().split(/\s+/);
		return words.length > 1;
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
