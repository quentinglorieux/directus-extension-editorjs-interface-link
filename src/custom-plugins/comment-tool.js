import { Directus } from '@directus/sdk';

export default class CommentTool {

  static get isInline() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'Comment Selector',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 1a1 1 0 011 1v2h7.17l2 2H7v13h8a1 1 0 110 2H5a1 1 0 01-1-1V2a1 1 0 011-1h2zm1 4v10h8V8.83l2-2V17h1V7.83l-2-2V15H8zm4 4h4v1h-4V9zm0 2h4v1h-4v-1zm0 2h4v1h-4v-1z"/></svg>'
    };
  }


  get state() {
    return this._state;
  } 

  set state(state) {
    this._state = state;
  }

  constructor({api, config, data}) {
    this.api = api;
    this.config = config;
    this._state = false;
    this.button = null;
    this.values = [
      'value1',
      'value2',
      'value3'
    ];

    this.tag = 'MARK';
    this.class = 'cdx-marker';
  }

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = this.config.x;
    this.button.classList.add(this.api.styles.inlineToolButton);
    // this.button.addEventListener('click', this.renderDropdown);
    this.button.addEventListener('click', () => {
      
    });

    return this.button;
        
  }


  renderDropdown() {
   
      
      // if (comments.length > 0) {
      //   console.log(comments)
      //   const dropdown  = document.createElement('ul');
      //   dropdown.classList.add('dropdown');
      //   comments.forEach(comment => {
      //     const item = document.createElement('li');
      //     item.textContent = comment.title;
      //     item.addEventListener('click', () => {
      //       this.data.section = window.getSelection().toString();
      //       this.data.commentId = comment.id;
      //       input.value = '';
      //       this.api.inlineToolbar.close();
      //     });
      //     dropdown.appendChild(item);
      //   });
      //   // this.wrapper.appendChild(dropdown);
      // }

     


    
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
    // mark.appendChild(selectedText);
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

    this.state = !!mark;
  
    if (this.state) {
      this.showActions(mark);
    } else {
      this.hideActions();
    }
  }

  renderActions() {
    // const directus = new Directus('http://localhost:8055');
    // let comments = [] ;
    // directus.items('comments').readByQuery({
    //   fields: ['id', 'title'],
    // })
    //   .then(response => {
    //   const dropdown = document.createElement('div');
    //   dropdown.classList.add('my-dropdown-menu');
    //   console.log(response.data)
    //   response.data.forEach(value => {
    //     console.log(value)
    //     let option = document.createElement('div');
    //     option.innerHTML = value.title;
    //     option.addEventListener('click', () => {
    //       // this.api.selection.expandToTag(this.button);
    //       // this.api.inlineToolbar.close();
    //       // this._insertValue(value.title);
    //     });
    //     // dropdown.appendChild(option);
    //     console.log(option)
    //   });
    //   dropdown.hidden = false;

    // return dropdown;

    // }).catch(error => console.error(error));

    
  }

  showActions() {
  }

  hideActions() {

  }


}