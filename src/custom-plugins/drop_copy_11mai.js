import { Directus } from '@directus/sdk';

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

	constructor({ api }) {
		this.api = api;
		this.button = null;
		this._state = false;

		this.tag = 'MARK';
		this.class = 'cdx-marker';
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
		const mark = document.createElement(this.tag);

		mark.classList.add(this.class);
		mark.appendChild(selectedText);
		range.insertNode(mark);

		this.api.selection.expandToTag(mark);
	}

	unwrap(range) {
		let mark = this.api.selection.findParentTag(this.tag, this.class);
		const text = range.extractContents();

		mark.remove();

		range.insertNode(text);
	}

	checkState() {
		const mark = this.api.selection.findParentTag(this.tag);

		this.state = !!mark;

		if (this.state) {
			this.showActions();
		} else {
			this.hideActions();
		}
	}

	renderActions() {
		this.dropdown = document.createElement('select');
		const directus = new Directus('http://localhost:8055');
		directus
			.items('comments')
			.readByQuery({
				fields: ['id', 'title'],
			})
			.then((response) => {
				for (var i = 0; i < response.data.length; i++) {
					var option = document.createElement('option');
					option.value = response.data[i].id;
					option.text = response.data[i].title;
					this.dropdown.appendChild(option);
				}
			})
			.catch((error) => console.error(error));

		this.dropdown.hidden = true;

		return this.dropdown;
	}

	showActions() {
		this.dropdown.onchange = () => {
			if (this.dropdown.selectedIndex) {
				var selectedComment = this.dropdown.selectedIndex;
			}
		};
		this.dropdown.hidden = false;
		if (selectedComment) {
			mark.setAttribute('linked_comment_id','1');

		}
	}

	hideActions() {
		this.dropdown.onchange = null;
		this.dropdown.hidden = true;
	}
	
	static get sanitize() {
		return {
			mark: {
                class: 'cdx-marker',
				linked_comment_id: true
            }
		};
		}
}
