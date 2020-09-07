import $ from 'jquery';
import cuid from 'cuid';
import store from './store';
import api from './api';
import './styles.css';

function generateError(error) {
  return `<div id="thisModal" class="modal" aria-modal="true">
  <div class="modal-content">
   <span class="close">&#88</span>
    <p>${error}</p>
</div>
 </div>`;
};



function renderError() {
  if (store.error) {
    let error = store.error;
    $('.modal').html(generateError(error));
    $('.modal').css('display', 'block');
  } else {
    $('.error-container').empty();
  }
};

function closeBookmark() {
  $('main').click('span', function() {
    console.log('x was clicked')
    $('.modal').css('display', "none");
  })
}

function generateStars(star) {
  let thisString = '';
  for (let i = 0; i < 5; i++) {
    if (i < star) {
      thisString += '&#9733'
    } else {
      thisString += '&#9734'
    }
  }
  return thisString;
}

// function toggleExpanded(){
//     $('main').on('click', '.js-bookmark-element',function(event){
//         event.preventDefault();
//         alert('bookmark clicked');
//         const id = getItemIdFromElement(event.currentTarget);
//         console.log(id);
//         console.log(store.findbyId);
        
//         const item = store.findbyId(id);
//         console.log(item);
//         item.expanded = !(item.expanded);
//         console.log(store.list.bookmarks);
//         render();
//     })
// }

// function toggleCollapse(){
//     $('main').on('click', '#expand', function(event){
//         event.preventDefault();
//         const id = getItemIdFromElement(event.currentTarget);
//         const item = store.findbyId(id);
//         console.log(id);
//         console.log(item);
//         alert('found');
//         item.expanded = !(item.expanded);
//         console.log(store.list.bookmarks);
//         render();
//     })
// }

let generateMainPage = function () {
  return `<section class="upperContainer">
    <div class="newBookmark">
      <button class="newBtn"  type="button">New Bookmark</button>
    </div>
    <div class="filterBy">
      <select id="js-filter" >
        <option value="" selected="selected">Rating Filter</option>            
        <option value="1">${generateStars(1)}</option>
        <option value="2">${generateStars(2)}</option>
        <option value="3">${generateStars(3)}</option>
        <option value="4">${generateStars(4)}</option>
        <option value="5">${generateStars(5)}</option>                                                
      </select>
    </div>
  </section>
  <section role="tabs" class="bookmarks" aria='true'>
    <ul role="tablist" aria-label="Bookmark tabs" class="js-ulBookmarks">
      ${generateBookmarkList()}
    </ul>
  </section>
  <div class="error-container" aria-modal="true">
          <div id="thisModal" class="modal">
  <div class="modal-content">
   <span class="close">&times;</span>
    <p></p>
</div>
</div></div>  `;
}


let render = function () {
  renderError();

  if (store.adding) {
    $('.Main').html(generateAddBookmark())
  } else {
    const bookmarkString = generateMainPage();
    
    $('.Main').html(bookmarkString);
  }
}

let initialize = function () {
  api.getItems()
    .then((bookmark) => {
      bookmark.forEach((bookmar) => store.addBookmark(bookmar))
      
      render();
    });
}

let getId = function (bookmark) {
  return $(bookmark)
    .closest('.js-bookmark-element')
    .data('bookmark-id')
}

let handleAdding = function () {
  $('.Main').on('click', '.newBtn', function () {
  
    store.adding = true;
    render();
  })
}


let generateAddBookmark = function () {
  return `<form class="addBookmarkForm">
        <fieldset name="formField">

          <label class="labels" for="newURL">Bookmark URL: </label>
          <input id="newURL" type="text"  placeholder="URL"><br>
          <br>
          <label for="newName" class="labels">Bookmark Name: </label>
          <input id="newName" type="text"  placeholder="Name"><br>
          <br>
          <label for="newDesc" class="labels">Description: </label>
          <input id='newDesc' type="text"  placeholder="Description"><br>
          <br>
          <label for="newFilter" class="labels">Rating: </label>
          <select id="newFilter" name="addFilter">
            <option value="" selected="selected">Rating</option>            
            <option value="1">${generateStars(1)}</option>
            <option value="2">${generateStars(2)}</option>
            <option value="3">${generateStars(3)}</option>
            <option value="4">${generateStars(4)}</option>
            <option value="5">${generateStars(5)}</option>                                                
          </select>
          <br>
          <div class="subCancelDiv">
            <button class="AddSubmit" id="submit" type="submit">Submit</button>
            <button class="AddCancel" type="button">Cancel</button>
          </div>   
          <div class="error-container">
          <div id="thisModal" aria-modal="true" class="modal">
  <div class="modal-content">
   <span class="close">&times;</span>
    <p></p>
</div>
</div></div>          
        </fieldset>
      </form>`;
}

let handleCancelAdd = function () {
  $('.Main').on('click', '.AddCancel', function () {
    store.adding = false;
    render();
  });
}



let handleExpandClick = function () {
  $('.Main').on('click', '.js-bookmark-element', function (event) {
    let id = getId(event.currentTarget);
    store.toggleExpanded(id);
    render();
  });
}

let handleSubmitBookmark = function () {
  $('.Main').on('submit', '.addBookmarkForm', function (event) {
    event.preventDefault();
    let newBookmark = {
      id: cuid(),
      title: `${$(this).find('#newName').val()}`,
      rating: `${$(this).find('#newFilter').val()}`,
      url: `${$(this).find('#newURL').val()}`,
      desc: `${$(this).find('#newDesc').val()}`
    };
    
    api.createItem(newBookmark)
      .then((newBM) => {
        console.log(newBM)
        store.addBookmark(newBM);
        store.adding = false;
        render();
      })
      .catch((err) => {
        store.setError(err.message);
        renderError();
      });
  });
}




const cancelClicked = function () {
  $('.Main').on('click', '.AddCancel', function () {
    store.adding = false;
    render();
  })
}

const handleDelete = function () {
  $('.Main').on('click', '.Delete', function (event) {
    event.preventDefault();
    const id = getId(event.currentTarget)
    api.deleteItem(id)
      .then(() => {
        store.findAndDelete(id)
        render();
      })
      .catch((error) => {
        store.setError(error.message)
        render();
      })
  })

}


let handleFilterSelection = function () {
  $('.Main').on('change', '#js-filter', function () {
    let filter = $(this).val();
    store.setFilter(filter);
    render();
  })
}


let handleErrorButtonEmpty = function () {
  $('.Main').on('click', '#cancelError', function () {
    store.clearError();
    render()
  })
}
// function generateBookmarkElement(item){
//     //let itemTitle = `<span class="bookmark">${item.title}</span>`;
   

//     return `
    
//     <button class="collapsible">${item.title} ${item.rating}</button>   
//     <div class="content">
//             <p>${item.desc}</p>
//             <p id="rating">${item.rating}</p>
//         </div>
    
//     `;
// }

let generateBookmarkList = function () {
  let bookmarkString = '';
  console.log(store.bookmarks)
  store.bookmarks.forEach((item) => {
    if (item.rating >= store.filter) {
      if (item.expanded) {
        bookmarkString += `<li class="js-bookmark-element" data-bookmark-id="${item.id}">${item.title}
              <br />
              <a  target="_blank" href=${item.url}>Visit </a>
              <p>Rating: ${generateStars(item.rating)}</p>
              <p>${item.desc}</p>
              <div class="deleteBookmark">
            
                <button class="Delete"  type="button">Delete</button>
                <button class="collapse"  type="button">Collapse</button>
            </div>                    
          </li>`
      }
      else {
        bookmarkString += `<button class="js-bookmark-element" data-bookmark-id="${item.id}">
                                  ${item.title}
                                <span class="stars">${generateStars(item.rating)}</span>
                             </button>`;
      }
    }
  })
  return bookmarkString;
}


let bindEventListeners = function () {
  handleAdding();
  handleFilterSelection();
  handleErrorButtonEmpty();
  handleExpandClick();
  handleSubmitBookmark();
  cancelClicked();
  handleDelete();
  handleCancelAdd();
  closeBookmark();
  // handleExpandCancel();
}

export default {
  initialize,
  render,
  bindEventListeners,
}
