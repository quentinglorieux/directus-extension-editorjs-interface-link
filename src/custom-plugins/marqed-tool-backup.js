
import './index.css';

export default class MarqedTool {

static get CSS() {
return 'cdx-marker';
};

constructor({api}) {
this.api = api;
this.button = null;
this.tag = 'mark';
this.iconClasses = {
  base: this.api.styles.inlineToolButton,
  active: this.api.styles.inlineToolButtonActive
};
}

static get isInline() {
return true;
}

render() {
this.button = document.createElement('button');
this.button.type = 'button';
this.button.classList.add(this.iconClasses.base);
this.button.innerHTML = 'Quentin';

return this.button;
}


surround(range) {
if (!range) {
  return;
}

let termWrapper = this.api.selection.findParentTag(this.tag, MarqedTool.CSS);

if (termWrapper) {
  this.unwrap(termWrapper);
} else {
  this.wrap(range);
}
}


wrap(range) {
let marker = document.createElement(this.tag);

marker.classList.add(MarqedTool.CSS);
marker.setAttribute('moncommentaire','1');
marker.appendChild(range.extractContents());
range.insertNode(marker);
this.api.selection.expandToTag(marker);
}

unwrap(termWrapper) {

this.api.selection.expandToTag(termWrapper);

let sel = window.getSelection();
let range = sel.getRangeAt(0);

let unwrappedContent = range.extractContents();
termWrapper.parentNode.removeChild(termWrapper);

range.insertNode(unwrappedContent);

sel.removeAllRanges();
sel.addRange(range);
}

showActions(mark) {
  this.colorPicker.value = mark.style.backgroundColor || '#f5f1cc';

  this.colorPicker.onchange = () => {
      mark.style.backgroundColor = this.colorPicker.value;
  };
  this.colorPicker.hidden = false;
}

/**
* Check and change Term's state for current selection
*/
checkState() {
const termTag = this.api.selection.findParentTag(this.tag, MarqedTool.CSS);

this.button.classList.toggle(this.iconClasses.active, !!termTag);
}


static get sanitize() {
return {
  mark: {
    class: MarqedTool.CSS,
    moncommentaire : '1'
  }
};
}
}
