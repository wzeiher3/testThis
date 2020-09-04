const bookmarks = [];
let adding = false;
let error = null;
let filter = 0;
let expanded = false;

const addBookmark = function(bookmark) {
    bookmark.expanded = false;
    this.bookmarks.push(bookmark)
}

const findById = function(id) {
    return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
}

const toggleExpanded = function(id) {
    let bookmark = this.findById(id);
    bookmark.expanded = !bookmark.expanded;
}

const findAndDelete = function(id) {
    this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id)
}

const setFilter = function(num) {
    this.filter = num;
}

const setError = function(message) {
    this.error = message;
}

const getError = function() {
    return this.error;
}

const clearError = function() {
    this.error = null;
}

export default {
    bookmarks,
    adding,
    error,
    filter,
    addBookmark,
    findById,
    setFilter,
    toggleExpanded,
    findAndDelete,
    setFilter,
    setError,
    getError,
    clearError
}
